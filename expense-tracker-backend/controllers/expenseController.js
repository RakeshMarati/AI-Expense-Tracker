import Expense from '../models/Expense.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (err) {
    console.error('Get Expenses Error:', err);
    res.status(500).send('Server error');
  }
};

export const addExpense = async (req, res) => {
  const { name, amount, category, date, currency } = req.body;
  try {
    // Validate required fields
    if (!name || !amount || !category || !date) {
      return res.status(400).json({ 
        msg: 'Missing required fields: name, amount, category, and date are required' 
      });
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ 
        msg: 'Invalid date format. Please use YYYY-MM-DD format' 
      });
    }

    // Validate amount
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ 
        msg: 'Invalid amount. Please provide a positive number' 
      });
    }

    const expense = new Expense({
      user: req.user.id,
      name,
      amount: numAmount,
      category,
      date: parsedDate,
      currency: currency || 'INR'
    });
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error('Add Expense Error:', err);
    res.status(500).json({ 
      msg: 'Server error', 
      error: err.message 
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    res.json({ msg: 'Expense deleted' });
  } catch (err) {
    console.error('Delete Expense Error:', err);
    res.status(500).send('Server error');
  }
};

export const updateExpense = async (req, res) => {
  const { name, amount, category, date, currency } = req.body;
  try {
    const updateFields = { name, amount, category, date };
    if (currency) updateFields.currency = currency;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateFields,
      { new: true }
    );
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    console.error('Update Expense Error:', err);
    res.status(500).send('Server error');
  }
};