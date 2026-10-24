import React, { useEffect, useState } from 'react';
import { NavigationPills, NavigationTab } from '../components/NavigationPills.js';
import { MovieRow } from '../components/MovieRow.js';
import { api, MovieItem } from '../services/api.js';

interface MoviePageProps {
  onTabChange: (tab: NavigationTab) => void;
  onSelectMovie: (movie: MovieItem) => void;
}

export const MoviePage: React.FC<MoviePageProps> = ({
  onTabChange,
  onSelectMovie,
}) => {
  const [categories, setCategories] = useState<{ name: string; items: MovieItem[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchMovieRows = async () => {
      try {
        setLoading(true);
        // Wireframe Page 2 specifies: Telugu, Sci-Fi, Bollywood
        const data = await api.getWireframeCategories('movies');
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load movie categories', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovieRows();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Navigation Pills: [Home] [Movies (Active Red)] [Shows] */}
      <NavigationPills activeTab="movies" onTabChange={onTabChange} />

      {/* Rows: Telugu, Sci-Fi, Bollywood */}
      <div className="px-6 py-2">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-neutral-800 border-t-[#E50914] rounded-full animate-spin" />
            <span className="text-xs font-semibold text-gray-400">Loading movies...</span>
          </div>
        ) : (
          categories.map((cat) => (
            <MovieRow
              key={cat.name}
              title={cat.name}
              movies={cat.items}
              onSelectMovie={onSelectMovie}
            />
          ))
        )}
      </div>
    </div>
  );
};
