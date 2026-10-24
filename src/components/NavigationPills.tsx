import React from 'react';

export type NavigationTab = 'home' | 'movies' | 'shows';

interface NavigationPillsProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const NavigationPills: React.FC<NavigationPillsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    { id: 'shows', label: 'Shows' },
  ];

  return (
    <nav className="flex items-center justify-center py-4 px-4">
      <div className="flex items-center gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-w-[88px] sm:min-w-[100px] py-1.5 px-5 rounded-full text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                isActive
                  ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/60 ring-1 ring-red-500 scale-105'
                  : 'bg-neutral-900 text-gray-300 border border-neutral-700 hover:border-neutral-500 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
