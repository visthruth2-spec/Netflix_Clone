import React, { useEffect, useState } from 'react';
import { NavigationPills, NavigationTab } from '../components/NavigationPills.js';
import { MovieRow } from '../components/MovieRow.js';
import { api, MovieItem } from '../services/api.js';

interface HomePageProps {
  onTabChange: (tab: NavigationTab) => void;
  onSelectMovie: (movie: MovieItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onTabChange,
  onSelectMovie,
}) => {
  const [categories, setCategories] = useState<{ name: string; items: MovieItem[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHomeRows = async () => {
      try {
        setLoading(true);
        const data = await api.getWireframeCategories('home');
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load home categories', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHomeRows();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Centered Navigation Pills matching Wireframe: [Home] [Movies] [Shows] */}
      <NavigationPills activeTab="home" onTabChange={onTabChange} />

      {/* Main Browse Rows */}
      <div className="px-6 py-2">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-neutral-800 border-t-[#E50914] rounded-full animate-spin" />
            <span className="text-xs font-semibold text-gray-400">Loading catalog...</span>
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
