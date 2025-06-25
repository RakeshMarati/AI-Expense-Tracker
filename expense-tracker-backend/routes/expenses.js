import express from 'express';
import { getExpenses, addExpense, deleteExpense, updateExpense } from '../controllers/expenseController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getExpenses);
router.post('/', auth, addExpense);
router.delete('/:id', auth, deleteExpense);
router.put('/:id', auth, updateExpense);

export default router;