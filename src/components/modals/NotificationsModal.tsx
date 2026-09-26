import React from 'react';
import { Bell, CheckCheck, Briefcase, DollarSign, Sparkles, X } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Briefcase className="w-4 h-4 text-[#3B82F6]" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-[#10B981]" />;
      default: return <Sparkles className="w-4 h-4 text-[#FFB800]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111723] border border-[#23314B] rounded-3xl p-5 w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#1C2538] pb-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-[#FFB800]" />
            <h3 className="text-sm font-black text-white">Notifications</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[10px] text-[#FFB800] hover:underline font-bold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#182030] text-gray-400 hover:text-white flex items-center justify-center text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                notif.isRead
                  ? 'bg-[#131A27] border-[#202B3E] opacity-75'
                  : 'bg-[#182234] border-[#FFB800]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-[#0F1522] flex items-center justify-center">
                    {getIcon(notif.type)}
                  </div>
                  <h4 className="font-bold text-white text-[11px]">{notif.title}</h4>
                </div>
                <span className="text-[9px] text-gray-400">{notif.time}</span>
              </div>
              <p className="text-[11px] text-gray-300 pl-8 leading-relaxed">
                {notif.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
