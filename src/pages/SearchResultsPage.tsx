import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NavigationPills, NavigationTab } from '../components/NavigationPills.js';
import { MovieCard } from '../components/MovieCard.js';
import { api, MovieItem } from '../services/api.js';

interface SearchResultsPageProps {
  initialFilter?: string;
  onTabChange: (tab: NavigationTab) => void;
  onSelectMovie: (movie: MovieItem) => void;
  onClearFilter: () => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  initialFilter = 'Sci-Fi',
  onTabChange,
  onSelectMovie,
  onClearFilter,
}) => {
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await api.searchMovies({
          genre: activeFilter,
        });
        if (isMounted) {
          if (data.length < 12) {
            const all = await api.getAllMovies();
            const combined = [...data, ...all.filter((m) => !data.some((d) => d._id === m._id))];
            setResults(combined.slice(0, 12));
          } else {
            setResults(data);
          }
        }
      } catch (err) {
        console.error('Failed to load search results', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();
    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

  return (
    <div className="flex flex-col text-white">
      {/* Navigation Pills matching Wireframe Page 6 */}
      <NavigationPills activeTab="home" onTabChange={onTabChange} />

      <div className="px-6 py-2">
        {/* Wireframe Page 6 Search Tag bar */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-5 py-1.5 rounded-full border border-neutral-700 text-xs sm:text-sm font-semibold text-gray-200 bg-neutral-900 shadow-sm">
            You searched
          </span>

          {activeFilter && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-900/50 text-xs sm:text-sm font-medium text-red-200 bg-red-950/40 shadow-sm">
              <span>{activeFilter}</span>
              <button
                onClick={() => {
                  setActiveFilter('');
                  onClearFilter();
                }}
                className="hover:text-white transition-colors cursor-pointer"
                title="Remove filter"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </span>
          )}
        </div>

        {/* Results Heading */}
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-4 px-1 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#E50914] rounded-full inline-block" />
          <span>Results</span>
        </h3>

        {/* Results Grid matching Wireframe Page 6: 3 rows of 4 cards */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-neutral-700 border-t-[#E50914] rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Loading search results...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.map((movie) => (
              <MovieCard
                key={movie._id || movie.id}
                movie={movie}
                onSelect={onSelectMovie}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
