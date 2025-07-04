import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { firstName, lastName, age, gender, mobile, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ firstName, lastName, age, gender, mobile, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      // Exclude password from user info
      const { password, ...userInfo } = user.toObject();
      res.json({ token, user: userInfo });
    });
  } catch (err) {
    console.error('Registration error:', err); // <-- Add this line
    res.status(500).json({ message: 'Server error', error: err.message }); // <-- Add error message
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      // Exclude password from user info
      const { password, ...userInfo } = user.toObject();
      res.json({ token, user: userInfo });
    });
  } catch (err) {
    console.error('Login error:', err); // <-- Add this line
    res.status(500).json({ message: 'Server error', error: err.message }); // <-- Add error message
  }
};