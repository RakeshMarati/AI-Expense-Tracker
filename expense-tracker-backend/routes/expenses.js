import express from 'express';
import { getExpenses, addExpense, deleteExpense } from '../controllers/expenseController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getExpenses);
router.post('/', auth, addExpense);
router.delete('/:id', auth, deleteExpense);

export default router;