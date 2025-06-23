import Goal from '../models/Goal.js';

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const addGoal = async (req, res) => {
  const { description, targetAmount, currency, deadline } = req.body; // <-- add currency here
  try {
    const goal = new Goal({
      user: req.user.id,
      description,
      targetAmount,
      currency, // <-- add currency here
      deadline
    });
    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const updateGoal = async (req, res) => {
  const { description, targetAmount, currency, deadline, status } = req.body;
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { description, targetAmount, currency, deadline, status },
      { new: true }
    );
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    res.json({ msg: 'Goal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};