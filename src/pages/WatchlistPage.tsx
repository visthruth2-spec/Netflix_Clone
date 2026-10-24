import React from 'react';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { MovieCard } from '../components/MovieCard.js';
import { MovieItem } from '../services/api.js';

interface WatchlistPageProps {
  onSelectMovie: (movie: MovieItem) => void;
  onBack: () => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  onSelectMovie,
  onBack,
}) => {
  const { watchlistMovies, activeProfile } = useAuth();

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto flex flex-col text-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white cursor-pointer bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-full transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-[#E50914]" />
          <h2 className="text-base sm:text-xl font-bold text-white">
            {activeProfile?.name || 'My'}'s Watchlist ({watchlistMovies.length})
          </h2>
        </div>
      </div>

      {/* Grid of Saved Watchlist Movies */}
      {watchlistMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {watchlistMovies.map((movie) => (
            <MovieCard
              key={movie._id || movie.id}
              movie={movie}
              onSelect={onSelectMovie}
              showCategoryTag={true}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-[#181818] rounded-3xl border border-dashed border-neutral-800 p-8 shadow-xl">
          <Bookmark className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Your Watchlist is Empty</h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto mb-6">
            Explore movies and shows on the Home, Movies, or Shows pages, and click the "+" icon to save them to your personal watchlist.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-[#E50914] text-white rounded-full text-xs sm:text-sm font-bold hover:bg-red-700 cursor-pointer shadow-md shadow-red-950/50"
          >
            Browse Titles Now
          </button>
        </div>
      )}
    </div>
  );
};
