import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
  getAccountStats
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.use(protect); // Protect all routes below

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.get('/stats', getAccountStats);

export default router;
