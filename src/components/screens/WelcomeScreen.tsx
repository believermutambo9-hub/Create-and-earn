import React from 'react';
import { Crown, Sparkles, ArrowRight, Zap, Play } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-[#0B0E14] via-[#111722] to-[#0B0E14] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 -right-10 w-48 h-48 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Branding */}
      <div className="flex flex-col items-center text-center pt-8 z-10">
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFB800] via-amber-400 to-yellow-200 flex items-center justify-center shadow-xl shadow-amber-500/25">
            <Crown className="w-9 h-9 text-black fill-black" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#10B981] border-2 border-[#0B0E14]"></span>
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white font-mono uppercase">
          CREATE <span className="text-[#FFB800]">&</span> EARN
        </h1>
        <p className="text-sm font-semibold text-gray-400 mt-1 flex items-center space-x-1.5">
          <span>Create. Connect. Earn.</span>
        </p>

        <div className="mt-2 inline-flex items-center space-x-1 bg-[#1A2233] px-3 py-1 rounded-full border border-[#2B3852]">
          <Zap className="w-3.5 h-3.5 text-[#FFB800]" />
          <span className="text-[11px] font-bold text-gray-300">Your AI Partner for African Creators 🇿🇲</span>
        </div>
      </div>

      {/* Hero Creator Image */}
      <div className="my-6 z-10 flex flex-col items-center">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-[#FFB800]/40 shadow-2xl shadow-black/80 group">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
            alt="African Creator Laughing"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent opacity-80"></div>
          
          {/* Floating badge */}
          <div className="absolute bottom-3 left-3 right-3 bg-[#131A28]/90 backdrop-blur-md p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Ace Believer</p>
              <p className="text-[10px] text-gray-400">Viral Comedy • Lusaka 🇿🇲</p>
            </div>
            <div className="bg-[#FFB800] text-black px-2 py-0.5 rounded text-[10px] font-black">
              K4,750 Earned
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-4 z-10">
        <button
          onClick={onGetStarted}
          className="w-full py-4 px-6 rounded-2xl bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-base tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 transition-all transform active:scale-98"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onLogin}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#141A27] hover:bg-[#1A2335] text-gray-300 hover:text-white font-bold text-sm tracking-wide border border-[#232D42] transition-all"
        >
          I Already Have An Account
        </button>

        <p className="text-[11px] text-center text-gray-500">
          Serving 15,000+ creators across Zambia & Africa
        </p>
      </div>
    </div>
  );
};
