import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './server/config/db.js';
import { seedDatabase } from './server/data/store.js';
import movieRoutes from './server/routes/movieRoutes.js';
import authRoutes from './server/routes/authRoutes.js';
import watchlistRoutes from './server/routes/watchlistRoutes.js';
import seedRoutes from './server/routes/seedRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  // Initialize DB and Seed
  await connectDB();
  await seedDatabase();

  // API Routes
  app.use('/api/movies', movieRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/watchlist', watchlistRoutes);
  app.use('/api/system', seedRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'Netflix MERN Stack Express API' });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 Netflix MERN Full-Stack Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
