import React from 'react';
import { Crown, Bell, Search, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { Screen, Role, CreatorProfile, AppNotification } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
  user: CreatorProfile;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  activeRole: Role;
  onChangeRole: (role: Role) => void;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  isLoggedIn?: boolean;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  user,
  notifications,
  onOpenNotifications,
  onOpenSearch,
  activeRole,
  onChangeRole,
  isDeviceFrame,
  onToggleDeviceFrame,
  isLoggedIn,
  onOpenAuth,
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isSubScreen = [
    'idea-generator',
    'script-generator',
    'scene-generator',
    'caption-generator',
    'business-profile',
    'messaging',
    'premium',
    'admin'
  ].includes(currentScreen);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'idea-generator': return 'AI Idea Generator';
      case 'script-generator': return 'Full Script Generator';
      case 'scene-generator': return 'Scene-by-Scene Director';
      case 'caption-generator': return 'Caption & Hashtags';
      case 'projects': return 'My Projects';
      case 'create-hub': return 'Create What Next?';
      case 'opportunities': return 'Creator Marketplace';
      case 'earnings': return 'Financial Dashboard';
      case 'profile': return 'Creator Profile';
      case 'business-profile': return 'Business Hub';
      case 'messaging': return 'Messages & Deals';
      case 'premium': return 'PRO Subscription';
      case 'admin': return 'Admin Control Center';
      default: return 'CREATE & EARN';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/95 backdrop-blur-md border-b border-[#1E2638] px-4 py-3">
      {/* Top utility row: Role switcher & device frame toggle for reviewer */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#182030]/60 text-xs">
        <div className="flex items-center space-x-1.5">
          <span className="text-gray-400 font-medium">Role:</span>
          <div className="inline-flex bg-[#121824] p-0.5 rounded-lg border border-[#232D42]">
            <button
              onClick={() => onChangeRole('creator')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                activeRole === 'creator'
                  ? 'bg-[#FFB800] text-black shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Creator 🇿🇲
            </button>
            <button
              onClick={() => {
                onChangeRole('business');
                onNavigate('opportunities');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                activeRole === 'business'
                  ? 'bg-[#3B82F6] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Business 🏢
            </button>
            <button
              onClick={() => {
                onChangeRole('admin');
                onNavigate('admin');
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                activeRole === 'admin'
                  ? 'bg-[#8B5CF6] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Admin ⚡
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('premium')}
            className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-[#FFB800] border border-[#FFB800]/40 text-[11px] font-bold hover:scale-105 transition-all"
          >
            <Sparkles className="w-3 h-3 text-[#FFB800]" />
            <span>PRO</span>
          </button>
          
          <button
            onClick={onToggleDeviceFrame}
            title="Toggle between Mobile Simulator Frame and Full Responsive view"
            className="text-[11px] text-gray-400 hover:text-white bg-[#151C2A] px-2 py-0.5 rounded border border-[#232D42] hidden sm:inline-flex"
          >
            {isDeviceFrame ? 'Full Width' : 'Mobile Frame'}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isSubScreen && onBack ? (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-[#161D2B] border border-[#232D42] flex items-center justify-center text-gray-300 hover:text-[#FFB800] hover:border-[#FFB800]/50 transition-all active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}

          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FFB800] via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-black text-sm tracking-wider uppercase text-white font-mono">
                  CREATE & EARN
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium tracking-tight">
                {isSubScreen ? getScreenTitle() : 'Create. Connect. Earn.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-2">
          {/* Search button */}
          <button
            onClick={onOpenSearch}
            className="w-9 h-9 rounded-full bg-[#161D2B] border border-[#232D42] flex items-center justify-center text-gray-300 hover:text-white hover:border-[#FFB800]/50 transition-all"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications button with badge */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-full bg-[#161D2B] border border-[#232D42] flex items-center justify-center text-gray-300 hover:text-white hover:border-[#FFB800]/50 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-[10px] font-black text-white flex items-center justify-center border-2 border-[#0B0E14]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar or Sign In */}
          {!isLoggedIn ? (
            <button
              onClick={() => onOpenAuth?.('signin')}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FFA000] text-black font-extrabold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              Sign In
            </button>
          ) : (
            <div
              onClick={() => onNavigate('profile')}
              className="relative cursor-pointer group"
              title={`${user.name} (${user.role || 'creator'})`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#FFB800] group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#0B0E14]"></span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
