import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './data/store.js';
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import seedRoutes from './routes/seedRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/system', seedRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Standalone Server
export const startStandaloneServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Standalone Netflix MERN Backend running on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== 'test' && !process.env.AIS_EMBEDDED) {
  startStandaloneServer();
}

export default app;
