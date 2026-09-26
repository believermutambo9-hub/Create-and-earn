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
  Users 
} from 'lucide-react';
import { Opportunity, Role } from '../../types';

interface OpportunitiesScreenProps {
  opportunities: Opportunity[];
  activeRole: Role;
  onApply: (opportunityId: string, pitchData: any) => void;
  onSaveOpportunity: (opportunityId: string) => void;
  onPostCampaign: (campaignData: Partial<Opportunity>) => void;
  onSelectBusiness: (businessName: string) => void;
}

export const OpportunitiesScreen: React.FC<OpportunitiesScreenProps> = ({
  opportunities,
  activeRole,
  onApply,
  onSaveOpportunity,
  onPostCampaign,
  onSelectBusiness,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'saved' | 'my-applications' | 'post-campaign'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Apply Modal State
  const [applyingOpportunity, setApplyingOpportunity] = useState<Opportunity | null>(null);
  const [pitchText, setPitchText] = useState('I specialize in viral Lusaka relatable comedy skits. I have 15M+ views and can turn this campaign into an instant high-retention TikTok & Reels video with top audio quality.');
  const [deliveryDays, setDeliveryDays] = useState('3 days');
  const [submittedApp, setSubmittedApp] = useState(false);

  // Business Post Campaign State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Food & Beverage');
  const [newBudget, setNewBudget] = useState('1200');
  const [newDeadline, setNewDeadline] = useState('7 days left');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('Lusaka, Zambia');
  const [campaignPostedNotice, setCampaignPostedNotice] = useState(false);

  const categories = ['All', 'Food & Beverage', 'Fintech & Apps', 'Beauty & Lifestyle', 'Fitness & Health', 'Zambian Brands 🇿🇲'];

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = 
      selectedCategory === 'All' || 
      (selectedCategory === 'Zambian Brands 🇿🇲' ? opp.location.includes('Zambia') : opp.category === selectedCategory);

    if (activeTab === 'saved') {
      return matchesSearch && matchesCat && opp.isSaved;
    }
    if (activeTab === 'my-applications') {
      return matchesSearch && matchesCat && opp.hasApplied;
    }

    return matchesSearch && matchesCat;
  });

  const handleConfirmApply = () => {
    if (!applyingOpportunity) return;
    onApply(applyingOpportunity.id, {
      pitch: pitchText,
      deliveryDays,
    });
    setSubmittedApp(true);
    setTimeout(() => {
      setSubmittedApp(false);
      setApplyingOpportunity(null);
    }, 1800);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    onPostCampaign({
      title: newTitle,
      businessName: 'Hungry Lion Lusaka',
      businessLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      category: newCategory,
      budget: parseInt(newBudget, 10) || 500,
      deadline: newDeadline,
      location: newLocation,
      description: newDescription,
      requirements: ['High video resolution', 'Authentic comedy', 'Brand tag in description'],
      spotsAvailable: 2,
      applicantsCount: 0,
      featured: true
    });

    setCampaignPostedNotice(true);
    setTimeout(() => {
      setCampaignPostedNotice(false);
      setActiveTab('browse');
      setNewTitle('');
      setNewDescription('');
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-24">
      {/* Title */}
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
            Get paid in Zambian Kwacha (K) to create skits, reviews & video ads.
          </p>
        </div>

        {/* Post Campaign Button for businesses or creators */}
        <button
          onClick={() => setActiveTab(activeTab === 'post-campaign' ? 'browse' : 'post-campaign')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
            activeTab === 'post-campaign'
              ? 'bg-[#3B82F6] text-white shadow-md'
              : 'bg-[#182030] text-gray-300 hover:text-white border border-[#2B3954]'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-[#FFB800]" />
          <span>{activeTab === 'post-campaign' ? 'Browse' : 'Post Deal'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#121824] p-1.5 rounded-2xl border border-[#222E42] flex items-center space-x-1">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'browse'
              ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Browse ({opportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'saved'
              ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Saved ({opportunities.filter((o) => o.isSaved).length})
        </button>

        <button
          onClick={() => setActiveTab('my-applications')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'my-applications'
              ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Applied ({opportunities.filter((o) => o.hasApplied).length})
        </button>
      </div>

      {activeTab === 'post-campaign' ? (
        /* Business Post Campaign Form */
        <div className="bg-[#121824] rounded-3xl border border-[#222E43] p-5 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-[#1C2538] pb-3">
            <Building2 className="w-5 h-5 text-[#3B82F6]" />
            <div>
              <h3 className="text-sm font-bold text-white">Post Brand Campaign</h3>
              <p className="text-[11px] text-gray-400">Reach 15,000+ talented African creators</p>
            </div>
          </div>

          {campaignPostedNotice ? (
            <div className="p-6 text-center space-y-2 bg-[#10B981]/15 rounded-2xl border border-[#10B981]/40">
              <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
              <h4 className="text-sm font-black text-white">Campaign Live on Marketplace!</h4>
              <p className="text-xs text-gray-300">Creators can now submit video pitches for your review.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-bold block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hilarious Restaurant Skit for New Chicken Wings"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Fintech & Apps">Fintech & Apps</option>
                    <option value="Beauty & Lifestyle">Beauty & Lifestyle</option>
                    <option value="Fashion & Retail">Fashion & Retail</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Budget (Zambian Kwacha K)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Deadline</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. 5 days left"
                    className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Location / Target</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Description & Requirements</label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain what the video should cover, humor style, deliverables, product visibility..."
                  className="w-full bg-[#182030] border border-[#2B3954] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold rounded-xl shadow-lg transition-all"
              >
                Publish Campaign to Creators
              </button>
            </form>
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
                    {opp.requirements.map((req, idx) => (
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
                        Guaranteed Budget
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
                          onClick={() => setApplyingOpportunity(opp)}
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

      {/* Application Pitch Modal */}
      {applyingOpportunity && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111723] border border-[#23314B] rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1C2538] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider">
                  SUBMIT CREATOR APPLICATION
                </span>
                <h3 className="text-sm font-black text-white">{applyingOpportunity.title}</h3>
                <p className="text-xs text-gray-400">Brand: {applyingOpportunity.businessName}</p>
              </div>
              <button
                onClick={() => setApplyingOpportunity(null)}
                className="w-7 h-7 rounded-full bg-[#182030] text-gray-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {submittedApp ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto animate-bounce" />
                <h4 className="text-sm font-black text-white">Application Submitted!</h4>
                <p className="text-xs text-gray-300">
                  {applyingOpportunity.businessName} will review your portfolio. You'll receive a message upon approval!
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#161F30] border border-[#24334E] flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-[10px] block">Contract Value:</span>
                    <strong className="text-[#FFB800] text-base font-black">
                      K{applyingOpportunity.budget}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-[10px] block">Turnaround:</span>
                    <span className="text-white font-bold">{deliveryDays}</span>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">
                    Your Pitch to {applyingOpportunity.businessName}
                  </label>
                  <textarea
                    rows={4}
                    value={pitchText}
                    onChange={(e) => setPitchText(e.target.value)}
                    placeholder="Describe your comedy angle, previous video views, audio setup, and why you are the best fit..."
                    className="w-full bg-[#182030] border border-[#2B3954] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800] resize-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">
                    Expected Delivery Time
                  </label>
                  <div className="flex gap-2">
                    {['2 days', '3 days', '5 days'].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDeliveryDays(days)}
                        className={`flex-1 py-1.5 rounded-lg font-bold text-xs border ${
                          deliveryDays === days
                            ? 'bg-[#FFB800] text-black border-[#FFB800]'
                            : 'bg-[#182030] text-gray-300 border-[#2B3954]'
                        }`}
                      >
                        {days}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    onClick={handleConfirmApply}
                    className="flex-1 py-3 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold rounded-xl shadow-lg transition-all"
                  >
                    Submit Application (K{applyingOpportunity.budget})
                  </button>
                  <button
                    onClick={() => setApplyingOpportunity(null)}
                    className="py-3 px-4 bg-[#182030] text-gray-300 hover:text-white font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
