import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Movie, IMovie } from '../models/Movie.js';
import { User, IUser } from '../models/User.js';
import { Watchlist, IWatchlist } from '../models/Watchlist.js';
import { seedMovies, MovieSeedItem } from './seedData.js';

// In-memory backing store for zero-config mode
class InMemoryDataStore {
  movies: any[] = [];
  users: any[] = [];
  watchlists: { userId: string; profileId: string; movieIds: string[] }[] = [];

  constructor() {
    this.initDefaultSeed();
  }

  async initDefaultSeed() {
    if (this.movies.length === 0) {
      this.movies = seedMovies.map((item, index) => {
        const languages = item.languages && item.languages.length > 0
          ? item.languages
          : [item.language];
        return {
          ...item,
          languages,
          _id: `m_${index + 1}_${Date.now()}`,
          id: `m_${index + 1}_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
    }

    if (this.users.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      this.users = [
        {
          _id: 'u_demo_1',
          id: 'u_demo_1',
          name: 'College Project Demo',
          phoneNumber: '9876543210',
          email: 'demo@netflixmern.test',
          password: hashedPassword,
          profiles: [
            {
              id: 'profile-1',
              name: 'Profile-1',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              isKids: false,
            },
            {
              id: 'profile-2',
              name: 'Profile-2',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
              isKids: false,
            },
          ],
          activeProfileId: 'profile-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Initial watchlist with 2 movies
      if (this.movies.length > 0) {
        this.watchlists.push({
          userId: 'u_demo_1',
          profileId: 'profile-1',
          movieIds: [this.movies[0]._id, this.movies[1]._id],
        });
      }
    }
  }
}

export const inMemoryDb = new InMemoryDataStore();

export const isMongooseReady = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// Seed MongoDB if connected, or memory store
export const seedDatabase = async () => {
  if (isMongooseReady()) {
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('🌱 Seeding MongoDB Atlas with initial Netflix catalog...');
      await Movie.insertMany(seedMovies);
      console.log('✅ MongoDB Atlas seeded successfully with movies.');
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      const demoUser = await User.create({
        name: 'College Project Demo',
        phoneNumber: '9876543210',
        email: 'demo@netflixmern.test',
        password: hashedPassword,
        profiles: [
          {
            id: 'profile-1',
            name: 'Profile-1',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            isKids: false,
          },
          {
            id: 'profile-2',
            name: 'Profile-2',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            isKids: false,
          },
        ],
        activeProfileId: 'profile-1',
      });

      const firstMovies = await Movie.find().limit(2);
      if (firstMovies.length > 0) {
        await Watchlist.create({
          userId: (demoUser._id as any).toString(),
          profileId: 'profile-1',
          movieIds: firstMovies.map((m) => (m._id as any).toString()),
        });
      }
      console.log('✅ MongoDB Atlas seeded with default user and watchlist.');
    }
  } else {
    await inMemoryDb.initDefaultSeed();
  }
};
