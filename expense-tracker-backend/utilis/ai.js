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

// Extract structured expense fields using OpenAI
export const extractExpenseFields = async (text) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `Extract the following fields from this receipt or bill text:
- merchant (store/restaurant name or biller)
- address (if available)
- date (YYYY-MM-DD)
- total amount (numeric)
- payment method (e.g., cash, card, UPI, etc.)
- category (guess from context, e.g., Food, Shopping, Electricity, Internet, etc.)
- items (list of {name, quantity, price}) — only if this is a shopping or food receipt; omit for bills like electricity, internet, rent, etc.

Receipt text:
"""
${text}
"""

Respond in this JSON format:
{
  "name": "",
  "amount": "",
  "date": "",
  "category": "",
  "items": [], // omit or leave empty for bills
  "paymentMethod": "",
  "merchant": "",
  "address": ""
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an assistant that extracts structured expense data from receipts, bills, or invoices.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1,
    max_tokens: 500,
  });

  // Try to parse the response as JSON
  let extracted;
  try {
    const match = response.choices[0].message.content.match(/\{[\s\S]*\}/);
    if (match) {
      extracted = JSON.parse(match[0]);
    } else {
      throw new Error('No JSON found in AI response');
    }
  } catch (err) {
    return { error: 'Failed to parse OpenAI response', details: err.message, raw: response.choices[0].message.content };
  }

  // Post-processing/validation
  if (extracted.amount && typeof extracted.amount === 'string') {
    const num = parseFloat(extracted.amount.replace(/,/g, ''));
    if (!isNaN(num)) extracted.amount = num;
    else delete extracted.amount;
  }
  if (extracted.date && typeof extracted.date === 'string') {
    // Try to match YYYY-MM-DD or YYYY/MM/DD
    let d = extracted.date.match(/(\d{4})[\/-](\d{2})[\/-](\d{2})/);
    if (d) {
      extracted.date = `${d[1]}-${d[2]}-${d[3]}`;
    } else {
      // Try to match DD-MM-YY or DD-MM-YYYY and convert
      d = extracted.date.match(/(\d{2})[\/-](\d{2})[\/-](\d{2,4})/);
      if (d) {
        let year = d[3].length === 2 ? '20' + d[3] : d[3];
        extracted.date = `${year}-${d[2]}-${d[1]}`;
      }
    }
  }
  if (extracted.items && Array.isArray(extracted.items)) {
    extracted.items = extracted.items.filter(item => item.name && item.price);
    extracted.items.forEach(item => {
      if (typeof item.price === 'string') {
        const p = parseFloat(item.price.replace(/,/g, ''));
        if (!isNaN(p)) item.price = p;
      }
      if (item.quantity && typeof item.quantity === 'string') {
        const q = parseInt(item.quantity);
        if (!isNaN(q)) item.quantity = q;
      }
    });
  }

  // Ensure name is present
  if (!extracted.name || extracted.name.trim() === '') {
    // Try to use first item name if available
    if (extracted.items && extracted.items.length > 0 && extracted.items[0].name) {
      extracted.name = extracted.items[0].name;
    } else if (extracted.merchant) {
      extracted.name = extracted.merchant;
    } else {
      extracted.name = 'Unknown';
    }
  }

  // Fallback extraction for amount/date if missing or suspicious
  const fallback = fallbackExtract(text);
  if (!extracted.amount || (fallback.amount && fallback.amount > extracted.amount)) {
    extracted.amount = fallback.amount;
  }
  if (!extracted.date && fallback.date) {
    extracted.date = fallback.date;
  }

  console.log('Extracted fields:', extracted);
  return extracted;
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