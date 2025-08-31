import { Router } from 'express';
import { getAllFruits, getPersonalizedFruits, getRecommendedFruits } from '../controllers/fruitsController';

const router = Router();

// GET /api/fruits - Get all fruits
router.get('/', getAllFruits);

// GET /api/fruits/personalized/:userId - Get personalized fruits based on user's conditions
router.get('/personalized/:userId', getPersonalizedFruits);

// GET /api/fruits/recommended/:userId - Get only recommended fruits for user
router.get('/recommended/:userId', getRecommendedFruits);

// GET /api/fruits/:id - Get fruit by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get fruit by ID endpoint - Coming soon' });
});

// POST /api/fruits - Create new fruit (admin only)
router.post('/', (req, res) => {
  res.json({ message: 'Create fruit endpoint - Coming soon' });
});

export default router;
