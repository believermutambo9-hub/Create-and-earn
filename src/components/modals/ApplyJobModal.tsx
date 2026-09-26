import React, { useState } from 'react';
import { X, Send, Sparkles, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Opportunity, Application, CreatorProfile } from '../../types';
import { submitApplicationToFirestore } from '../../services/firestoreService';

interface ApplyJobModalProps {
  isOpen: boolean;
  opportunity: Opportunity | null;
  user: CreatorProfile;
  onClose: () => void;
  onSuccess: (app: Application) => void;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({
  isOpen,
  opportunity,
  user,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !opportunity) return null;

  const [pitch, setPitch] = useState('');
  const [proposedFee, setProposedFee] = useState<number>(opportunity.budget);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) {
      setError('Please write a brief pitch explaining your creative concept.');
      return;
    }

    setLoading(true);
    setError(null);

    const application: Application = {
      id: `app-${Date.now()}`,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      businessId: opportunity.businessId || 'business-1',
      businessName: opportunity.businessName,
      creatorId: user.id || 'creator-believer',
      creatorName: user.name,
      creatorAvatar: user.avatar,
      creatorCategory: user.category,
      pitch,
      portfolioUrl: portfolioUrl || `https://createandearn.africa/creator/${user.username.replace('@', '')}`,
      proposedFee,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    try {
      await submitApplicationToFirestore(application);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess(application);
        onClose();
        setSubmitted(false);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError('Failed to submit application. Please try again.');
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

        {/* Opportunity Summary Header */}
        <div className="flex items-center space-x-3 mb-5 pr-8">
          <img
            src={opportunity.businessLogo}
            alt={opportunity.businessName}
            className="w-12 h-12 rounded-2xl object-cover border border-[#232D42]"
          />
          <div>
            <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider">
              Apply to Campaign
            </span>
            <h3 className="font-extrabold text-sm text-white line-clamp-1">
              {opportunity.title}
            </h3>
            <p className="text-xs text-gray-400">
              {opportunity.businessName} • Budget: <span className="text-[#10B981] font-bold">K{opportunity.budget}</span>
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto border-2 border-[#10B981]/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">Pitch Submitted! 🚀</h4>
            <p className="text-xs text-gray-300 max-w-xs mx-auto">
              Your application has been delivered to {opportunity.businessName}. You will receive a direct notification and message offer once approved.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Pitch Input */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Your Creative Pitch & Concept Hook *
              </label>
              <textarea
                rows={4}
                required
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Explain how you will craft this video, opening 3-second hook, characters, and how you will feature the brand organically..."
                className="w-full p-3 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB800] resize-none"
              />
            </div>

            {/* Proposed Fee & Portfolio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Proposed Fee (ZMW)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#FFB800]">K</span>
                  <input
                    type="number"
                    value={proposedFee}
                    onChange={(e) => setProposedFee(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white font-mono font-bold focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  Sample Video / Reel URL
                </label>
                <input
                  type="text"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0E14] border border-[#232D42] text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FFB800]"
                />
              </div>
            </div>

            {/* Escrow Guarantee Notice */}
            <div className="p-3 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/25 flex items-start space-x-2 text-[11px] text-amber-200">
              <Sparkles className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
              <span>
                <strong>Escrow Protected:</strong> Once the brand accepts your pitch, K{proposedFee} is locked into CREATE & EARN Escrow before you start filming, guaranteeing 100% payout upon delivery.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FFA000] text-black font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit Pitch Application'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
