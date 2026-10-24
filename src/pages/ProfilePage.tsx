import React, { useState, useEffect } from 'react';
import { User, Check, Bookmark, Users, Film } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { MovieCard } from '../components/MovieCard.js';
import { MovieItem } from '../services/api.js';

interface ProfilePageProps {
  onNavigateToChooseProfile: () => void;
  onNavigateToWatchlist: () => void;
  onSelectMovie: (movie: MovieItem) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateToChooseProfile,
  onNavigateToWatchlist,
  onSelectMovie,
}) => {
  const { user, activeProfile, updateUserPersonalInfo, watchlistMovies } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || '');
      setPhone(user.phoneNumber);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await updateUserPersonalInfo(name, email, phone);
      setIsSaved(true);
      setMessage('Personal details saved successfully!');
      setTimeout(() => {
        setIsSaved(false);
        setMessage('');
      }, 3000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to save changes');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto flex flex-col text-white">
      {/* Wireframe Page 5: Personal Info Container Box with Netflix Dark Aesthetics */}
      <div className="bg-[#181818] rounded-3xl border border-neutral-800 p-6 sm:p-10 shadow-xl mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-2.5">
          <span className="w-2 h-5 bg-[#E50914] rounded-full inline-block" />
          <span>Personal Info</span>
        </h3>

        <form onSubmit={handleSave} className="flex flex-col md:flex-row items-start gap-8">
          {/* Left: Large Circular Avatar matching Wireframe Page 5 */}
          <div className="flex flex-col items-center gap-3 shrink-0 mx-auto md:mx-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-[#E50914] bg-neutral-900 overflow-hidden flex items-center justify-center shadow-lg ring-4 ring-red-900/20">
              {activeProfile?.avatar ? (
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-gray-200">
              {activeProfile?.name || 'Profile-1'}
            </span>
          </div>

          {/* Right: Three Inputs matching Wireframe Page 5 (Name, Email, Phone) */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-5 py-2.5 rounded-full border border-neutral-700 bg-neutral-900 text-sm text-white placeholder-neutral-500 focus:border-[#E50914] focus:ring-2 focus:ring-red-600/30 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-5 py-2.5 rounded-full border border-neutral-700 bg-neutral-900 text-sm text-white placeholder-neutral-500 focus:border-[#E50914] focus:ring-2 focus:ring-red-600/30 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-5 py-2.5 rounded-full border border-neutral-700 bg-neutral-900 text-sm text-white placeholder-neutral-500 focus:border-[#E50914] focus:ring-2 focus:ring-red-600/30 outline-none transition-all"
              />
            </div>

            {message && (
              <div
                className={`text-xs p-3 rounded-xl border font-medium ${
                  isSaved
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                    : 'bg-red-950/40 text-red-300 border-red-800'
                }`}
              >
                {message}
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-full bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-red-950/50 disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? 'Saving...' : 'Save Personal Details'}
              </button>

              <button
                type="button"
                onClick={onNavigateToChooseProfile}
                className="px-5 py-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-gray-300 hover:text-white hover:border-neutral-500 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Users className="w-4 h-4 text-[#E50914]" />
                <span>Switch Profile</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Watchlist Section on Profile */}
      <div className="bg-[#181818] rounded-3xl border border-neutral-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-[#E50914]" />
            <h4 className="text-base sm:text-lg font-bold text-white">
              My Saved Watchlist ({watchlistMovies.length})
            </h4>
          </div>
          {watchlistMovies.length > 0 && (
            <button
              onClick={onNavigateToWatchlist}
              className="text-xs font-bold text-[#E50914] hover:underline cursor-pointer"
            >
              View All
            </button>
          )}
        </div>

        {watchlistMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {watchlistMovies.slice(0, 4).map((movie) => (
              <MovieCard
                key={movie._id || movie.id}
                movie={movie}
                onSelect={onSelectMovie}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-gray-400 bg-neutral-900/60 rounded-2xl border border-dashed border-neutral-800">
            No movies added to this profile's watchlist yet. Click the + icon on any title to save it.
          </div>
        )}
      </div>
    </div>
  );
};
