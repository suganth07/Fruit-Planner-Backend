import { Router } from 'express';
import { 
  generatePlan, 
  getUserPlans, 
  getCurrentWeekPlan, 
  deletePlan 
} from '../controllers/plansController';

const router = Router();

// POST /api/plans/generate - Generate new weekly plan
router.post('/generate', generatePlan);

// GET /api/plans/user/:userId - Get all plans for a user
router.get('/user/:userId', getUserPlans);

// GET /api/plans/current/:userId - Get current week plan for a user
router.get('/current/:userId', getCurrentWeekPlan);

// DELETE /api/plans/:planId - Delete a specific plan
router.delete('/:planId', deletePlan);

export default router;
