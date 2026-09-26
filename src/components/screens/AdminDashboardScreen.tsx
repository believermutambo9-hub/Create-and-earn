import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Briefcase, 
  DollarSign, 
  Cpu, 
  AlertTriangle, 
  Check, 
  TrendingUp,
  BarChart3,
  Search,
  Sparkles
} from 'lucide-react';
import { Opportunity, Transaction } from '../../types';

interface AdminDashboardScreenProps {
  opportunities: Opportunity[];
  transactions: Transaction[];
  onBack: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  opportunities,
  transactions,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'creators' | 'campaigns' | 'transactions' | 'ai-usage'>('overview');
  const [flaggedResolved, setFlaggedResolved] = useState<string[]>([]);

  const stats = [
    { title: 'Active Creators', value: '1,482', change: '+12% this week', icon: Users, color: 'text-[#60A5FA]' },
    { title: 'Registered Brands', value: '138', change: '+5 new today', icon: Building2, color: 'text-[#F59E0B]' },
    { title: 'Escrow Paid Out', value: 'K182,400', change: '100% verified', icon: DollarSign, color: 'text-[#10B981]' },
    { title: 'AI Tokens Used', value: '1.42M', change: 'Gemini 3.8 Flash', icon: Cpu, color: 'text-[#A855F7]' },
  ];

  const creators = [
    { id: 'c-1', name: 'Ace Believer', category: 'Comedy 🇿🇲', followers: '2.4K', earnings: 'K4,750', status: 'Verified' },
    { id: 'c-2', name: 'Chanda Mwape', category: 'Acting & Skits', followers: '18.2K', earnings: 'K12,400', status: 'Verified' },
    { id: 'c-3', name: 'Thabo Phiri', category: 'Music & Afrobeat', followers: '5.1K', earnings: 'K2,900', status: 'Pending Review' },
    { id: 'c-4', name: 'Natasha Lungu', category: 'Beauty & Lifestyle', followers: '9.8K', earnings: 'K6,200', status: 'Verified' },
  ];

  const flaggedReports = [
    { id: 'rep-1', item: 'Spam Brand Pitch on Hungry Lion Deal', reporter: 'Ace Believer', reason: 'Unrelated cryptocurrency promotion', date: '1h ago' },
    { id: 'rep-2', item: 'Copyright Sound in Dance Clip', reporter: 'System AI Guard', reason: 'Unlicensed commercial jingle', date: '3h ago' },
  ];

  const handleResolve = (id: string) => {
    setFlaggedResolved([...flaggedResolved, id]);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1 text-[#8B5CF6] text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PLATFORM ADMINISTRATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Admin Control Center
          </h2>
          <p className="text-xs text-gray-400">
            Monitor African creator network, marketplace contracts & Gemini AI usage.
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-xs bg-[#1A2234] text-gray-300 hover:text-white px-3 py-1.5 rounded-xl border border-[#2B3954]"
        >
          Exit Admin
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#121824] p-1.5 rounded-2xl border border-[#222E42] flex items-center space-x-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'creators', label: 'Creators' },
          { id: 'campaigns', label: 'Deals & Escrow' },
          { id: 'transactions', label: 'Payouts' },
          { id: 'ai-usage', label: 'AI Health' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#8B5CF6] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-[#121824] rounded-2xl border border-[#212C41] p-3.5 space-y-1 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-lg font-black text-white font-mono">{stat.value}</p>
              <span className="text-[10px] text-gray-400 block">{stat.change}</span>
            </div>
          );
        })}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Flagged Reports */}
          <div className="bg-[#121824] rounded-3xl border border-[#212C41] p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                <span>Flagged Moderation Queue</span>
              </h3>
              <span className="text-[10px] bg-[#EF4444]/20 text-[#EF4444] px-2 py-0.5 rounded-full font-bold">
                {flaggedReports.length - flaggedResolved.length} pending
              </span>
            </div>

            <div className="space-y-2">
              {flaggedReports.map((rep) => {
                const isResolved = flaggedResolved.includes(rep.id);
                return (
                  <div
                    key={rep.id}
                    className="p-3 rounded-2xl bg-[#161E2E] border border-[#23314B] flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-white">{rep.item}</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Reported by: <span className="text-gray-300">{rep.reporter}</span> • {rep.reason}
                      </p>
                    </div>

                    {isResolved ? (
                      <span className="text-[#10B981] font-bold text-[10px] flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Resolved</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolve(rep.id)}
                        className="px-2.5 py-1 bg-[#10B981] text-black font-extrabold text-[10px] rounded-lg shadow-sm"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Payouts Table */}
          <div className="bg-[#121824] rounded-3xl border border-[#212C41] p-4 space-y-3 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Recent Creator Escrow Clearances
            </h3>
            <div className="space-y-2 text-xs">
              {transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex justify-between items-center py-1.5 border-b border-[#1A2335]">
                  <div>
                    <span className="font-bold text-white block">{tx.title}</span>
                    <span className="text-[10px] text-gray-400">{tx.method} • {tx.date}</span>
                  </div>
                  <span className="font-black text-[#10B981] font-mono">
                    K{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'creators' && (
        <div className="space-y-2">
          {creators.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-2xl bg-[#121824] border border-[#212C41] flex items-center justify-between text-xs shadow-sm"
            >
              <div>
                <h4 className="font-bold text-white">{c.name}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {c.category} • {c.followers} Followers
                </p>
              </div>
              <div className="text-right">
                <span className="font-black text-[#FFB800] block">{c.earnings}</span>
                <span className="text-[9px] text-[#10B981] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded">
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-2">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-3.5 rounded-2xl bg-[#121824] border border-[#212C41] flex items-center justify-between text-xs shadow-sm"
            >
              <div>
                <h4 className="font-bold text-white">{opp.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Brand: {opp.businessName} • {opp.applicantsCount} Applicants
                </p>
              </div>
              <span className="font-black text-[#10B981] font-mono">K{opp.budget}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-[#121824] border border-[#212C41] flex items-center justify-between text-xs shadow-sm"
            >
              <div>
                <h4 className="font-bold text-white">{tx.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{tx.method} • {tx.date}</p>
              </div>
              <span className="font-black text-[#10B981] font-mono">K{tx.amount}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ai-usage' && (
        <div className="bg-[#121824] rounded-3xl border border-[#212C41] p-4 space-y-3 text-xs shadow-md">
          <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-[#A855F7]" />
            <span>Gemini 3.8 Flash SDK Analytics</span>
          </h3>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#161F2E] border border-[#222E42] flex justify-between">
              <span className="text-gray-300">Model Name:</span>
              <strong className="text-white font-mono">gemini-3.8-flash</strong>
            </div>

            <div className="p-3 rounded-xl bg-[#161F2E] border border-[#222E42] flex justify-between">
              <span className="text-gray-300">Average Generation Latency:</span>
              <strong className="text-[#10B981] font-mono">1.14 seconds</strong>
            </div>

            <div className="p-3 rounded-xl bg-[#161F2E] border border-[#222E42] flex justify-between">
              <span className="text-gray-300">Curated African Culture Presets:</span>
              <strong className="text-[#FFB800] font-mono">Active (Zambia 🇿🇲)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
