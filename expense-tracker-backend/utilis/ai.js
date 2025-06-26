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
  // Try to find total amount
  const amountMatch = text.match(/Total\s*[:=]?\s*([\d.,]+)/i) || text.match(/Amount\s*[:=]?\s*([\d.,]+)/i);
  if (amountMatch) amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  // Try to find date
  const dateMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/) || text.match(/(\d{4}[\/\-]\d{2}[\/\-]\d{2})/);
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
    // Normalize date to YYYY-MM-DD if possible
    const d = extracted.date.match(/(\d{2,4})[\/\-](\d{2})[\/\-](\d{2,4})/);
    if (d) {
      // Try to format as YYYY-MM-DD
      let y = d[1], m = d[2], day = d[3];
      if (y.length === 2) y = '20' + y;
      if (day.length === 4) [y, day] = [day, y];
      extracted.date = `${y}-${m}-${day}`;
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

  // Fallback extraction for amount/date if missing
  if (!extracted.amount || !extracted.date) {
    const fallback = fallbackExtract(text);
    if (!extracted.amount && fallback.amount) extracted.amount = fallback.amount;
    if (!extracted.date && fallback.date) extracted.date = fallback.date;
  }

  return extracted;
};