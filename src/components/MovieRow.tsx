import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard.js';
import { MovieItem } from '../services/api.js';

interface MovieRowProps {
  title: string;
  movies: MovieItem[];
  onSelectMovie: (movie: MovieItem) => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  onSelectMovie,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mb-8">
      {/* Category Header Label matching Wireframe */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-4.5 bg-[#E50914] rounded-full inline-block" />
          <span>{title}</span>
        </h3>
        {movies.length > 4 && (
          <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-[#E50914] cursor-pointer transition-colors shadow-sm"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-[#E50914] cursor-pointer transition-colors shadow-sm"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Row Cards (4 cards visible per screen row, matching Wireframe 4-column layout) */}
      <div
        ref={rowRef}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-x-auto pb-2 scrollbar-none"
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie._id || movie.id}
            movie={movie}
            onSelect={onSelectMovie}
          />
        ))}

        {movies.length === 0 && (
          <div className="col-span-4 py-8 text-center text-sm text-gray-400 bg-neutral-900/60 rounded-2xl border border-dashed border-neutral-800">
            No titles available in this category yet.
          </div>
        )}
      </div>
    </section>
  );
};
