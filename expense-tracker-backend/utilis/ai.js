// Helper: fallback regex extraction for amount and date
function fallbackExtract(text) {
  let amount = null;
  let date = null;
  // Try to match numbers after keywords
  const totalRegex = /(?:Total Amount|PAY|Total|Amount)[^\d]{0,50}[:\s]*([0-9]{2,7}(?:\.\d{1,2})?)/gim;
  let match, maxAmount = 0, allAmounts = [];
  while ((match = totalRegex.exec(text)) !== null) {
    const val = parseFloat(match[1].replace(/,/g, ''));
    allAmounts.push(match[1]);
    if (!isNaN(val) && val > maxAmount) maxAmount = val;
  }
  // If nothing found, fallback to largest number in the text
  if (maxAmount === 0) {
    const allNums = text.match(/[0-9]{2,7}(?:\.\d{1,2})?/g) || [];
    for (let n of allNums) {
      const val = parseFloat(n.replace(/,/g, ''));
      if (!isNaN(val) && val > maxAmount) maxAmount = val;
    }
  }
  if (maxAmount > 0) amount = maxAmount;
  
  // Try to find date and format it properly
  const dateMatch = text.match(/(\d{4}[\/-]\d{2}[\/-]\d{2})/) || text.match(/(\d{2}[\/-]\d{2}[\/-]\d{2,4})/);
  if (dateMatch) {
    let dateStr = dateMatch[1];
    // Convert DD-MM-YYYY to YYYY-MM-DD
    if (/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split(/[\/-]/);
      date = `${yyyy}-${mm}-${dd}`;
    }
    // Convert DD-MM-YY to YYYY-MM-DD
    else if (/^\d{2}[\/-]\d{2}[\/-]\d{2}$/.test(dateStr)) {
      const [dd, mm, yy] = dateStr.split(/[\/-]/);
      date = `20${yy}-${mm}-${dd}`;
    }
    // Already in YYYY-MM-DD format
    else if (/^\d{4}[\/-]\d{2}[\/-]\d{2}$/.test(dateStr)) {
      date = dateStr.replace(/[\/-]/g, '-');
    }
  }
  
  return { amount, date };
}

// Helper: Guess merchant/store name from text
function guessMerchant(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (let line of lines) {
    if (
      line.length > 2 &&
      !line.match(/invoice|bill|receipt|date|gst|fssai|mob|phone|order|type|amount|total|qty|payment|address|sac|comment|manager|cashier|customer|covers|detail|no\./i)
    ) {
      return line;
    }
  }
  return 'Unknown';
}

// Helper: Guess category from text
function guessCategory(text) {
  const lower = text.toLowerCase();
  if (lower.includes('electricity') || lower.includes('power')) return 'Bills';
  if (lower.includes('internet') || lower.includes('broadband')) return 'Bills';
  if (lower.includes('milk') || lower.includes('grocery') || lower.includes('food') || lower.includes('bakery') || lower.includes('cake')) return 'Food';
  if (lower.includes('movie') || lower.includes('cinema')) return 'Entertainment';
  if (lower.includes('bus') || lower.includes('taxi') || lower.includes('uber') || lower.includes('ola') || lower.includes('train')) return 'Transport';
  if (lower.includes('medicine') || lower.includes('pharmacy') || lower.includes('hospital')) return 'Medical Fees';
  if (lower.includes('shopping') || lower.includes('mall')) return 'Shopping';
  return 'Other';
}

// Extract line items from receipt text
function extractItems(text) {
  const lines = text.split('\n');
  const items = [];
  let inItemsSection = false;
  for (let line of lines) {
    if (line.toLowerCase().includes('menu item')) {
      inItemsSection = true;
      continue;
    }
    if (inItemsSection && (line.toLowerCase().includes('total qty') || line.toLowerCase().includes('subtotal'))) {
      break;
    }
    if (inItemsSection) {
      // Try to parse: "Vanilla Cake ... 1 240.00 240.00"
      const match = line.match(/(.+?)\s+(\d+)\s+([\d.]+)\s+([\d.]+)/);
      if (match) {
        items.push({
          name: match[1].trim(),
          qty: parseInt(match[2]),
          rate: parseFloat(match[3]),
          amount: parseFloat(match[4])
        });
      }
    }
  }
  return items;
}

// Extract payment method from receipt text
function extractPaymentMethod(text) {
  const match = text.match(/Payment Detail[\s\S]{0,100}Name[:\s]+([A-Za-z0-9\s]+)/i);
  if (match) return match[1].trim();
  // Try fallback for common payment methods
  if (/phonepe/i.test(text)) return "PhonePe";
  if (/gpay|google pay/i.test(text)) return "Google Pay";
  if (/cash/i.test(text)) return "Cash";
  if (/card/i.test(text)) return "Card";
  return "";
}

// Extract address from receipt text
function extractAddress(text) {
  // Heuristic: lines after merchant name, before GSTIN or similar
  const lines = text.split('\n').map(l => l.trim());
  let merchantIdx = -1, gstIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes('bakery') || lines[i].toLowerCase().includes('spago foods')) merchantIdx = i;
    if (lines[i].toLowerCase().includes('gstin')) gstIdx = i;
  }
  if (merchantIdx >= 0 && gstIdx > merchantIdx) {
    return lines.slice(merchantIdx + 1, gstIdx).join(', ');
  }
  return "";
}

// Extract structured expense fields using fallback only (no OpenAI)
export const extractExpenseFields = async (text) => {
  const fallback = fallbackExtract(text);

  return {
    name: guessMerchant(text),
    amount: fallback.amount,
    date: fallback.date,
    category: guessCategory(text),
    items: extractItems(text),
    paymentMethod: extractPaymentMethod(text),
    merchant: guessMerchant(text),
    address: extractAddress(text),
    _debug: { fallbackAmount: fallback.amount }
  };
};