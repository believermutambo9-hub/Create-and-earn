import React from 'react';
import { Home, Sparkles, Briefcase, Wallet, User } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  pendingEarningsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  pendingEarningsCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as Screen,
      label: 'Home',
      icon: Home,
      isActive: currentScreen === 'home',
    },
    {
      id: 'create-hub' as Screen,
      label: 'Create',
      icon: Sparkles,
      isActive: [
        'create-hub',
        'idea-generator',
        'script-generator',
        'scene-generator',
        'caption-generator',
      ].includes(currentScreen),
    },
    {
      id: 'opportunities' as Screen,
      label: 'Opportunities',
      icon: Briefcase,
      isActive: currentScreen === 'opportunities' || currentScreen === 'business-profile',
    },
    {
      id: 'earnings' as Screen,
      label: 'Earnings',
      icon: Wallet,
      isActive: currentScreen === 'earnings',
      badge: pendingEarningsCount > 0 ? pendingEarningsCount : undefined,
    },
    {
      id: 'profile' as Screen,
      label: 'Profile',
      icon: User,
      isActive: currentScreen === 'profile',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E131E]/95 backdrop-blur-xl border-t border-[#1C2538] px-2 py-2 max-w-lg mx-auto sm:rounded-t-2xl shadow-[0_-8px_25px_rgba(0,0,0,0.5)]"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all duration-200 active:scale-95 group ${
                active ? 'text-[#FFB800]' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {/* Highlight pill indicator on active */}
              {active && (
                <div className="absolute -top-2 w-8 h-1 bg-[#FFB800] rounded-full shadow-[0_0_8px_#FFB800]"></div>
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? 'scale-110 stroke-[2.5]' : 'stroke-2 group-hover:scale-105'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#10B981] text-black text-[9px] font-black px-1 rounded-full border border-[#0B0E14]">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] mt-1 font-semibold tracking-tight transition-colors ${
                  active ? 'text-[#FFB800] font-bold' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
