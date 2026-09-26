import React, { useState } from 'react';
import { Crown, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { PaymentCheckoutModal } from '../modals/PaymentCheckoutModal';

interface PremiumScreenProps {
  onSubscribe: (plan: string, details?: { method: string; amount: number; reference: string; phone: string }) => void;
  onBack: () => void;
  userEmail?: string;
  userName?: string;
}

export const PremiumScreen: React.FC<PremiumScreenProps> = ({ 
  onSubscribe, 
  onBack,
  userEmail = 'creator@createearn.com',
  userName = 'Creator'
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{ plan: 'monthly' | 'yearly'; amount: number; title: string }>({
    plan: 'yearly',
    amount: 399,
    title: 'CREATE & EARN PRO (Yearly)',
  });
  const [subscribedNotice, setSubscribedNotice] = useState(false);

  const perks = [
    'Unlimited AI idea & script generations',
    'Full director HD scene-by-scene planning',
    'Priority opportunity matching with top brands',
    'Exclusive Zambian & African cultural presets 🇿🇲',
    'Zero platform transaction fees on earnings',
    'Verified Gold Creator badge on profile',
    'Direct business VIP messaging inbox',
  ];

  const handleOpenCheckout = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
    const amount = plan === 'monthly' ? 49 : 399;
    const title = plan === 'monthly' ? 'PRO Creator Monthly (K49/mo)' : 'PRO Creator Yearly (K399/yr - Save 40%)';
    setCheckoutData({ plan, amount, title });
    setShowCheckoutModal(true);
  };

  const handleCheckoutSuccess = (details: { method: any; amount: number; reference: string; phone: string }) => {
    setShowCheckoutModal(false);
    setSubscribedNotice(true);
    onSubscribe(checkoutData.plan, details);
    setTimeout(() => {
      setSubscribedNotice(false);
      onBack();
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 pb-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col items-center text-center pt-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFB800] via-amber-400 to-yellow-200 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-3">
          <Crown className="w-8 h-8 text-black fill-black" />
        </div>

        <h2 className="text-2xl font-black text-white">
          Unlock More with Premium
        </h2>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Get unlimited AI generations, advanced scene planning and higher paid brand deals.
        </p>
      </div>

      {subscribedNotice ? (
        <div className="p-6 text-center space-y-2 bg-[#10B981]/20 border border-[#10B981]/40 rounded-3xl animate-in fade-in">
          <ShieldCheck className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
          <h3 className="text-base font-black text-white">Welcome to CREATE & EARN PRO!</h3>
          <p className="text-xs text-gray-300">
            Unlimited AI tools and verified creator benefits are now active on your account.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Monthly Card */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative shadow-lg ${
              selectedPlan === 'monthly'
                ? 'bg-[#151D2C] border-[#FFB800] ring-1 ring-[#FFB800]/50'
                : 'bg-[#121824] border-[#222E42] hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                  Monthly Plan
                </span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-2xl font-black text-white font-mono">K49</span>
                  <span className="text-xs text-gray-400">/ per month</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCheckout('monthly');
              }}
              className="w-full py-3 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/25 active:scale-95 transition-all"
            >
              Subscribe Monthly (K49)
            </button>
          </div>

          {/* Yearly Card (Highlighted Save 40%) */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer relative shadow-xl ${
              selectedPlan === 'yearly'
                ? 'bg-[#172030] border-[#FFB800] ring-2 ring-[#FFB800]'
                : 'bg-[#121824] border-[#222E42] hover:border-gray-500'
            }`}
          >
            {/* Save 40% Badge */}
            <span className="absolute -top-3 right-5 bg-gradient-to-r from-[#FFB800] to-[#F59E0B] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
              Save 40%
            </span>

            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                  Yearly Plan
                </span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-2xl font-black text-white font-mono">K399</span>
                  <span className="text-xs text-gray-400">/ per year</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenCheckout('yearly');
              }}
              className="w-full py-3 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
            >
              Subscribe Yearly (Best Value - K399)
            </button>
          </div>

          {/* Feature Checklist */}
          <div className="bg-[#121824] rounded-3xl border border-[#212C41] p-4 space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-300 mb-1">
              Included in PRO:
            </h4>
            {perks.map((perk, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs text-gray-200">
                <div className="w-4 h-4 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Payment Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        plan={checkoutData.plan}
        amount={checkoutData.amount}
        title={checkoutData.title}
        userEmail={userEmail}
        userName={userName}
        onPaymentSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};
