import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Header } from './components/Header.js';
import { NavigationTab } from './components/NavigationPills.js';
import { MovieDetailsModal } from './components/MovieDetailsModal.js';
import { HomePage } from './pages/HomePage.js';
import { MoviePage } from './pages/MoviePage.js';
import { SeriesPage } from './pages/SeriesPage.js';
import { SearchPage } from './pages/SearchPage.js';
import { SearchResultsPage } from './pages/SearchResultsPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { ChooseProfilePage } from './pages/ChooseProfilePage.js';
import { WatchlistPage } from './pages/WatchlistPage.js';
import { MovieItem } from './services/api.js';

type AppView =
  | 'choose-profile'
  | 'home'
  | 'movies'
  | 'shows'
  | 'search'
  | 'search-results'
  | 'profile'
  | 'watchlist';

function MainApp() {
  // First page when opening the app is selecting account (Choose Profile)
  const [currentView, setCurrentView] = useState<AppView>('choose-profile');
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [activeFilterName, setActiveFilterName] = useState<string>('Sci-Fi');
  const { user, activeProfile } = useAuth();

  const handleTabChange = (tab: NavigationTab) => {
    if (tab === 'home') setCurrentView('home');
    if (tab === 'movies') setCurrentView('movies');
    if (tab === 'shows') setCurrentView('shows');
  };

  const handleNavigate = (page: string) => {
    setCurrentView(page as AppView);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col py-3 sm:py-6 px-2 sm:px-4 md:px-8 selection:bg-[#E50914] selection:text-white">
      {/* Main Container - Authentic Netflix Dark Theme */}
      <main className="max-w-6xl w-full mx-auto bg-[#141414] rounded-3xl border border-neutral-800/80 shadow-2xl overflow-hidden flex flex-col min-h-[640px]">
        {/* Netflix Global Header */}
        <Header
          currentPage={currentView}
          onNavigate={handleNavigate}
          isSearchPage={currentView === 'search'}
        />

        {/* View Router */}
        <div className="flex-1 pb-8">
          {currentView === 'choose-profile' && (
            <ChooseProfilePage
              onProfileSelected={() => setCurrentView('home')}
            />
          )}

          {currentView === 'home' && (
            <HomePage
              onTabChange={handleTabChange}
              onSelectMovie={(movie) => setSelectedMovie(movie)}
            />
          )}

          {currentView === 'movies' && (
            <MoviePage
              onTabChange={handleTabChange}
              onSelectMovie={(movie) => setSelectedMovie(movie)}
            />
          )}

          {currentView === 'shows' && (
            <SeriesPage
              onTabChange={handleTabChange}
              onSelectMovie={(movie) => setSelectedMovie(movie)}
            />
          )}

          {currentView === 'search' && (
            <SearchPage
              onSelectMovie={(movie) => setSelectedMovie(movie)}
              onClose={() => setCurrentView('home')}
            />
          )}

          {currentView === 'search-results' && (
            <SearchResultsPage
              initialFilter={activeFilterName}
              onTabChange={handleTabChange}
              onSelectMovie={(movie) => setSelectedMovie(movie)}
              onClearFilter={() => setActiveFilterName('')}
            />
          )}

          {currentView === 'profile' && (
            <ProfilePage
              onNavigateToChooseProfile={() => setCurrentView('choose-profile')}
              onNavigateToWatchlist={() => setCurrentView('watchlist')}
              onSelectMovie={(movie) => setSelectedMovie(movie)}
            />
          )}

          {currentView === 'watchlist' && (
            <WatchlistPage
              onSelectMovie={(movie) => setSelectedMovie(movie)}
              onBack={() => setCurrentView('home')}
            />
          )}
        </div>
      </main>

      {/* Footer System Status Bar */}
      <footer className="max-w-6xl w-full mx-auto mt-4 px-3 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-gray-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
            Netflix MERN Stack Live (Express & MongoDB)
          </span>
          <span className="hidden sm:inline text-neutral-700">|</span>
          <span className="hidden sm:inline text-gray-400">
            Selected Profile: <span className="text-white font-medium">{activeProfile?.name || 'Profile-1'}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('choose-profile')}
            className="hover:text-[#E50914] cursor-pointer font-bold transition-colors text-gray-300"
          >
            Switch Profile
          </button>
          <span className="text-neutral-700">•</span>
          <button
            onClick={() => setCurrentView('watchlist')}
            className="hover:text-[#E50914] cursor-pointer font-bold transition-colors text-gray-300"
          >
            My Watchlist
          </button>
        </div>
      </footer>

      {/* Movie Details Modal with Video Trailer Player */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
