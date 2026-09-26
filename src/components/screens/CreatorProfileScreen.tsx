import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Settings, 
  Sparkles, 
  Edit3, 
  Play, 
  Briefcase, 
  Star, 
  MessageCircle, 
  Share2, 
  Crown, 
  LogOut,
  Shield,
  CreditCard,
  Bell,
  HelpCircle,
  FileText
} from 'lucide-react';
import { CreatorProfile, Screen } from '../../types';

interface CreatorProfileScreenProps {
  user: CreatorProfile;
  onNavigate: (screen: Screen) => void;
  onContact: () => void;
  onUpdateBio?: (newBio: string) => void;
}

export const CreatorProfileScreen: React.FC<CreatorProfileScreenProps> = ({
  user,
  onNavigate,
  onContact,
  onUpdateBio,
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'services' | 'settings'>('portfolio');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);
  const [isCopied, setIsCopied] = useState(false);

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`https://createandearn.africa/creator/${user.username.replace('@', '')}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveBio = () => {
    if (onUpdateBio) {
      onUpdateBio(bioInput);
    }
    setIsEditingBio(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-24">
      {/* Top Bar with Settings */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Creator Identity
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareProfile}
            className="w-8 h-8 rounded-full bg-[#161D2B] text-gray-300 hover:text-white flex items-center justify-center border border-[#232F45]"
            title="Share Profile"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="w-8 h-8 rounded-full bg-[#161D2B] text-gray-300 hover:text-white flex items-center justify-center border border-[#232F45]"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Header matching frame 10 */}
      <div className="flex flex-col items-center text-center">
        {/* Profile Picture with Verified badge */}
        <div className="relative mb-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#1A2538] shadow-2xl"
          />
          {user.isVerified && (
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center text-white border-2 border-[#0B0E14] shadow-md">
              <CheckCircle2 className="w-4 h-4 fill-white text-[#3B82F6]" />
            </div>
          )}
        </div>

        {/* Creator Name & Subtitle */}
        <h2 className="text-xl font-black text-white flex items-center space-x-1.5 justify-center">
          <span>{user.name}</span>
        </h2>
        <p className="text-xs font-semibold text-gray-400 mt-0.5">
          Creator • {user.location} {user.countryFlag}
        </p>

        {/* Bio */}
        {isEditingBio ? (
          <div className="w-full mt-3 space-y-2">
            <textarea
              rows={3}
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              className="w-full bg-[#182030] border border-[#2B3954] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#FFB800]"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditingBio(false)}
                className="px-3 py-1 bg-[#182030] text-gray-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBio}
                className="px-3 py-1 bg-[#FFB800] text-black font-bold text-xs rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-300 mt-2 max-w-xs leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* 3 Stats Row matching frame 10: Projects 12 | Followers 2.4K | Following 48 */}
        <div className="grid grid-cols-3 gap-6 my-4 py-3 px-6 rounded-2xl bg-[#121824] border border-[#212C41] w-full max-w-xs shadow-md">
          <div className="text-center">
            <span className="text-lg font-black text-white font-mono block">
              {user.completedJobs}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">
              Projects
            </span>
          </div>

          <div className="text-center border-x border-[#1E2638] px-2">
            <span className="text-lg font-black text-white font-mono block">
              {(user.followers / 1000).toFixed(1)}K
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">
              Followers
            </span>
          </div>

          <div className="text-center">
            <span className="text-lg font-black text-white font-mono block">
              {user.following}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase">
              Following
            </span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center space-x-2 w-full max-w-xs">
          <button
            onClick={() => setIsEditingBio(!isEditingBio)}
            className="flex-1 py-2.5 px-4 bg-[#182030] hover:bg-[#202C40] text-white font-bold text-xs rounded-xl border border-[#2B3954] transition-all"
          >
            Edit Profile
          </button>

          <button
            onClick={onContact}
            className="flex-1 py-2.5 px-4 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-black" />
            <span>Messages</span>
          </button>
        </div>
      </div>

      {/* "My Stats" card matching frame 10 */}
      <div className="bg-[#121824] rounded-3xl border border-[#212C41] p-4 space-y-3 shadow-md">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-300">
          My Stats
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#1A2335]">
            <span className="text-gray-400">Total Generations</span>
            <span className="text-white font-black font-mono">48</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#1A2335]">
            <span className="text-gray-400">This Month</span>
            <span className="text-white font-black font-mono">18</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-gray-400">Subscription Plan</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#FFB800] font-black">PRO Creator</span>
              <button
                onClick={() => onNavigate('premium')}
                className="text-[10px] text-gray-400 underline hover:text-white"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Portfolio, Services, Settings */}
      <div className="flex border-b border-[#1C2538] text-xs font-bold">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'portfolio'
              ? 'text-[#FFB800] border-[#FFB800]'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Portfolio Videos ({user.portfolioVideos.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'services'
              ? 'text-[#FFB800] border-[#FFB800]'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Services Offered ({user.services.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'settings'
              ? 'text-[#FFB800] border-[#FFB800]'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {user.portfolioVideos.map((vid) => (
            <div
              key={vid.id}
              className="bg-[#121824] rounded-2xl overflow-hidden border border-[#202C40] group relative cursor-pointer shadow-md"
            >
              <div className="relative aspect-[9/16] max-h-48 overflow-hidden bg-neutral-900">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#FFB800] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-black translate-x-0.5" />
                  </div>
                </div>

                <span className="absolute bottom-2 right-2 bg-black/80 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                  {vid.duration}
                </span>

                <span className="absolute top-2 left-2 bg-[#10B981]/90 text-black text-[9px] font-black px-1.5 py-0.5 rounded">
                  {vid.views} views
                </span>
              </div>

              <div className="p-2">
                <h5 className="text-[11px] font-bold text-white line-clamp-1">
                  {vid.title}
                </h5>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-2.5">
          {user.services.map((srv) => (
            <div
              key={srv.id}
              className="p-3.5 rounded-2xl bg-[#121824] border border-[#202C40] space-y-1.5 shadow-md"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white">{srv.title}</h4>
                <span className="text-xs font-black text-[#FFB800] font-mono">
                  {srv.rate}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                {srv.description}
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onContact}
                  className="px-3 py-1 bg-[#1A2335] hover:bg-[#222E44] text-[#FFB800] text-[10px] font-bold rounded-lg border border-[#2B3954] transition-all"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        /* Settings List required by prompt */
        <div className="bg-[#121824] rounded-3xl border border-[#202C40] p-2 divide-y divide-[#1A2335] text-xs">
          {[
            { icon: Edit3, label: 'Edit Profile & Links' },
            { icon: Bell, label: 'Notifications & Alerts' },
            { icon: Shield, label: 'Privacy & Security' },
            { icon: CreditCard, label: 'Payment Settings (Mobile Money)' },
            { icon: Crown, label: 'PRO Creator Subscription', action: () => onNavigate('premium') },
            { icon: HelpCircle, label: 'Help & Support Desk' },
            { icon: FileText, label: 'Terms & Privacy Policy' },
            { icon: LogOut, label: 'Log Out', danger: true },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action || (() => alert(`${item.label} opened.`))}
                className={`w-full p-3 flex items-center justify-between text-left transition-colors ${
                  item.danger
                    ? 'text-[#EF4444] hover:bg-[#EF4444]/10'
                    : 'text-gray-200 hover:bg-[#182132]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 opacity-80" />
                  <span className="font-semibold">{item.label}</span>
                </div>
                <span className="text-gray-500">›</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
