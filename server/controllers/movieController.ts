import { Request, Response } from 'express';
import { Movie } from '../models/Movie.js';
import { isMongooseReady, inMemoryDb } from '../data/store.js';

export const getMovies = async (req: Request, res: Response) => {
  try {
    const { type, category, language, genre, limit } = req.query;

    if (isMongooseReady()) {
      const filter: any = {};
      if (type) filter.type = type;
      if (category) filter.category = category;
      if (language) filter.language = language;
      if (genre) filter.genres = { $in: [genre] };

      let query = Movie.find(filter);
      if (limit) query = query.limit(Number(limit));
      const movies = await query.exec();
      return res.json({ success: true, count: movies.length, data: movies });
    }

    // In-memory fallback
    let results = [...inMemoryDb.movies];
    if (type) {
      results = results.filter((m) => m.type.toLowerCase() === String(type).toLowerCase());
    }
    if (category) {
      results = results.filter((m) => m.category.toLowerCase() === String(category).toLowerCase());
    }
    if (language) {
      results = results.filter((m) => m.language.toLowerCase() === String(language).toLowerCase());
    }
    if (genre) {
      results = results.filter((m) =>
        m.genres.some((g: string) => g.toLowerCase() === String(genre).toLowerCase())
      );
    }
    if (limit) {
      results = results.slice(0, Number(limit));
    }

    return res.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongooseReady()) {
      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }
      return res.json({ success: true, data: movie });
    }

    const movie = inMemoryDb.movies.find((m) => m._id === id || m.id === id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    return res.json({ success: true, data: movie });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchMovies = async (req: Request, res: Response) => {
  try {
    const { q, language, genre } = req.query;
    const rawQ = String(q || '').trim();
    const rawLang = String(language || '').trim();
    const rawGenre = String(genre || '').trim();

    const queryStr = (rawQ === 'undefined' || rawQ === 'null' ? '' : rawQ).toLowerCase();
    const langStr = (rawLang === 'undefined' || rawLang === 'null' ? '' : rawLang).toLowerCase();
    const genreStr = (rawGenre === 'undefined' || rawGenre === 'null' ? '' : rawGenre).toLowerCase();

    if (isMongooseReady()) {
      const filter: any = {};
      const conditions: any[] = [];

      if (queryStr) {
        conditions.push({
          $or: [
            { title: { $regex: queryStr, $options: 'i' } },
            { synopsis: { $regex: queryStr, $options: 'i' } },
            { director: { $regex: queryStr, $options: 'i' } },
            { cast: { $elemMatch: { $regex: queryStr, $options: 'i' } } },
            { genres: { $elemMatch: { $regex: queryStr, $options: 'i' } } },
            { language: { $regex: queryStr, $options: 'i' } },
            { languages: { $elemMatch: { $regex: queryStr, $options: 'i' } } },
          ],
        });
      }

      if (langStr) {
        conditions.push({
          $or: [
            { language: { $regex: langStr, $options: 'i' } },
            { languages: { $elemMatch: { $regex: langStr, $options: 'i' } } },
            { category: { $regex: langStr, $options: 'i' } },
          ],
        });
      }

      if (genreStr) {
        conditions.push({
          genres: { $elemMatch: { $regex: genreStr, $options: 'i' } },
        });
      }

      if (conditions.length > 0) {
        filter.$and = conditions;
      }

      const movies = await Movie.find(filter);
      return res.json({ success: true, count: movies.length, data: movies });
    }

    let results = [...inMemoryDb.movies];

    if (queryStr) {
      results = results.filter((m) => {
        const titleMatch = m.title?.toLowerCase().includes(queryStr);
        const synMatch = m.synopsis?.toLowerCase().includes(queryStr);
        const dirMatch = m.director?.toLowerCase().includes(queryStr);
        const castMatch = m.cast?.some((c: string) => c.toLowerCase().includes(queryStr));
        const genreMatch = m.genres?.some((g: string) => g.toLowerCase().includes(queryStr));
        const langMatch =
          m.language?.toLowerCase().includes(queryStr) ||
          m.languages?.some((l: string) => l.toLowerCase().includes(queryStr));
        return titleMatch || synMatch || dirMatch || castMatch || genreMatch || langMatch;
      });
    }

    if (langStr) {
      results = results.filter((m) => {
        const mainLangMatch = m.language && m.language.toLowerCase().includes(langStr);
        const arrLangMatch =
          m.languages && m.languages.some((l: string) => l.toLowerCase().includes(langStr) || langStr.includes(l.toLowerCase()));
        const catMatch = m.category && m.category.toLowerCase().includes(langStr);
        return mainLangMatch || arrLangMatch || catMatch;
      });
    }

    if (genreStr) {
      results = results.filter((m) =>
        m.genres && m.genres.some((g: string) =>
          g.toLowerCase().includes(genreStr) || genreStr.includes(g.toLowerCase())
        )
      );
    }

    return res.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Returns grouped categories for the wireframe screens
export const getWireframeCategories = async (req: Request, res: Response) => {
  try {
    const { view } = req.query; // 'home' | 'movies' | 'shows'

    let allMovies: any[] = [];
    if (isMongooseReady()) {
      allMovies = await Movie.find();
    } else {
      allMovies = [...inMemoryDb.movies];
    }

    if (view === 'movies') {
      // Wireframe Page 2: Telugu, Sci-Fi, Bollywood
      const telugu = allMovies.filter((m) => m.category === 'Telugu' || m.language === 'Telugu');
      const scifi = allMovies.filter((m) => m.category === 'Sci-Fi' || m.genres.includes('Sci-Fi'));
      const bollywood = allMovies.filter((m) => m.category === 'Bollywood' || m.language === 'Hindi');

      return res.json({
        success: true,
        data: [
          { name: 'Telugu', items: telugu },
          { name: 'Sci-Fi', items: scifi },
          { name: 'Bollywood', items: bollywood },
        ],
      });
    }

    if (view === 'shows') {
      // Wireframe Page 3: English, Most Watched, Drama
      const english = allMovies.filter((m) => m.category === 'English' || (m.type === 'show' && m.language === 'English'));
      const mostWatched = allMovies.filter((m) => m.category === 'Most Watched' || m.rating >= 8.5);
      const drama = allMovies.filter((m) => m.category === 'Drama' || (m.type === 'show' && m.genres.includes('Drama')));

      return res.json({
        success: true,
        data: [
          { name: 'English', items: english },
          { name: 'Most Watched', items: mostWatched },
          { name: 'Drama', items: drama },
        ],
      });
    }

    // Default Home: Wireframe Page 1: Category 1 – Movies, Category 2 – Shows, Category 3
    const cat1 = allMovies.filter((m) => m.category === 'Category 1 – Movies' || m.type === 'movie');
    const cat2 = allMovies.filter((m) => m.category === 'Category 2 – Shows' || m.type === 'show');
    const cat3 = allMovies.filter((m) => m.category === 'Category 3' || m.rating >= 8.0);

    return res.json({
      success: true,
      data: [
        { name: 'Category 1 – Movies', items: cat1 },
        { name: 'Category 2 – Shows', items: cat2 },
        { name: 'Category 3', items: cat3 },
      ],
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
