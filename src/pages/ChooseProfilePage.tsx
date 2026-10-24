import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface ChooseProfilePageProps {
  onProfileSelected: () => void;
}

export const ChooseProfilePage: React.FC<ChooseProfilePageProps> = ({
  onProfileSelected,
}) => {
  const { user, activeProfile, switchProfile, addProfile } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  );
  const [error, setError] = useState('');

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
  ];

  const handleSelect = async (profileId: string) => {
    try {
      await switchProfile(profileId);
      onProfileSelected();
    } catch (err: any) {
      console.error(err);
      onProfileSelected();
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) {
      setError('Please provide a profile name');
      return;
    }

    try {
      await addProfile(newProfileName.trim(), selectedAvatar);
      setIsAdding(false);
      setNewProfileName('');
      onProfileSelected();
    } catch (err: any) {
      setError(err.message || 'Failed to add profile');
    }
  };

  const profiles = user?.profiles && user.profiles.length > 0 ? user.profiles : [
    { id: 'profile-1', name: 'Profile-1', avatar: sampleAvatars[0], isKids: false },
    { id: 'profile-2', name: 'Profile-2', avatar: sampleAvatars[1], isKids: false },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[580px] py-16 px-6 text-white bg-[#141414]">
      {/* Title matching Wireframe Page 7 with authentic Netflix presence */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-wider text-white uppercase drop-shadow-md">
          CHOOSE PROFILE
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium">
          Select an account to start streaming movies and shows
        </p>
      </div>

      {/* Profiles Row matching Wireframe Page 7 */}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 max-w-3xl">
        {profiles.map((profile) => {
          const isCurrent = activeProfile?.id === profile.id;
          return (
            <div
              key={profile.id}
              onClick={() => handleSelect(profile.id)}
              className="group flex flex-col items-center cursor-pointer select-none transition-all duration-300"
            >
              {/* Profile Avatar Card */}
              <div
                className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-xl ${
                  isCurrent
                    ? 'border-[#E50914] ring-4 ring-red-600/30 scale-105 shadow-red-950/50'
                    : 'border-neutral-700 group-hover:border-white group-hover:scale-105'
                }`}
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Name label */}
              <span className="mt-3.5 text-sm sm:text-base font-semibold text-gray-300 group-hover:text-white transition-colors">
                {profile.name}
              </span>

              {isCurrent && (
                <span className="text-[10px] font-black text-[#E50914] uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full bg-red-950/40 border border-red-900/40">
                  Active
                </span>
              )}
            </div>
          );
        })}

        {/* Add Profile Button matching Wireframe Page 7 */}
        <div
          onClick={() => setIsAdding(true)}
          className="group flex flex-col items-center cursor-pointer select-none transition-all duration-300"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-neutral-700 group-hover:border-[#E50914] flex items-center justify-center bg-neutral-900/60 group-hover:bg-neutral-800 transition-all duration-300 shadow-xl group-hover:scale-105">
            <Plus className="w-10 h-10 text-neutral-400 group-hover:text-[#E50914] stroke-[2] transition-colors" />
          </div>
          <span className="mt-3.5 text-sm sm:text-base font-semibold text-gray-400 group-hover:text-[#E50914] transition-colors">
            Add
          </span>
        </div>
      </div>

      {/* Add Profile Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#181818] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-neutral-700 text-white">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-4.5 bg-[#E50914] rounded-full inline-block" />
                Add Profile
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 text-xs font-semibold text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-2.5">
                  Select Profile Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {sampleAvatars.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition-transform ${
                        selectedAvatar === avatar ? 'border-[#E50914] ring-2 ring-red-500 scale-105' : 'border-neutral-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1.5">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g. Cinema, Kids, Friends"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:border-[#E50914] focus:ring-2 focus:ring-red-600/20 outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full text-sm font-bold bg-[#E50914] hover:bg-red-700 text-white shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
