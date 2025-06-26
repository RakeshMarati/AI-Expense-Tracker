import OpenAI from 'openai';

// Placeholder for AI integration (OpenAI/Google Vision API)
export const categorizeExpense = async (text) => {
  // Call AI API here
  return "Food"; // Example
};

// Extract structured expense fields using OpenAI
export const extractExpenseFields = async (text) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `Extract the following fields from the receipt or expense text below. If a field is missing, return null or skip it. Respond only with valid JSON.\n\nFields:\n- Merchant Name\n- Date of Transaction\n- Total Amount\n- Currency\n- Items (list of item names and prices if available)\n- Payment Method (optional)\n- Category (e.g., Food, Travel, Office Supplies, etc.)\n\nText:\n"""\n${text}\n"""`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an assistant that extracts structured expense data from receipts, bills, or invoices.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0,
    max_tokens: 400,
  });

  // Try to parse the response as JSON
  try {
    const jsonString = response.choices[0].message.content.trim();
    return JSON.parse(jsonString);
  } catch (err) {
    return { error: 'Failed to parse OpenAI response', details: err.message, raw: response.choices[0].message.content };
  }
};