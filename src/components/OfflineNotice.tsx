import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineNotice: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showBackOnlineToast, setShowBackOnlineToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnlineToast(true);
      setTimeout(() => setShowBackOnlineToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-1.5 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-medium text-[11px]">
            Offline Mode Active — You can still browse saved projects & draft ideas offline.
          </span>
        </div>
      </div>
    );
  }

  if (showBackOnlineToast) {
    return (
      <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-3 py-1.5 flex items-center justify-between text-xs text-emerald-300 transition-all">
        <div className="flex items-center space-x-2">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-[11px]">
            Back online! Connected to CREATE & EARN cloud.
          </span>
        </div>
      </div>
    );
  }

  return null;
};
