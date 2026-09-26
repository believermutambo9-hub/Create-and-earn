import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, CheckCircle2, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onDismiss?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onDismiss }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone mode (already installed), do not show
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => setIsDismissed(true), 3000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General instructions fallback
      setShowIOSModal(true);
    }
  };

  const handleClose = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <>
      {/* Sleek App Install Prompt Bar */}
      <div className="relative mx-3 my-2 p-3 bg-gradient-to-r from-[#172033] via-[#1A253C] to-[#141B2B] rounded-2xl border border-[#FFB800]/30 shadow-lg shadow-black/40 overflow-hidden">
        {/* Ambient glow accent */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FFB800]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0B0E14] border border-[#FFB800]/40 flex items-center justify-center p-1.5 shrink-0 shadow-md">
              <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xs text-white truncate">Install CREATE & EARN</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-gray-300 truncate">
                Add to your home screen for quick offline access
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {installSuccess ? (
              <span className="flex items-center text-xs font-bold text-[#10B981] space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Installed!</span>
              </span>
            ) : (
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FFA000] text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-white rounded-lg transition"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS or Manual Install Guidance Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#121824] border border-[#232D42] rounded-3xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#0B0E14] border border-[#FFB800] flex items-center justify-center p-1">
                  <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Install CREATE & EARN</h3>
                  <p className="text-[10px] text-gray-400">Install to your mobile home screen</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-7 h-7 rounded-full bg-[#182030] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 py-4">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#161D2B] border border-[#232D42]">
                <div className="w-7 h-7 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  1
                </div>
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    Tap the Share Button <Share2 className="w-3.5 h-3.5 text-[#3B82F6] inline" />
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    In your Safari or browser menu, tap the share icon at the bottom or top of your screen.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#161D2B] border border-[#232D42]">
                <div className="w-7 h-7 rounded-full bg-[#FFB800]/20 text-[#FFB800] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  2
                </div>
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    Select "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 text-[#FFB800] inline" />
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Scroll down through the share sheet options and select <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#161D2B] border border-[#232D42]">
                <div className="w-7 h-7 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  3
                </div>
                <div>
                  <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                    Launch like a Native App <Smartphone className="w-3.5 h-3.5 text-[#10B981] inline" />
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Open from your home screen anytime without browser bars, with instant loading and offline capability.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#FFB800] text-black font-extrabold text-xs hover:bg-[#FFA000] transition"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
