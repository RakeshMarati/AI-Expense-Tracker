import axios from 'axios';

// Add OpenAI integration
let openaiApiKey = process.env.OPENAI_API_KEY;

async function openaiExtract(text) {
  if (!openaiApiKey) throw new Error('OpenAI API key not set');
  const prompt = `Extract the following fields from this receipt text. Return a JSON object with these keys:\n- name: Merchant or store name\n- amount: Total amount paid (number)\n- date: Date of purchase (YYYY-MM-DD)\n- category: Expense category (guess if not explicit)\n- items: Array of objects, each with {name, qty, rate, amount}\n- paymentMethod: Payment method used (e.g., Cash, Card, UPI, PhonePe, etc.)\n- merchant: Merchant or store name (repeat if same as name)\n- address: Store address (if available)\nIf a field is missing, use an empty string or empty array. Here is the receipt text:\n"""\n${text}\n"""\nReturn only the JSON object.`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that extracts structured data from receipts.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 600
    },
    {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  // Try to parse the response as JSON
  let content = response.data.choices[0].message.content;
  try {
    // Remove code block markers if present
    content = content.replace(/^```json|```$/g, '').trim();
    return JSON.parse(content);
  } catch (e) {
    throw new Error('OpenAI response could not be parsed as JSON');
  }
}

// Helper: fallback regex extraction for amount and date
function fallbackExtract(text) {
  let amount = null;
  let date = null;

  // Improved: Only match numbers after amount-related keywords, not Bill No.
  const amountKeywords = [
    'Amount Paid', 'Nett Amt', 'Net Amount', 'Total Amt', 'Total Amount', 'PAY', 'Amount', 'Grand Total', 'Total', 'Paid', 'Cash', 'Balance Due'
  ];
  let maxAmount = 0;
  let found = false;

  for (let keyword of amountKeywords) {
    // Regex: keyword followed by optional non-digits, then a number
    const regex = new RegExp(`${keyword}[^\d\n]{0,20}([0-9]{1,7}(?:\.[0-9]{1,2})?)`, 'i');
    const match = text.match(regex);
    if (match) {
      const val = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(val) && val > maxAmount) {
        maxAmount = val;
        found = true;
      }
    }
  }

  // Fallback: If nothing found, use the largest number in the text (but skip Bill No. and similar fields)
  if (!found) {
    // Remove lines with Bill No., Invoice No., etc.
    const filteredText = text.split('\n').filter(line => !/bill no|invoice no|order no|patient id|id[:\s]/i.test(line)).join('\n');
    const allNums = filteredText.match(/[0-9]{1,7}(?:\.[0-9]{1,2})?/g) || [];
    for (let n of allNums) {
      const val = parseFloat(n.replace(/,/g, ''));
      if (!isNaN(val) && val > maxAmount) maxAmount = val;
    }
  }

  if (maxAmount > 0) amount = maxAmount;

  // Date extraction (as before)
  const dateMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
  if (dateMatch) {
    let dateStr = dateMatch[1];
    // Convert DD-MM-YYYY or DD/MM/YYYY to YYYY-MM-DD
    const [dd, mm, yyyy] = dateStr.split(/[\/\-]/);
    date = `${yyyy}-${mm}-${dd}`;
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

// Extract structured expense fields using hybrid approach
export const extractExpenseFields = async (text) => {
  // Try OpenAI extraction first
  try {
    const aiResult = await openaiExtract(text);
    // Validate required fields (amount, date, name)
    if (aiResult && aiResult.amount && aiResult.date && aiResult.name) {
      return { ...aiResult, _debug: { method: 'openai' } };
    }
    // If OpenAI returns incomplete, fallback
  } catch (err) {
    // Fallback to regex/heuristics
  }
  // Fallback extraction
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
    _debug: { fallbackAmount: fallback.amount, method: 'fallback' }
  };
};