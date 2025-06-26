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
  // Find all numbers after "Total", "Amount", or "PAY"
  const allAmounts = [...text.matchAll(/(?:Total|Amount|PAY)[:=]?\s*([\d.,]+)/gi)];
  if (allAmounts.length > 0) {
    amount = Math.max(...allAmounts.map(m => parseFloat(m[1].replace(/,/g, ''))));
  }
  // Try to find date
  const dateMatch = text.match(/(\d{4}[\/\-]\d{2}[\/\-]\d{2})/) || text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/);
  if (dateMatch) date = dateMatch[1];
  return { amount, date };
}

// Extract structured expense fields using OpenAI
export const extractExpenseFields = async (text) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `You are an intelligent assistant for an AI-based Expense Tracker.\n\nExtract the following fields from the provided receipt or bill text. Use keyword recognition (e.g., \"Date\", \"Total\", \"Amount\", \"Paid by\", \"To\", etc.) and layout analysis. Only return fields you are confident about; if a field is missing or unclear, return null or omit it. Output only valid JSON.\n\nFields:\n- merchant (vendor/place)\n- date (date of transaction)\n- amount (total amount)\n- currency (₹, $, etc.)\n- items (list of item names, prices, and quantities if available)\n- paymentMethod (e.g., Credit Card, UPI, Cash)\n- category (purpose, e.g., Food, Travel, Utilities)\n\nText:\n\"\"\"\n${text}\n\"\"\"`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an assistant that extracts structured expense data from receipts, bills, or invoices.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0,
    max_tokens: 500,
  });

  // Try to parse the response as JSON
  let extracted;
  try {
    const jsonString = response.choices[0].message.content.trim();
    extracted = JSON.parse(jsonString);
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

  return extracted;
};