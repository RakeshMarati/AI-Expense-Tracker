import Tesseract from 'tesseract.js';
import fs from 'fs';
import { categorizeExpense } from '../utilis/ai.js';

export const uploadReceipt = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

  try {
    const filePath = req.file.path;

    // Run OCR on the uploaded image
    const result = await Tesseract.recognize(filePath, 'eng');
    const text = result.data.text;

    // Correct regex (single backslash)
    const amountMatch = text.match(/\$?\d+[.,]?\d{0,2}/);
    const dateMatch = text.match(/\d{2}[\/\-]\d{2}[\/\-]\d{2,4}/);

    // AI category prediction
    const category = await categorizeExpense(text);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      text,
      amount: amountMatch ? amountMatch[0] : '',
      date: dateMatch ? dateMatch[0] : '',
      category: category || '',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process receipt', details: err.message });
  }
};