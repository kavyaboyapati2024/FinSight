import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { generateInsights, predict } from '../controllers/aiController.js';

const router = express.Router();

router.use(protect);

router.post('/insights', generateInsights);
router.post('/predict', predict);

export default router;
