import { Router } from 'express';
import { 
  saveUserFruits, 
  getUserFruits, 
  getUserFruitsForWeek 
} from '../controllers/userFruitController';

const router = Router();

// Save user's selected fruits
router.post('/save', saveUserFruits);

// Get user's selected fruit IDs
router.get('/:userId', getUserFruits);

// Get user's fruit selections organized by week
router.get('/:userId/week', getUserFruitsForWeek);

export default router;
