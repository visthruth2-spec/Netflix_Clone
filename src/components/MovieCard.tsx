import React from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { MovieItem } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

interface MovieCardProps {
  movie: MovieItem;
  onSelect: (movie: MovieItem) => void;
  showCategoryTag?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  showCategoryTag = false,
}) => {
  const { isMovieInWatchlist, addToWatchlist, removeFromWatchlist } = useAuth();
  const movieId = movie._id || movie.id || '';
  const inWatchlist = isMovieInWatchlist(movieId);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      await removeFromWatchlist(movieId);
    } else {
      await addToWatchlist(movieId);
    }
  };

  return (
    <div
      onClick={() => onSelect(movie)}
      className="group flex flex-col cursor-pointer select-none transition-all duration-300"
    >
      {/* 16:9 Thumbnail Box matching Wireframe Play Box with Netflix Dark Aesthetics */}
      <div className="relative aspect-video w-full rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-red-950/30 group-hover:border-red-600/50 group-hover:-translate-y-1 transition-all duration-300">
        {/* Real Thumbnail Background */}
        <img
          src={movie.thumbnailUrl || movie.backdropUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-400"
          loading="lazy"
        />

        {/* Cinematic dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20 group-hover:via-black/10 transition-colors" />

        {/* Centered White Play Triangle matching wireframe */}
        <div className="relative z-10 w-12 h-12 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center shadow-md backdrop-blur-xs group-hover:scale-115 group-hover:bg-[#E50914] group-hover:border-[#E50914] group-hover:text-white transition-all duration-300">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white backdrop-blur-xs uppercase border border-neutral-700">
            {movie.language}
          </span>
          {showCategoryTag && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E50914] text-white shadow-sm">
              {movie.category}
            </span>
          )}
        </div>

        {/* Watchlist Toggle on Card */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={handleWatchlistToggle}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
              inWatchlist
                ? 'bg-[#E50914] text-white ring-2 ring-red-400'
                : 'bg-black/70 text-gray-200 border border-neutral-700 hover:bg-[#E50914] hover:text-white hover:border-[#E50914]'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {inWatchlist ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>

        {/* Bottom meta rating */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-black/85 text-amber-400 border border-neutral-800">
            ★ {movie.rating?.toFixed(1) || '8.0'}
          </span>
        </div>
      </div>

      {/* Title Label Below Card matching Wireframe "Title" label */}
      <div className="mt-2.5 px-1">
        <h4 className="text-sm font-semibold text-gray-100 truncate group-hover:text-[#E50914] transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <span>{movie.releaseYear}</span>
          <span>•</span>
          <span>{movie.duration}</span>
          <span>•</span>
          <span className="text-[10px] px-1 py-0.2 rounded border border-neutral-700 text-gray-400">
            {movie.maturityRating || '13+'}
          </span>
        </div>
      </div>
    </div>
  );
};
