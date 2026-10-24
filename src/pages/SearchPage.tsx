import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Film, Check } from 'lucide-react';
import { MovieCard } from '../components/MovieCard.js';
import { api, MovieItem } from '../services/api.js';

interface SearchPageProps {
  onSelectMovie: (movie: MovieItem) => void;
  onClose: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onSelectMovie,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [allMovies, setAllMovies] = useState<MovieItem[]>([]);
  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const languages = ['Telugu', 'Hindi', 'English'];
  const genres = ['DRAMA', 'HORROR', 'SCI-FI', 'ACTION', 'THRILLER'];

  // Load all movies on initial mount for instant client-side filtering and counts
  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const data = await api.getAllMovies();
        if (isMounted) {
          setAllMovies(data);
          setResults(data);
        }
      } catch (err) {
        console.error('Catalog load error', err);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute dynamic counts per category for better UX
  const languageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const lang of languages) {
      const l = lang.toLowerCase();
      counts[lang] = allMovies.filter(
        (m) =>
          (m.language && m.language.toLowerCase().includes(l)) ||
          (m.languages && m.languages.some((x) => x.toLowerCase().includes(l))) ||
          (m.category && m.category.toLowerCase().includes(l))
      ).length;
    }
    return counts;
  }, [allMovies]);

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const g of genres) {
      const gl = g.toLowerCase();
      counts[g] = allMovies.filter(
        (m) =>
          m.genres &&
          m.genres.some((x) => x.toLowerCase().includes(gl) || gl.includes(x.toLowerCase()))
      ).length;
    }
    return counts;
  }, [allMovies]);

  // Synchronize search both client-side and via REST API
  useEffect(() => {
    let isMounted = true;

    // 1. Instant optimistic client-side filter
    const q = searchTerm.trim().toLowerCase();
    const l = selectedLanguage.trim().toLowerCase();
    const g = selectedGenre ? selectedGenre.trim().toLowerCase() : '';

    let filtered = allMovies;

    if (q) {
      filtered = filtered.filter((m) => {
        const title = m.title?.toLowerCase().includes(q);
        const syn = m.synopsis?.toLowerCase().includes(q);
        const dir = m.director?.toLowerCase().includes(q);
        const cast = m.cast?.some((c) => c.toLowerCase().includes(q));
        const genreM = m.genres?.some((x) => x.toLowerCase().includes(q));
        const langM =
          m.language?.toLowerCase().includes(q) ||
          m.languages?.some((x) => x.toLowerCase().includes(q));
        return title || syn || dir || cast || genreM || langM;
      });
    }

    if (l) {
      filtered = filtered.filter((m) => {
        const main = m.language && m.language.toLowerCase().includes(l);
        const arr =
          m.languages && m.languages.some((x) => x.toLowerCase().includes(l) || l.includes(x.toLowerCase()));
        const cat = m.category && m.category.toLowerCase().includes(l);
        return main || arr || cat;
      });
    }

    if (g) {
      filtered = filtered.filter((m) =>
        m.genres && m.genres.some((x) => x.toLowerCase().includes(g) || g.includes(x.toLowerCase()))
      );
    }

    if (isMounted) {
      setResults(filtered);
    }

    // 2. Server API search for backend verification and consistency
    const runServerSearch = async () => {
      try {
        setLoading(true);
        const serverResults = await api.searchMovies({
          q: q || undefined,
          language: selectedLanguage || undefined,
          genre: selectedGenre ? selectedGenre.toLowerCase() : undefined,
        });
        if (isMounted && serverResults) {
          setResults(serverResults);
        }
      } catch (err) {
        console.error('Server search error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    runServerSearch();

    return () => {
      isMounted = false;
    };
  }, [searchTerm, selectedLanguage, selectedGenre, allMovies]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleLanguageClick = (lang: string) => {
    if (selectedLanguage === lang) {
      setSelectedLanguage('');
    } else {
      setSelectedLanguage(lang);
    }
  };

  const handleGenreClick = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  const clearLanguageFilter = () => {
    setSelectedLanguage('');
  };

  const clearGenreFilter = () => {
    setSelectedGenre(null);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('');
    setSelectedGenre(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const hasActiveFilters = Boolean(searchTerm || selectedLanguage || selectedGenre);

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto flex flex-col text-white">
      {/* Search Input Bar matching Wireframe Page 4 */}
      <form onSubmit={handleSearchSubmit} className="relative mb-7">
        <div className="flex items-center w-full px-5 py-3.5 rounded-full border border-neutral-700 bg-neutral-900/90 shadow-md focus-within:border-[#E50914] focus-within:ring-2 focus-within:ring-red-600/30 transition-all">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0 stroke-[2.2]" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movies, shows, genres, languages..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer mr-2"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-3.5 py-1 text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-full transition-all cursor-pointer border border-neutral-700 shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {/* Filter Section 1: Movies – Language matching Wireframe Page 4 */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-200 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#E50914] rounded-full inline-block" />
            <span>Movies – Language</span>
          </h4>
          {selectedLanguage && (
            <button
              type="button"
              onClick={clearLanguageFilter}
              className="text-xs text-neutral-400 hover:text-[#E50914] cursor-pointer"
            >
              Show all languages
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {languages.map((lang) => {
            const isActive = selectedLanguage === lang;
            const count = languageCounts[lang] ?? 0;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageClick(lang)}
                className={`py-2 px-5 sm:px-6 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/70 ring-2 ring-red-500 scale-105'
                    : 'bg-neutral-900 text-gray-300 border border-neutral-700 hover:border-neutral-500 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <span>{lang}</span>
                {count > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-black/40 text-white' : 'bg-neutral-800 text-gray-400'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Section 2: Genres matching Wireframe Page 4 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-gray-200 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#E50914] rounded-full inline-block" />
            <span>Genres</span>
          </h4>
          {selectedGenre && (
            <button
              type="button"
              onClick={clearGenreFilter}
              className="text-xs text-neutral-400 hover:text-[#E50914] cursor-pointer"
            >
              Show all genres
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {genres.map((genre) => {
            const isActive = selectedGenre === genre;
            const count = genreCounts[genre] ?? 0;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreClick(genre)}
                className={`py-4 px-4 rounded-2xl text-center text-xs sm:text-sm font-black tracking-widest transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/70 ring-2 ring-red-500 scale-102'
                    : 'bg-neutral-900 text-gray-200 border border-neutral-800 hover:border-[#E50914]/60 hover:text-white hover:bg-neutral-800 shadow-md'
                }`}
              >
                <span>{genre}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-semibold tracking-normal ${
                      isActive ? 'text-red-100' : 'text-neutral-500'
                    }`}
                  >
                    {count} titles
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Active Chips */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2 pt-3 border-t border-neutral-800">
          <span className="text-xs font-semibold px-3 py-1 bg-neutral-800 text-gray-300 rounded-full border border-neutral-700">
            Active filters:
          </span>

          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-white">
              "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="cursor-pointer hover:text-[#E50914]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedLanguage && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-950/50 border border-red-800 text-red-200">
              Language: {selectedLanguage}
              <button onClick={clearLanguageFilter} className="cursor-pointer hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedGenre && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-red-950/50 border border-red-800 text-red-200">
              Genre: {selectedGenre}
              <button onClick={clearGenreFilter} className="cursor-pointer hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-xs text-[#E50914] hover:underline ml-2 cursor-pointer font-bold"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Section 3: Results matching Wireframe Page 4 & Page 6 */}
      <div ref={resultsRef} className="pt-2">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#E50914] rounded-full inline-block" />
            <span>
              {hasActiveFilters
                ? `Results (${results.length} found)`
                : `All Movies & Shows (${results.length})`}
            </span>
          </h3>
          <span className="text-xs font-bold text-[#E50914] bg-red-950/40 border border-red-900/50 px-2.5 py-0.5 rounded-full">
            {results.length} titles
          </span>
        </div>

        {loading && results.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2.5">
            <div className="w-8 h-8 border-3 border-neutral-700 border-t-[#E50914] rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Filtering catalog...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((movie) => (
              <MovieCard
                key={movie._id || movie.id}
                movie={movie}
                onSelect={onSelectMovie}
                showCategoryTag={true}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-gray-400 bg-neutral-900/60 rounded-2xl border border-dashed border-neutral-800 p-6">
            <p className="mb-3 text-base font-semibold text-gray-300">
              No titles match your filter criteria.
            </p>
            <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
              Try clicking a different language, selecting another genre, or clearing active search keywords.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 bg-[#E50914] hover:bg-red-700 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-950/50"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
