import OpenAI from 'openai';

// Placeholder for AI integration (OpenAI/Google Vision API)
export const categorizeExpense = async (text) => {
  // Call AI API here
  return "Food"; // Example
};

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
  console.log('All matched amounts:', allAmounts);
  console.log('Max amount:', maxAmount);
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

// Extract structured expense fields using OpenAI
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

// Debug/test runner for local regex testing (ESM compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  const receiptText = `
Magnolia Bakery
SPAGO FOODS PVT LTD i
F10 A, |
Island F10.B 1st floor.
Phoenix Mall of Asia 3HCR+244,
239/240 Yelahanka Bengaluru 560092 |
Mob No: 9606727455
GSTIN : 29ABLCS8229C120

FSSAI: 21223177002281
SAC: 996339

Type:Take Away Bill No.:T2-T116817

Order No:5 Date :2025-06-26 11:38:08

Delivery Boy: Cashier:Manager 2

Covers:-

Customer Detail

Name: 8088168808

Mobile: 8088168808

Menu Item Qty Rate Amt
LL
Vanilla Cake

with Chocolate

Buttercream

Cake Slice 1 240.00 240.00
Chocolate Cake

with Chocolate

Buttercream

Cake Slice il 240.00 240.00
CLASSIC TRES

LECHES 2 390.00 780.00
Eggless

Classic Tres

Leches 1 410.00 410.00

Total Qty 5
SubTotal: 1670.00
GSTWE18% 300.60

CGST @9% 150230
SGST 09% 150.30
Round Off: 0.40
Total Amount: 1971
PAY:1971

Payment Detail:
a mE
Other 1971.00
Ea i
Amount 1971

Name Phonepe Static Qr

Comment :
hae visit again!
PE CT —_—
`;
  const result = fallbackExtract(receiptText);
  console.log('Test fallbackExtract result:', result);
}