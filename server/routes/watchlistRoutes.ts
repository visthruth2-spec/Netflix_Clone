import express from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../controllers/watchlistController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getWatchlist);
router.post('/add', addToWatchlist);
router.delete('/:movieId', removeFromWatchlist);

export default router;
