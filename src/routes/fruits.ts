import { Router } from 'express';

const router = Router();

// GET /api/fruits - Get all fruits
router.get('/', (req, res) => {
  res.json({ message: 'Get all fruits endpoint - Coming soon' });
});

// GET /api/fruits/recommended - Get recommended fruits based on conditions
router.get('/recommended', (req, res) => {
  res.json({ message: 'Get recommended fruits endpoint - Coming soon' });
});

// GET /api/fruits/:id - Get fruit by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get fruit by ID endpoint - Coming soon' });
});

// POST /api/fruits - Create new fruit (admin only)
router.post('/', (req, res) => {
  res.json({ message: 'Create fruit endpoint - Coming soon' });
});

export default router;
