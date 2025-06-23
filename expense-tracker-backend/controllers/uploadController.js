export const uploadReceipt = async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
  // Here you would call your AI/OCR logic
  res.json({ url: `/uploads/${req.file.filename}` });
};