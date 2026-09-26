import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Clock, 
  MapPin, 
  Bookmark, 
  Check, 
  PlusCircle, 
  ArrowRight, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Users,
  CheckCheck,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Opportunity, Application, Role } from '../../types';

interface OpportunitiesScreenProps {
  opportunities: Opportunity[];
  applications?: Application[];
  activeRole: Role;
  onApply: (opportunity: Opportunity) => void;
  onSaveOpportunity: (opportunityId: string) => void;
  onPostCampaign: () => void;
  onSelectBusiness: (businessName: string) => void;
  onAcceptApplication?: (app: Application) => Promise<void>;
  onCompleteJob?: (app: Application) => Promise<void>;
}

export const OpportunitiesScreen: React.FC<OpportunitiesScreenProps> = ({
  opportunities,
  applications = [],
  activeRole,
  onApply,
  onSaveOpportunity,
  onPostCampaign,
  onSelectBusiness,
  onAcceptApplication,
  onCompleteJob,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'saved' | 'my-applications' | 'applicants'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const categories = ['All', 'Comedy', 'Food & Dining', 'Love & Relationships', 'Acting', 'Music & Dance', 'Business'];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = 
      selectedCategory === 'All' || opp.category.toLowerCase().includes(selectedCategory.toLowerCase());

    if (activeTab === 'saved') {
      return matchesSearch && matchesCat && opp.isSaved;
    }
    if (activeTab === 'my-applications') {
      return matchesSearch && matchesCat && opp.hasApplied;
    }

    return matchesSearch && matchesCat;
  });

  const handleHire = async (app: Application) => {
    if (!onAcceptApplication) return;
    setActionLoading(app.id);
    try {
      await onAcceptApplication(app);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (app: Application) => {
    if (!onCompleteJob) return;
    setActionLoading(app.id);
    try {
      await onCompleteJob(app);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-24">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1 text-[#FFB800] text-xs font-bold mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CREATOR MARKETPLACE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Brand Opportunities
          </h2>
          <p className="text-xs text-gray-400">
            Get paid in Zambian Kwacha (K) with verified Escrow protection.
          </p>
        </div>

        {/* Post Campaign Button */}
        <button
          onClick={onPostCampaign}
          className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-md transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-[#FFB800]" />
          <span>Post Deal</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#121824] p-1.5 rounded-2xl border border-[#222E42] flex items-center space-x-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex-1 min-w-[75px] py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'browse'
              ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Browse ({opportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 min-w-[75px] py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'saved'
              ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Saved ({opportunities.filter((o) => o.isSaved).length})
        </button>

        <button
          onClick={() => setActiveTab('my-applications')}
          className={`flex-1 min-w-[75px] py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'my-applications'
              ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Applied ({opportunities.filter((o) => o.hasApplied).length})
        </button>

        {activeRole === 'business' && (
          <button
            onClick={() => setActiveTab('applicants')}
            className={`flex-1 min-w-[100px] py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'applicants'
                ? 'bg-[#3B82F6] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Review ({applications.length})
          </button>
        )}
      </div>

      {activeTab === 'applicants' ? (
        /* Business Reviewing Creator Applicants */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Incoming Creator Proposals ({applications.length})
            </h3>
            <span className="text-[11px] text-[#3B82F6] font-semibold">
              Select creator to fund Escrow
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="py-12 text-center bg-[#121824] rounded-3xl border border-[#202C3F] p-6 space-y-2">
              <Users className="w-10 h-10 text-gray-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No applications yet</h4>
              <p className="text-xs text-gray-400">
                Creators will appear here as soon as they submit pitches for your campaigns.
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="bg-[#121824] rounded-3xl border border-[#202C40] p-4 sm:p-5 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={app.creatorAvatar}
                      alt={app.creatorName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#FFB800]"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-white flex items-center gap-1">
                        <span>{app.creatorName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        Campaign: <strong className="text-gray-300">{app.opportunityTitle}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-black text-[#10B981] font-mono">
                    K{app.proposedFee}
                  </span>
                </div>

                {/* Pitch Details */}
                <div className="p-3 rounded-2xl bg-[#0B0E14] border border-[#1E2638] text-xs text-gray-300 leading-relaxed">
                  <p className="font-semibold text-gray-400 text-[10px] uppercase mb-1">
                    Creative Pitch & Angle:
                  </p>
                  <p>{app.pitch}</p>
                  {app.portfolioUrl && (
                    <a
                      href={app.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center space-x-1 text-[11px] text-[#3B82F6] hover:underline font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Sample Reel</span>
                    </a>
                  )}
                </div>

                {/* Actions & Status */}
                <div className="pt-2 border-t border-[#1C2538] flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Status: <strong className="text-[#FFB800] uppercase font-bold">{app.status}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    {app.status === 'pending' && (
                      <button
                        onClick={() => handleHire(app)}
                        disabled={actionLoading === app.id}
                        className="px-3.5 py-1.5 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Hire & Lock Escrow (K{app.proposedFee})</span>
                      </button>
                    )}

                    {app.status === 'accepted' && (
                      <button
                        onClick={() => handleComplete(app)}
                        disabled={actionLoading === app.id}
                        className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Approve Delivery & Release Payment</span>
                      </button>
                    )}

                    {app.status === 'completed' && (
                      <span className="text-xs font-bold text-[#10B981] flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Contract Paid Out</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Search & Categories */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search campaigns, brands, requirements..."
                className="w-full bg-[#131A27] border border-[#222E42] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800] transition-colors"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#1E293E] text-[#FFB800] border border-[#FFB800]/50'
                      : 'bg-[#121824] text-gray-400 border border-[#202C40] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Opportunities Cards */}
          <div className="space-y-3">
            {filteredOpportunities.length === 0 ? (
              <div className="py-12 text-center bg-[#121824] rounded-3xl border border-[#202C3F] p-6 space-y-2">
                <Briefcase className="w-10 h-10 text-gray-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No opportunities found</h4>
                <p className="text-xs text-gray-400">Try changing your filters or search keywords.</p>
              </div>
            ) : (
              filteredOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-[#121824] rounded-3xl border border-[#202C40] hover:border-[#FFB800]/40 p-4 sm:p-5 space-y-3.5 shadow-md transition-all group"
                >
                  {/* Top Business Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={opp.businessLogo}
                        alt={opp.businessName}
                        onClick={() => onSelectBusiness(opp.businessName)}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/10 cursor-pointer hover:scale-105 transition-transform"
                      />
                      <div>
                        <div
                          onClick={() => onSelectBusiness(opp.businessName)}
                          className="flex items-center space-x-1 cursor-pointer group-hover:text-[#FFB800] transition-colors"
                        >
                          <span className="text-xs font-bold text-gray-300">
                            {opp.businessName}
                          </span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                        </div>
                        <h3 className="text-sm font-black text-white leading-tight mt-0.5">
                          {opp.title}
                        </h3>
                      </div>
                    </div>

                    {/* Bookmark */}
                    <button
                      onClick={() => onSaveOpportunity(opp.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        opp.isSaved
                          ? 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/40'
                          : 'bg-[#182030] text-gray-400 hover:text-white border-[#273650]'
                      }`}
                      title={opp.isSaved ? 'Remove from saved' : 'Save opportunity'}
                    >
                      <Bookmark className={`w-4 h-4 ${opp.isSaved ? 'fill-[#FFB800]' : ''}`} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Requirements Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {opp.requirements?.map((req, idx) => (
                      <span
                        key={idx}
                        className="bg-[#182132] text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-lg border border-[#26344E]"
                      >
                        ✓ {req}
                      </span>
                    ))}
                  </div>

                  {/* Footer: Budget, Deadline, Action */}
                  <div className="pt-3 border-t border-[#1C2538] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
                        Guaranteed Escrow
                      </span>
                      <span className="text-base font-black text-[#FFB800]">
                        K{opp.budget}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right text-[11px] text-gray-400">
                        <span className="flex items-center space-x-1 justify-end">
                          <Clock className="w-3 h-3 text-[#10B981]" />
                          <span>{opp.deadline}</span>
                        </span>
                        <span>{opp.applicantsCount} applied</span>
                      </div>

                      {opp.hasApplied ? (
                        <span className="px-3.5 py-2 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 rounded-xl text-xs font-bold flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onApply(opp)}
                          className="px-4 py-2 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
