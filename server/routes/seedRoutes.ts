import express from 'express';
import { seedDatabase, inMemoryDb, isMongooseReady } from '../data/store.js';
import { Movie } from '../models/Movie.js';
import { User } from '../models/User.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

router.get('/status', (req, res) => {
  const status = getDbStatus();
  res.json({
    success: true,
    status,
    counts: {
      movies: isMongooseReady() ? 'Connected via Mongoose' : inMemoryDb.movies.length,
      users: isMongooseReady() ? 'Connected via Mongoose' : inMemoryDb.users.length,
    },
  });
});

router.post('/reset', async (req, res) => {
  try {
    if (isMongooseReady()) {
      await Movie.deleteMany({});
      await User.deleteMany({});
    } else {
      inMemoryDb.movies = [];
      inMemoryDb.users = [];
      inMemoryDb.watchlists = [];
    }
    await seedDatabase();
    res.json({ success: true, message: 'Database successfully re-seeded with Netflix catalog!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
