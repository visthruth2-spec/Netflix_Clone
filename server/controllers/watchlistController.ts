import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Watchlist } from '../models/Watchlist.js';
import { Movie } from '../models/Movie.js';
import { isMongooseReady, inMemoryDb } from '../data/store.js';

export const getWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const profileId = (req.query.profileId as string) || req.user?.activeProfileId || 'profile-1';

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (isMongooseReady()) {
      let wl = await Watchlist.findOne({ userId, profileId });
      if (!wl) {
        wl = await Watchlist.create({ userId, profileId, movieIds: [] });
      }

      // Fetch the actual movies
      const movies = await Movie.find({ _id: { $in: wl.movieIds } });
      return res.json({
        success: true,
        count: movies.length,
        movieIds: wl.movieIds,
        data: movies,
      });
    }

    let wl = inMemoryDb.watchlists.find((w) => w.userId === userId && w.profileId === profileId);
    if (!wl) {
      wl = { userId, profileId, movieIds: [] };
      inMemoryDb.watchlists.push(wl);
    }

    const movies = inMemoryDb.movies.filter((m) => wl?.movieIds.includes(m._id || m.id));
    return res.json({
      success: true,
      count: movies.length,
      movieIds: wl.movieIds,
      data: movies,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const profileId = (req.body.profileId as string) || req.user?.activeProfileId || 'profile-1';
    const { movieId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'movieId is required' });
    }

    if (isMongooseReady()) {
      let wl = await Watchlist.findOne({ userId, profileId });
      if (!wl) {
        wl = new Watchlist({ userId, profileId, movieIds: [movieId] });
      } else {
        if (!wl.movieIds.includes(movieId)) {
          wl.movieIds.push(movieId);
        }
      }
      await wl.save();

      return res.json({
        success: true,
        message: 'Added to watchlist',
        movieIds: wl.movieIds,
      });
    }

    let wl = inMemoryDb.watchlists.find((w) => w.userId === userId && w.profileId === profileId);
    if (!wl) {
      wl = { userId, profileId, movieIds: [movieId] };
      inMemoryDb.watchlists.push(wl);
    } else {
      if (!wl.movieIds.includes(movieId)) {
        wl.movieIds.push(movieId);
      }
    }

    return res.json({
      success: true,
      message: 'Added to watchlist',
      movieIds: wl.movieIds,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const profileId = (req.body.profileId as string) || req.user?.activeProfileId || 'profile-1';
    const { movieId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!movieId) {
      return res.status(400).json({ success: false, message: 'movieId is required' });
    }

    if (isMongooseReady()) {
      let wl = await Watchlist.findOne({ userId, profileId });
      if (wl) {
        wl.movieIds = wl.movieIds.filter((id: string) => id !== movieId);
        await wl.save();
      }

      return res.json({
        success: true,
        message: 'Removed from watchlist',
        movieIds: wl ? wl.movieIds : [],
      });
    }

    let wl = inMemoryDb.watchlists.find((w) => w.userId === userId && w.profileId === profileId);
    if (wl) {
      wl.movieIds = wl.movieIds.filter((id: string) => id !== movieId);
    }

    return res.json({
      success: true,
      message: 'Removed from watchlist',
      movieIds: wl ? wl.movieIds : [],
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
