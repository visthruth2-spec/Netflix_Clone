import React from 'react';
import { Search, X, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isSearchPage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  isSearchPage = false,
}) => {
  const { activeProfile } = useAuth();

  return (
    <header className="relative flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#141414]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Left: Profile Pill */}
      <div className="flex items-center min-w-[120px]">
        {currentPage !== 'choose-profile' ? (
          <button
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-all shadow-sm cursor-pointer ${
              currentPage === 'profile'
                ? 'bg-neutral-800 border-[#E50914] text-white ring-2 ring-red-600/30'
                : 'bg-neutral-900/90 border-neutral-700 text-gray-300 hover:border-neutral-500 hover:text-white hover:bg-neutral-800'
            }`}
            title="Account & Personal Info"
          >
            <div className="w-5 h-5 rounded-full bg-neutral-700 overflow-hidden flex items-center justify-center shrink-0 ring-1 ring-neutral-600">
              {activeProfile?.avatar ? (
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
            <span className="truncate max-w-[80px] sm:max-w-none">{activeProfile?.name || 'Profile'}</span>
          </button>
        ) : (
          <div className="w-[120px]" />
        )}
      </div>

      {/* Center: Netflix Brand Logo */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => onNavigate('home')}
          className="text-2xl sm:text-3xl font-black tracking-widest text-[#E50914] select-none hover:brightness-110 transition-all uppercase cursor-pointer drop-shadow-[0_2px_10px_rgba(229,9,20,0.35)]"
          style={{ letterSpacing: '0.14em' }}
        >
          NETFLIX
        </button>
      </div>

      {/* Right: Search / Close Button */}
      <div className="flex items-center justify-end min-w-[120px]">
        {isSearchPage ? (
          <button
            onClick={() => onNavigate('home')}
            className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-gray-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-500 transition-all shadow-sm cursor-pointer"
            title="Close Search & Return to Home"
          >
            <X className="w-4 h-4 text-gray-200 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={() => onNavigate('search')}
            className={`w-9 h-9 rounded-full bg-neutral-900 border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
              currentPage === 'search'
                ? 'border-[#E50914] text-[#E50914] ring-2 ring-red-600/30 bg-neutral-800'
                : 'border-neutral-700 text-gray-300 hover:text-white hover:border-neutral-500 hover:bg-neutral-800'
            }`}
            title="Search Movies and Shows"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>
        )}
      </div>
    </header>
  );
};
