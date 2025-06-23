import Expense from '../models/Expense.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const addExpense = async (req, res) => {
  const { name, amount, category, date } = req.body;
  try {
    const expense = new Expense({
      user: req.user.id,
      name,
      amount,
      category,
      date
    });
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).send('Server error');
  }
};