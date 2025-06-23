import Goal from '../models/Goal.js';

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const addGoal = async (req, res) => {
  const { description, targetAmount, deadline } = req.body;
  try {
    const goal = new Goal({
      user: req.user.id,
      description,
      targetAmount,
      deadline
    });
    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).send('Server error');
  }
};