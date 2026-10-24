import express from 'express';
import {
  register,
  login,
  getMe,
  updateMe,
  addProfile,
  switchProfile,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify', register); // Alias for wireframe Page 8 Verification
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/me', authenticateToken, updateMe);
router.post('/profile/add', authenticateToken, addProfile);
router.post('/profile/switch', authenticateToken, switchProfile);

export default router;
