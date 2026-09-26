import React, { useState } from 'react';
import { X, Plus, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Opportunity } from '../../types';
import { saveOpportunityToFirestore } from '../../services/firestoreService';

interface PostCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessLogo: string;
  onSuccess: (newOpp: Opportunity) => void;
}

export const PostCampaignModal: React.FC<PostCampaignModalProps> = ({
  isOpen,
  onClose,
  businessName,
  businessLogo,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Comedy');
  const [budget, setBudget] = useState(600);
  const [deadline, setDeadline] = useState('5 days');
  const [location, setLocation] = useState('Lusaka, Zambia');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('High energy comedy acting, minimum 15-30 second short format video.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in the campaign title and description.');
      return;
    }

    setLoading(true);
    setError(null);

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      businessId: `biz-${Date.now()}`,
      businessName: businessName || 'Verified Brand',
      businessLogo: businessLogo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      title: title.trim(),
      description: description.trim(),
      category,
      budget: Number(budget),
      deadline,
      location,
      requirements: requirements.split(',').map((r) => r.trim()).filter(Boolean),
      spotsAvailable: 1,
      applicantsCount: 0,
      featured: true,
      status: 'open',
    };

    try {
      await saveOpportunityToFirestore(newOpp);
      onSuccess(newOpp);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Failed to post campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-[#121824] border border-[#232D42] rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#182030] flex items-center justify-center text-gray-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5 pr-8">
          <span className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider">
            Brand Marketplace
          </span>
          <h3 className="font-extrabold text-base text-white">Post New Creator Campaign</h3>
          <p className="text-xs text-gray-400">
            Hire Zambian and African creators to produce viral content for your brand.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">
              Campaign Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hilarious Restaurant Skit featuring Sunday Combo"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white focus:outline-none focus:border-[#3B82F6]"
              >
                <option value="Comedy">Comedy 😂</option>
                <option value="Food & Dining">Food & Dining 🍔</option>
                <option value="Love & Relationships">Romance ❤️</option>
                <option value="Acting">Acting 🎭</option>
                <option value="Music & Dance">Music 🎵</option>
                <option value="Business">Business 💼</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Budget (ZMW Kwacha) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-[#FFB800]">K</span>
                <input
                  type="number"
                  required
                  min={50}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white font-mono font-bold focus:outline-none focus:border-[#3B82F6]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Deadline
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. 5 days, 1 week"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#3B82F6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1">
                Filming Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lusaka, Zambia"
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">
              Campaign Brief & Instructions *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the creator must do, brand messaging, product placement details, and target hashtags..."
              className="w-full p-3 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#3B82F6] resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">
              Creator Requirements (comma-separated)
            </label>
            <input
              type="text"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g. Comedy skits, minimum 1k followers, video in 1080p"
              className="w-full px-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#3B82F6]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Posting Campaign...' : 'Publish Campaign to Marketplace'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
