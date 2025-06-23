import express from 'express';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../controllers/goalController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getGoals);
router.post('/', auth, addGoal);
router.put('/:id', auth, updateGoal);   
router.delete('/:id', auth, deleteGoal); 

export default router;