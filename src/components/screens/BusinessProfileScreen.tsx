import React from 'react';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Star, 
  Briefcase, 
  MessageCircle, 
  DollarSign, 
  Clock 
} from 'lucide-react';
import { BusinessProfile, Opportunity, Screen } from '../../types';

interface BusinessProfileScreenProps {
  business: BusinessProfile;
  activeCampaigns: Opportunity[];
  onApplyOpportunity: (opp: Opportunity) => void;
  onMessageBusiness: () => void;
  onBack: () => void;
}

export const BusinessProfileScreen: React.FC<BusinessProfileScreenProps> = ({
  business,
  activeCampaigns,
  onApplyOpportunity,
  onMessageBusiness,
  onBack,
}) => {
  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 pb-24">
      {/* Business Header Card */}
      <div className="bg-[#121824] rounded-3xl border border-[#212C41] p-5 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <img
              src={business.logo}
              alt={business.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h2 className="text-lg font-black text-white">{business.name}</h2>
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6] fill-[#3B82F6]" />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{business.category}</p>
              <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>{business.location}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          {business.description}
        </p>

        {/* Business Stats */}
        <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-2xl bg-[#161F30] border border-[#23314B] text-center">
          <div>
            <span className="text-sm sm:text-base font-black text-white font-mono block">
              {business.activeCampaignsCount}
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Active Deals</span>
          </div>

          <div className="border-x border-[#23314B] px-1">
            <span className="text-sm sm:text-base font-black text-[#10B981] font-mono block">
              K{(business.totalSpent / 1000).toFixed(0)}K+
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-bold">Paid to Creators</span>
          </div>

          <div>
            <div className="flex items-center justify-center space-x-0.5 text-[#FFB800]">
              <Star className="w-3.5 h-3.5 fill-[#FFB800]" />
              <span className="text-sm sm:text-base font-black text-white font-mono">
                {business.rating}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 uppercase font-bold">
              ({business.reviewsCount} reviews)
            </span>
          </div>
        </div>

        <button
          onClick={onMessageBusiness}
          className="w-full py-3 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-black" />
          <span>Message Brand Representative</span>
        </button>
      </div>

      {/* Active Campaigns List */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-white">
          Active Campaigns by {business.name}
        </h3>

        <div className="space-y-3">
          {activeCampaigns.map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-2xl bg-[#121824] border border-[#202B3E] space-y-3 shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{opp.title}</h4>
                  <span className="text-[10px] text-[#60A5FA] font-medium block mt-0.5">
                    {opp.category}
                  </span>
                </div>
                <span className="text-sm font-black text-[#FFB800] font-mono">
                  K{opp.budget}
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                {opp.description}
              </p>

              <div className="flex justify-between items-center pt-2 border-t border-[#1C2538] text-[11px]">
                <span className="text-gray-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#10B981]" />
                  <span>{opp.deadline}</span>
                </span>

                <button
                  onClick={() => onApplyOpportunity(opp)}
                  className="px-3.5 py-1.5 bg-[#FFB800] text-black font-extrabold rounded-lg shadow-sm active:scale-95"
                >
                  Apply (K{opp.budget})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
