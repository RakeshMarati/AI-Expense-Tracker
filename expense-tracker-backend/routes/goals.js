import express from 'express';
import { getGoals, addGoal } from '../controllers/goalController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getGoals);
router.post('/', auth, addGoal);

export default router;