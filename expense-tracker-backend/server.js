import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import fs from 'fs';

import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import goalRoutes from './routes/goals.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();
connectDB();

const app = express();

// Logging middleware for debugging CORS issues
app.use((req, res, next) => {
  console.log('Request origin:', req.headers.origin, 'Path:', req.path, 'Method:', req.method);
  next();
});

const allowedOrigins = [
  'https://ai-expense-tracker-7amg.vercel.app',
  'https://ai-expense-tracker-7am-git-3df9dd-rakesh-kumar-maratis-projects.vercel.app',
  'https://ai-expense-tracker-gray.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS check for origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/receipts', uploadRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));