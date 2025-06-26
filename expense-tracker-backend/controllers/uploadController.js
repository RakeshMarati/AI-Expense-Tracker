import Tesseract from 'tesseract.js';
import fs from 'fs';
import { extractExpenseFields } from '../utilis/ai.js';

export const uploadReceipt = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

  try {
    const filePath = req.file.path;

    // Run OCR on the uploaded image
    const result = await Tesseract.recognize(filePath, 'eng');
    const text = result.data.text;

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Extract structured fields using OpenAI
    const extracted = await extractExpenseFields(text);
    res.json(extracted);
  } catch (err) {
    console.error('Upload Receipt Error:', err);
    res.status(500).json({ error: 'Failed to process receipt', details: err.message });
  }
};