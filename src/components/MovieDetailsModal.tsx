import React, { useState } from 'react';
import { X, Play, Plus, Check, Star, Clock, Calendar, Film } from 'lucide-react';
import { MovieItem } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

interface MovieDetailsModalProps {
  movie: MovieItem | null;
  onClose: () => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
}) => {
  const { isMovieInWatchlist, addToWatchlist, removeFromWatchlist } = useAuth();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  if (!movie) return null;

  const movieId = movie._id || movie.id || '';
  const inWatchlist = isMovieInWatchlist(movieId);

  const handleWatchlistClick = async () => {
    if (inWatchlist) {
      await removeFromWatchlist(movieId);
    } else {
      await addToWatchlist(movieId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#181818] text-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/75 hover:bg-[#E50914] text-white border border-neutral-700 flex items-center justify-center transition-all cursor-pointer shadow-lg"
          title="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Video / Backdrop Player Header */}
        <div className="relative w-full aspect-video bg-black shrink-0 overflow-hidden">
          {isPlayingVideo ? (
            <video
              src={movie.trailerUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
              poster={movie.backdropUrl || movie.thumbnailUrl}
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={movie.backdropUrl || movie.thumbnailUrl}
                alt={movie.title}
                className="w-full h-full object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-black/40 to-black/30 flex items-end p-6 sm:p-8">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="bg-[#E50914] text-white text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider shadow-md">
                      {movie.type === 'show' ? 'SERIES' : 'MOVIE'}
                    </span>
                    <span className="bg-black/60 border border-neutral-700 text-gray-200 text-xs font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                      {movie.language}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    {movie.title}
                  </h2>
                </div>
              </div>

              {/* Play Button Overlay */}
              <button
                onClick={() => setIsPlayingVideo(true)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-[#E50914] text-black hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-115 cursor-pointer border border-white/20"
                title="Play Trailer"
              >
                <Play className="w-7 h-7 fill-current ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Content Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-[#181818]">
          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg shadow-red-950/50 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isPlayingVideo ? 'Stop Playback' : 'Play Trailer'}</span>
              </button>

              <button
                onClick={handleWatchlistClick}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border transition-all cursor-pointer ${
                  inWatchlist
                    ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700'
                    : 'bg-neutral-900 border-neutral-700 text-gray-300 hover:border-neutral-500 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>
            </div>

            {/* Meta Tags */}
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{movie.rating.toFixed(1)} / 10</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{movie.releaseYear}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{movie.duration}</span>
              </div>
              <span className="border border-neutral-700 rounded px-1.5 py-0.5 text-[11px] font-bold text-gray-300 bg-neutral-900">
                {movie.maturityRating || 'U/A 13+'}
              </span>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-bold text-[#E50914] uppercase tracking-wider mb-2">
              Synopsis
            </h4>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {movie.synopsis}
            </p>
          </div>

          {/* Cast & Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400 pt-3 border-t border-neutral-800">
            <div>
              <span className="font-bold text-white block mb-1">Director:</span>
              <p className="text-gray-300">{movie.director || 'Acclaimed Director'}</p>
            </div>

            <div>
              <span className="font-bold text-white block mb-1">Cast:</span>
              <p className="text-gray-300">{movie.cast?.join(', ') || 'Ensemble Cast'}</p>
            </div>

            <div>
              <span className="font-bold text-white block mb-1">Genres:</span>
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                {movie.genres?.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 bg-neutral-800 border border-neutral-700 text-gray-200 rounded-md font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-white block mb-1">Category & Language:</span>
              <p className="text-gray-300">{movie.category} • {movie.language}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
