import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Trash2,
  CheckCircle2,
  Lock,
  Unlock,
  Building,
  CreditCard,
  Wallet,
  ExternalLink,
  Copy,
  Save,
  Smartphone
} from 'lucide-react';
import { Opportunity, Transaction, CreatorProfile } from '../../types';

interface AdminDashboardScreenProps {
  opportunities: Opportunity[];
  transactions: Transaction[];
  creators?: CreatorProfile[];
  onBack: () => void;
  onToggleVerify?: (creatorId: string, current: boolean) => Promise<void>;
  onApproveEscrowRelease?: (tx: Transaction) => Promise<void>;
  onDeleteOpportunity?: (oppId: string) => Promise<void>;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  opportunities,
  transactions,
  creators = [],
  onBack,
  onToggleVerify,
  onApproveEscrowRelease,
  onDeleteOpportunity,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'creators' | 'campaigns' | 'transactions' | 'ai-usage' | 'payouts'>('overview');
  const [flaggedResolved, setFlaggedResolved] = useState<string[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Platform Owner Payout & Gateway Settings
  const [ownerBankName, setOwnerBankName] = useState('Zanaco Bank Zambia');
  const [ownerAccountName, setOwnerAccountName] = useState('Believer Mutambo');
  const [ownerAccountNumber, setOwnerAccountNumber] = useState('1029384756');
  const [ownerBranch, setOwnerBranch] = useState('Lusaka Corporate Center');
  const [ownerMoMoNumber, setOwnerMoMoNumber] = useState('+260 97 966 3914');
  const [ownerMoMoProvider, setOwnerMoMoProvider] = useState('Airtel Money');
  const [gatewayProvider, setGatewayProvider] = useState<'Flutterwave' | 'DPO Pay' | 'Paystack' | 'Lipila'>('Flutterwave');
  const [gatewayMode, setGatewayMode] = useState<'sandbox' | 'live'>('sandbox');
  const [publicKey, setPublicKey] = useState('FLWPUBK_TEST-e092149b10c9-X');
  const [secretKey, setSecretKey] = useState('FLWSECK_TEST-••••••••••••');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [savedConfigSuccess, setSavedConfigSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/payments/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.config) {
          if (data.config.ownerBank?.mobileMoneyPayoutNumber) {
            setOwnerMoMoNumber(data.config.ownerBank.mobileMoneyPayoutNumber);
          }
          if (data.config.ownerBank?.mobileMoneyProvider) {
            setOwnerMoMoProvider(data.config.ownerBank.mobileMoneyProvider);
          }
          if (data.config.ownerBank?.bankName) {
            setOwnerBankName(data.config.ownerBank.bankName);
          }
          if (data.config.ownerBank?.accountName) {
            setOwnerAccountName(data.config.ownerBank.accountName);
          }
          if (data.config.ownerBank?.accountNumber) {
            setOwnerAccountNumber(data.config.ownerBank.accountNumber);
          }
        }
      })
      .catch((err) => console.warn('Could not load payment config:', err));
  }, []);

  const handleSavePayoutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await fetch('/api/payments/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeProvider: gatewayProvider,
          isTestMode: gatewayMode === 'sandbox',
          ownerBank: {
            bankName: ownerBankName,
            accountName: ownerAccountName,
            accountNumber: ownerAccountNumber,
            branch: ownerBranch,
            mobileMoneyPayoutNumber: ownerMoMoNumber,
            mobileMoneyProvider: ownerMoMoProvider,
          },
        }),
      });
      setSavedConfigSuccess(true);
      setTimeout(() => setSavedConfigSuccess(false), 2500);
    } catch (err) {
      console.warn('Error saving payout config:', err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const mockCreatorsList: CreatorProfile[] = creators.length > 0 ? creators : [
    {
      id: 'c-1',
      name: 'Ace Believer',
      username: '@acebeliever',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Viral Lusaka Comedy',
      category: 'Comedy 🇿🇲',
      location: 'Lusaka, Zambia',
      countryFlag: '🇿🇲',
      followers: 2400,
      following: 120,
      rating: 5.0,
      completedJobs: 14,
      totalEarnings: 4750,
      availableBalance: 2450,
      pendingBalance: 500,
      isVerified: true,
      services: [],
      portfolioVideos: []
    },
    {
      id: 'c-2',
      name: 'Mwape Chanda',
      username: '@mwapecomedy',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Acting & Skits',
      category: 'Acting 🎭',
      location: 'Kitwe, Zambia',
      countryFlag: '🇿🇲',
      followers: 18200,
      following: 340,
      rating: 4.9,
      completedJobs: 28,
      totalEarnings: 12400,
      availableBalance: 4200,
      pendingBalance: 1200,
      isVerified: true,
      services: [],
      portfolioVideos: []
    },
    {
      id: 'c-3',
      name: 'Thabo Phiri',
      username: '@thabobeats',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Music & Afrobeat Producer',
      category: 'Music 🎵',
      location: 'Ndola, Zambia',
      countryFlag: '🇿🇲',
      followers: 5100,
      following: 80,
      rating: 4.8,
      completedJobs: 6,
      totalEarnings: 2900,
      availableBalance: 900,
      pendingBalance: 0,
      isVerified: false,
      services: [],
      portfolioVideos: []
    }
  ];

  const totalEscrow = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

  const stats = [
    { title: 'Registered Creators', value: `${mockCreatorsList.length * 480}+`, change: '+12% this week', icon: Users, color: 'text-[#60A5FA]' },
    { title: 'Live Campaigns', value: `${opportunities.length}`, change: 'Marketplace Active', icon: Building2, color: 'text-[#F59E0B]' },
    { title: 'Total Escrow Processed', value: `K${totalEscrow || 182400}`, change: '100% Mobile Money', icon: DollarSign, color: 'text-[#10B981]' },
    { title: 'Gemini 3.8 SDK', value: 'Online', change: 'Latency: ~1.1s', icon: Cpu, color: 'text-[#A855F7]' },
  ];

  const flaggedReports = [
    { id: 'rep-1', item: 'Spam Crypto Pitch on Deal', reporter: 'Ace Believer', reason: 'Unrelated cryptocurrency promotion', date: '1h ago' },
    { id: 'rep-2', item: 'Unlicensed Commercial Audio', reporter: 'System AI Guard', reason: 'Copyright audio infringement', date: '3h ago' },
  ];

  const handleToggleVerification = async (c: CreatorProfile) => {
    if (!onToggleVerify) return;
    setLoadingAction(c.id);
    try {
      await onToggleVerify(c.id, c.isVerified);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEscrowRelease = async (tx: Transaction) => {
    if (!onApproveEscrowRelease) return;
    setLoadingAction(tx.id);
    try {
      await onApproveEscrowRelease(tx);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteOpp = async (oppId: string) => {
    if (!onDeleteOpportunity) return;
    if (confirm('Are you sure you want to remove this campaign from the marketplace?')) {
      setLoadingAction(oppId);
      try {
        await onDeleteOpportunity(oppId);
      } finally {
        setLoadingAction(null);
      }
    }
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
            Audit creator accounts, enforce escrow security & oversee Gemini AI generation.
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-xs bg-[#1A2234] text-gray-300 hover:text-white px-3 py-1.5 rounded-xl border border-[#2B3954] transition"
        >
          Exit Admin
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#121824] p-1.5 rounded-2xl border border-[#222E42] flex items-center space-x-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'payouts', label: 'Owner Payouts & Gateway 💰' },
          { id: 'creators', label: 'Verify Creators' },
          { id: 'campaigns', label: 'Manage Deals' },
          { id: 'transactions', label: 'Escrow Ledger' },
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Moderation Queue */}
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
                        onClick={() => setFlaggedResolved([...flaggedResolved, rep.id])}
                        className="px-2.5 py-1 bg-[#10B981] text-black font-extrabold text-[10px] rounded-lg shadow-sm"
                      >
                        Dismiss / Resolve
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Escrow Audit */}
          <div className="bg-[#121824] rounded-3xl border border-[#212C41] p-4 space-y-3 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Recent Escrow Clearances & Payouts
            </h3>
            <div className="space-y-2 text-xs">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex justify-between items-center py-2 border-b border-[#1A2335]">
                  <div>
                    <span className="font-bold text-white block">{tx.title}</span>
                    <span className="text-[10px] text-gray-400">
                      {tx.method} • {tx.date} • Ref: {tx.reference || 'ZM-AUTO'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#10B981] font-mono block">K{tx.amount}</span>
                    <span className="text-[9px] font-bold text-gray-400">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Verify Creators Tab */}
      {activeTab === 'creators' && (
        <div className="space-y-2.5">
          <p className="text-xs text-gray-400">
            Verified creators receive the blue checkmark badge and priority marketplace ranking.
          </p>
          {mockCreatorsList.map((c) => (
            <div
              key={c.id}
              className="p-3.5 rounded-2xl bg-[#121824] border border-[#212C41] flex items-center justify-between text-xs shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#2B3954]"
                />
                <div>
                  <h4 className="font-bold text-white flex items-center gap-1">
                    <span>{c.name}</span>
                    {c.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />}
                  </h4>
                  <p className="text-[10px] text-gray-400">
                    {c.category} • {c.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleVerification(c)}
                  disabled={loadingAction === c.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                    c.isVerified
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                      : 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
                  }`}
                >
                  {c.isVerified ? (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Unverify</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3" />
                      <span>Verify ⚡</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manage Campaigns Tab */}
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
                  Brand: {opp.businessName} • Budget: <strong className="text-[#FFB800]">K{opp.budget}</strong> • {opp.applicantsCount} Applicants
                </p>
              </div>

              <button
                onClick={() => handleDeleteOpp(opp.id)}
                disabled={loadingAction === opp.id}
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 rounded-xl border border-rose-500/20 transition"
                title="Remove Campaign"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Escrow Ledger Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-[#121824] border border-[#212C41] flex items-center justify-between text-xs shadow-sm"
            >
              <div>
                <h4 className="font-bold text-white">{tx.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {tx.method} • {tx.date} • {tx.type}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-black text-[#10B981] font-mono">K{tx.amount}</span>
                {tx.status === 'Pending' ? (
                  <button
                    onClick={() => handleEscrowRelease(tx)}
                    disabled={loadingAction === tx.id}
                    className="px-2.5 py-1 bg-[#10B981] text-black font-extrabold rounded-lg text-[10px]"
                  >
                    Release Escrow
                  </button>
                ) : (
                  <span className="text-[9px] font-bold text-gray-400 px-2 py-0.5 bg-[#182030] rounded">
                    {tx.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Owner Payouts & Gateway Tab */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          {/* Revenue Summary Banner */}
          <div className="bg-gradient-to-br from-[#1C2538] via-[#141B28] to-[#0E131E] rounded-3xl p-5 border border-[#2B3954] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Wallet className="w-4 h-4 text-[#10B981]" />
                <span>Owner Revenue Hub</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-[10px] font-black">
                Settling to Your Account
              </span>
            </div>

            <p className="text-xs text-gray-400">
              All subscription payments (K49 / K399) and platform escrow fees are automatically paid out to the bank or mobile money account below.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
              <div className="p-3 rounded-2xl bg-[#0F1420] border border-[#20293D]">
                <span className="text-[10px] text-gray-400 block font-bold">Sub Revenue</span>
                <span className="text-base font-black text-[#FFB800] font-mono">K4,890</span>
                <span className="text-[9px] text-gray-500 block">PRO subscribers</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0F1420] border border-[#20293D]">
                <span className="text-[10px] text-gray-400 block font-bold">Escrow 5% Cut</span>
                <span className="text-base font-black text-[#10B981] font-mono">K1,450</span>
                <span className="text-[9px] text-gray-500 block">Campaign fees</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#0F1420] border border-[#20293D] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-gray-400 block font-bold">Total Net Revenue</span>
                <span className="text-base font-black text-white font-mono">K6,340</span>
                <span className="text-[9px] text-gray-500 block">ZMW in settlement</span>
              </div>
            </div>
          </div>

          {/* Owner Payout Destination Form */}
          <form onSubmit={handleSavePayoutSettings} className="bg-[#121824] rounded-3xl border border-[#212C41] p-4.5 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#1E283D] pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center">
                  <Building className="w-4 h-4 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Your Bank / Payout Destination</h3>
                  <p className="text-[10px] text-gray-400">Where gateway deposits your money</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={ownerBankName}
                  onChange={(e) => setOwnerBankName(e.target.value)}
                  placeholder="e.g. Zanaco Bank Zambia"
                  className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={ownerAccountName}
                  onChange={(e) => setOwnerAccountName(e.target.value)}
                  placeholder="e.g. Believer Mutambo"
                  className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                  Account Number
                </label>
                <input
                  type="text"
                  value={ownerAccountNumber}
                  onChange={(e) => setOwnerAccountNumber(e.target.value)}
                  placeholder="e.g. 1029384756"
                  className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white font-mono focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                  Branch
                </label>
                <input
                  type="text"
                  value={ownerBranch}
                  onChange={(e) => setOwnerBranch(e.target.value)}
                  placeholder="e.g. Lusaka Corporate"
                  className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                  Mobile Money Provider (Alternative Payout)
                </label>
                <select
                  value={ownerMoMoProvider}
                  onChange={(e) => setOwnerMoMoProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white focus:outline-none focus:border-[#10B981]"
                >
                  <option value="Airtel Money">Airtel Money Zambia 🇿🇲</option>
                  <option value="MTN MoMo">MTN Mobile Money Zambia 🇿🇲</option>
                  <option value="Zamtel Kwacha">Zamtel Kwacha 🇿🇲</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                  Mobile Money Number
                </label>
                <input
                  type="text"
                  value={ownerMoMoNumber}
                  onChange={(e) => setOwnerMoMoNumber(e.target.value)}
                  placeholder="+260 97 1234567"
                  className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white font-mono focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>

            {/* Payment Gateway Settings */}
            <div className="pt-3 border-t border-[#1E283D] space-y-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-[#FFB800]" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Payment Gateway Integration
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                    Aggregator Provider
                  </label>
                  <select
                    value={gatewayProvider}
                    onChange={(e) => setGatewayProvider(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white"
                  >
                    <option value="Flutterwave">Flutterwave (Airtel + MTN + Cards)</option>
                    <option value="DPO Pay">DPO Group (Direct Pay Online Zambia)</option>
                    <option value="Paystack">Paystack</option>
                    <option value="Lipila">Lipila / Kazang</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                    Environment Mode
                  </label>
                  <select
                    value={gatewayMode}
                    onChange={(e) => setGatewayMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white"
                  >
                    <option value="sandbox">Sandbox (Test Mode - Simulated USSD)</option>
                    <option value="live">Live (Real Mobile Money & Card Charges)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                    Public Key
                  </label>
                  <input
                    type="text"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-300 block mb-1 uppercase tracking-wider">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161F2E] border border-[#222E42] text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Webhook URL display */}
              <div className="p-3 rounded-2xl bg-[#0B0F17] border border-[#1E283D] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block font-bold">Your Live Webhook URL</span>
                  <span className="text-[11px] font-mono text-[#FFB800] truncate max-w-xs block">
                    /api/payments/webhook
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Ready
                </span>
              </div>
            </div>

            {savedConfigSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Payout destination & gateway settings updated successfully!</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSavingConfig}
              className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingConfig ? 'Saving Settings...' : 'Save Payout Destination & Gateway'}</span>
            </button>
          </form>
        </div>
      )}

      {/* AI Health Tab */}
      {activeTab === 'ai-usage' && (
        <div className="bg-[#121824] rounded-3xl border border-[#212C41] p-4 space-y-3 text-xs shadow-md">
          <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-[#A855F7]" />
            <span>Google Gemini Flash AI Model Status</span>
          </h3>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#161F2E] border border-[#222E42] flex justify-between">
              <span className="text-gray-300">Model Engine:</span>
              <strong className="text-white font-mono">gemini-3.8-flash (@google/genai)</strong>
            </div>

            <div className="p-3 rounded-xl bg-[#161F2E] border border-[#222E42] flex justify-between">
              <span className="text-gray-300">Connected Endpoints:</span>
              <strong className="text-[#10B981] font-mono">Idea, Script, Scenes, Captions</strong>
            </div>

            <div className="p-3 rounded-xl bg-[#161F2E] border border-[#222E42] flex justify-between">
              <span className="text-gray-300">Database Engine:</span>
              <strong className="text-[#FFB800] font-mono">Google Cloud Firestore</strong>
            </div>

            <div className="p-3 rounded-xl bg-[#161F2E] border border-[#222E42] flex justify-between">
              <span className="text-gray-300">Authentication:</span>
              <strong className="text-[#60A5FA] font-mono">Firebase Auth (Email, Password, Google)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
