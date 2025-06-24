import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // if you have auth
  text: String,
  amount: String,
  date: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Receipt', ReceiptSchema);