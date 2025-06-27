// Helper: fallback regex extraction for amount and date
function fallbackExtract(text) {
  let amount = null;
  let date = null;
  // Improved regex: only 3+ digit numbers after keywords and after a colon or space
  const totalRegex = /(?:Total Amount|PAY|Total|Amount)[^\d]{0,50}[:\s]+([0-9]{3,7}(?:\.\d{1,2})?)/gim;
  let match, maxAmount = 0, allAmounts = [];
  while ((match = totalRegex.exec(text)) !== null) {
    const val = parseFloat(match[1].replace(/,/g, ''));
    allAmounts.push(match[1]);
    if (!isNaN(val) && val > maxAmount) maxAmount = val;
  }
  if (maxAmount > 0) amount = maxAmount;
  // Try to find date
  const dateMatch = text.match(/(\d{4}[\/-]\d{2}[\/-]\d{2})/) || text.match(/(\d{2}[\/-]\d{2}[\/-]\d{2,4})/);
  if (dateMatch) date = dateMatch[1];
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

// Extract structured expense fields using fallback only (no OpenAI)
export const extractExpenseFields = async (text) => {
  const fallback = fallbackExtract(text);

  return {
    name: guessMerchant(text),
    amount: fallback.amount,
    date: fallback.date,
    category: guessCategory(text),
    items: [],
    paymentMethod: '',
    merchant: guessMerchant(text),
    address: '',
    _debug: { fallbackAmount: fallback.amount }
  };
};