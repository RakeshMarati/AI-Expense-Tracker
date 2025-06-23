import express from 'express';
import { getExpenses, addExpense } from '../controllers/expenseController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getExpenses);
router.post('/', auth, addExpense);

export default router;