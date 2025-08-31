import { Router } from 'express';
import { getUserProfile, updateUserProfile, updateUserConditions, getPersonalizedFruits } from '../controllers/usersController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/users/profile - Get user profile
router.get('/profile', getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', updateUserProfile);

// PUT /api/users/conditions - Update user conditions
router.put('/conditions', updateUserConditions);

// GET /api/users/personalized-fruits - Get personalized fruit recommendations
router.get('/personalized-fruits', getPersonalizedFruits);

export default router;
