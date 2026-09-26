import React, { useState } from 'react';
import { X, User, MapPin, Phone, Briefcase, CheckCircle2, AlertCircle } from 'lucide-react';
import { CreatorProfile } from '../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  user: CreatorProfile;
  onClose: () => void;
  onSave: (updated: Partial<CreatorProfile>) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [category, setCategory] = useState(user.category);
  const [location, setLocation] = useState(user.location);
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState(user.mobileMoneyNumber || '');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState(user.mobileMoneyProvider || 'Airtel Money');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave({
        name,
        username: username.startsWith('@') ? username : `@${username}`,
        bio,
        category,
        location,
        mobileMoneyNumber,
        mobileMoneyProvider,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#121824] border border-[#232D42] rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#182030] flex items-center justify-center text-gray-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4 pr-6">
          <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider">
            Profile Settings
          </span>
          <h3 className="text-base font-black text-white">Edit Creator Profile</h3>
          <p className="text-xs text-gray-400">Updates are saved permanently to your cloud account.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-gray-300 font-bold mb-1">Display Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0E14] border border-[#232D42] text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Username / Handle</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0E14] border border-[#232D42] text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-1">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0B0E14] border border-[#232D42] text-white focus:outline-none focus:border-[#FFB800] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-300 font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0E14] border border-[#232D42] text-white focus:outline-none focus:border-[#FFB800]"
              >
                <option value="Comedy">Comedy 😂</option>
                <option value="Love & Relationships">Romance ❤️</option>
                <option value="Acting">Acting 🎭</option>
                <option value="Music & Dance">Music 🎵</option>
                <option value="Business">Business 💼</option>
                <option value="Lifestyle">Lifestyle 📱</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0E14] border border-[#232D42] text-white focus:outline-none focus:border-[#FFB800]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#1C2538]">
            <label className="block text-gray-300 font-bold mb-1">
              Mobile Money Payout Wallet (Zambia)
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select
                value={mobileMoneyProvider}
                onChange={(e) => setMobileMoneyProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0E14] border border-[#232D42] text-white focus:outline-none focus:border-[#FFB800]"
              >
                <option value="Airtel Money">Airtel Money 🇿🇲</option>
                <option value="MTN MoMo">MTN MoMo 🇿🇲</option>
                <option value="Zamtel Kwacha">Zamtel Kwacha 🇿🇲</option>
              </select>

              <input
                type="text"
                placeholder="+260 97..."
                value={mobileMoneyNumber}
                onChange={(e) => setMobileMoneyNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0E14] border border-[#232D42] text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB800]"
              />
            </div>
            <p className="text-[10px] text-gray-500">
              Payouts and campaign earnings will automatically transfer to this number.
            </p>
          </div>

          <div className="pt-2 flex space-x-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-[#182030] text-gray-300 hover:text-white font-bold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
