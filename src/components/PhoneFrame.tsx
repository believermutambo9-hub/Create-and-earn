import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isFrameActive: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isFrameActive }) => {
  if (!isFrameActive) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center">
        <main className="w-full max-w-lg min-h-screen bg-[#0B0E14] relative shadow-2xl flex flex-col">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070B] py-6 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center">
      {/* Background glow behind phone */}
      <div className="absolute w-96 h-96 bg-[#FFB800]/5 rounded-full blur-3xl pointer-events-none -top-10"></div>
      
      {/* Phone chassis */}
      <div className="relative w-full max-w-[420px] rounded-[48px] p-3 bg-gradient-to-b from-[#2A344A] via-[#151C2A] to-[#0D121B] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)] transition-all">
        {/* Inner screen border */}
        <div className="w-full rounded-[40px] bg-[#0B0E14] overflow-hidden flex flex-col border border-[#1F293D] shadow-inner relative max-h-[880px] min-h-[750px]">
          
          {/* iOS Status Bar */}
          <div className="w-full h-11 bg-[#0B0E14] px-7 flex items-center justify-between z-50 select-none shrink-0 border-b border-transparent">
            {/* Clock */}
            <span className="text-xs font-bold text-white tracking-tight">9:41</span>
            
            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center space-x-1.5 px-2 shadow-sm border border-neutral-800">
              <div className="w-2.5 h-2.5 rounded-full bg-[#121620] border border-neutral-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]/80"></div>
            </div>

            {/* Status Icons */}
            <div className="flex items-center space-x-1.5 text-white">
              <Signal className="w-3.5 h-3.5 fill-white" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-white text-white" />
            </div>
          </div>

          {/* Screen Scrollable Body */}
          <div className="w-full flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col pb-20 custom-scrollbar">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="w-full h-5 bg-[#0B0E14] flex items-center justify-center shrink-0 z-50">
            <div className="w-32 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
