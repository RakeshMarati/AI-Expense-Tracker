import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'INR', 'EUR']
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    default: 'In Progress',
    enum: ['In Progress', 'Completed', 'Failed']
  }
}, { timestamps: true });

export default mongoose.model('Goal', GoalSchema);