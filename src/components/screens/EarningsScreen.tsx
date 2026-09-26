import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  Smartphone, 
  Building, 
  Sparkles, 
  AlertCircle,
  Download,
  CreditCard
} from 'lucide-react';
import { CreatorProfile, Transaction } from '../../types';

interface EarningsScreenProps {
  user: CreatorProfile;
  transactions: Transaction[];
  onWithdraw: (amount: number, method: string, accountDetails: string) => void;
}

export const EarningsScreen: React.FC<EarningsScreenProps> = ({
  user,
  transactions,
  onWithdraw,
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'Airtel Money' | 'MTN MoMo' | 'Bank Transfer'>('Airtel Money');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [mobileNumber, setMobileNumber] = useState(user.mobileMoneyNumber || '0979663914');
  const [bankName, setBankName] = useState('Zanaco Bank');
  const [accountNumber, setAccountNumber] = useState('549102839102');
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);

  const handleConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > user.availableBalance) {
      alert(`Please enter an amount up to your available balance of K${user.availableBalance}`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const details = withdrawMethod === 'Bank Transfer' ? `${bankName} (${accountNumber})` : mobileNumber;
      onWithdraw(amountNum, withdrawMethod, details);
      setIsProcessing(false);
      setWithdrawalSuccess(true);
      setTimeout(() => {
        setWithdrawalSuccess(false);
        setShowWithdrawModal(false);
      }, 1600);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 pb-24">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-1 text-[#FFB800] text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FINANCIAL REVENUE HUB</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Creator Earnings
        </h2>
        <p className="text-xs text-gray-400">
          Track campaign payouts, pending sponsor escrow & instant mobile money withdrawals.
        </p>
      </div>

      {/* Main Financial Card (Available Balance) */}
      <div className="bg-gradient-to-br from-[#1C2538] via-[#141B28] to-[#0E131E] rounded-3xl p-5 border border-[#2B3954] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#FFB800]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Wallet className="w-4 h-4 text-[#FFB800]" />
            <span>Available Balance</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-[10px] font-black">
            Ready to Cashout
          </span>
        </div>

        <div className="flex items-baseline space-x-1 my-1">
          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
            K{user.availableBalance.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 font-bold">ZMW</span>
        </div>

        <p className="text-[11px] text-gray-400 mt-1">
          Instant withdrawal to Airtel Money, MTN MoMo, or Zambian Bank Accounts.
        </p>

        <div className="mt-4 pt-3 border-t border-[#232F46] flex items-center space-x-2">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 py-3 px-4 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            <span>Withdraw Funds</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards matching prompt requirements */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Pending Escrow */}
        <div className="bg-[#121824] p-3 rounded-2xl border border-[#212C41] space-y-1">
          <div className="flex items-center space-x-1 text-gray-400 text-[10px] font-bold">
            <Clock className="w-3 h-3 text-[#F59E0B]" />
            <span>Pending</span>
          </div>
          <p className="text-sm sm:text-base font-black text-white font-mono">
            K{user.pendingBalance.toLocaleString()}
          </p>
          <span className="text-[9px] text-gray-500 block">In brand review</span>
        </div>

        {/* Total Earned */}
        <div className="bg-[#121824] p-3 rounded-2xl border border-[#212C41] space-y-1">
          <div className="flex items-center space-x-1 text-gray-400 text-[10px] font-bold">
            <ArrowDownLeft className="w-3 h-3 text-[#10B981]" />
            <span>Total Earned</span>
          </div>
          <p className="text-sm sm:text-base font-black text-[#10B981] font-mono">
            K{user.totalEarnings.toLocaleString()}
          </p>
          <span className="text-[9px] text-gray-500 block">Lifetime revenue</span>
        </div>

        {/* Completed Jobs */}
        <div className="bg-[#121824] p-3 rounded-2xl border border-[#212C41] space-y-1">
          <div className="flex items-center space-x-1 text-gray-400 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-[#3B82F6]" />
            <span>Jobs Done</span>
          </div>
          <p className="text-sm sm:text-base font-black text-white font-mono">
            {user.completedJobs}
          </p>
          <span className="text-[9px] text-gray-500 block">100% 5★ ratings</span>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Transaction History
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">All Activities</span>
        </div>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl bg-[#121824] border border-[#202B3E] flex items-center justify-between space-x-3 shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'withdrawal'
                      ? 'bg-[#EF4444]/15 text-[#EF4444]'
                      : 'bg-[#10B981]/15 text-[#10B981]'
                  }`}
                >
                  {tx.type === 'withdrawal' ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {tx.title}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5">
                    <span>{tx.method}</span>
                    <span>•</span>
                    <span>{tx.date}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs sm:text-sm font-black font-mono block ${
                    tx.type === 'withdrawal' ? 'text-gray-300' : 'text-[#10B981]'
                  }`}
                >
                  {tx.type === 'withdrawal' ? '-' : '+'}K{tx.amount}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    tx.status === 'Completed'
                      ? 'text-[#10B981] bg-[#10B981]/10'
                      : 'text-[#F59E0B] bg-[#F59E0B]/10'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111723] border border-[#24334E] rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1C2538] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider">
                  CASH OUT EARNINGS
                </span>
                <h3 className="text-base font-black text-white">Withdraw Funds</h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-7 h-7 rounded-full bg-[#182030] text-gray-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {withdrawalSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
                <h4 className="text-base font-black text-white">Withdrawal Initiated!</h4>
                <p className="text-xs text-gray-300">
                  K{withdrawAmount} has been queued to your {withdrawMethod}. Expect mobile money SMS confirmation in 2-5 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmWithdraw} className="space-y-3.5 text-xs">
                {/* Method selector */}
                <div>
                  <label className="text-gray-300 font-bold block mb-1.5">
                    Select Payout Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Airtel Money', icon: Smartphone, label: 'Airtel 🇿🇲' },
                      { id: 'MTN MoMo', icon: Smartphone, label: 'MTN MoMo 🇿🇲' },
                      { id: 'Bank Transfer', icon: Building, label: 'Bank 🏦' },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setWithdrawMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                            withdrawMethod === m.id
                              ? 'bg-[#FFB800] text-black border-[#FFB800] font-black'
                              : 'bg-[#182030] text-gray-300 border-[#283652]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px]">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-300 font-bold">Amount (Kwacha K)</label>
                    <span className="text-gray-400 text-[10px]">
                      Max: K{user.availableBalance}
                    </span>
                  </div>
                  <input
                    type="number"
                    max={user.availableBalance}
                    min={50}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-white font-mono text-base focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                {/* Account Details */}
                {withdrawMethod === 'Bank Transfer' ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-gray-300 font-bold block mb-1">Bank Name</label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB800]"
                      >
                        <option value="Zanaco Bank">Zanaco Bank</option>
                        <option value="Stanbic Bank Zambia">Stanbic Bank Zambia</option>
                        <option value="Absa Bank Zambia">Absa Bank Zambia</option>
                        <option value="First National Bank (FNB)">First National Bank (FNB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 font-bold block mb-1">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB800]"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-gray-300 font-bold block mb-1">
                      {withdrawMethod} Mobile Number
                    </label>
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+260 97..."
                      className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-[#161E2E] border border-[#222E44] flex items-start space-x-2 text-[10px] text-gray-400">
                  <AlertCircle className="w-4 h-4 text-[#FFB800] shrink-0 mt-0.5" />
                  <span>Withdrawals to Zambian mobile wallets are processed automatically within 5 minutes. No platform fee.</span>
                </div>

                <div className="pt-2 flex space-x-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold rounded-xl shadow-lg transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing Transfer...' : `Confirm Withdrawal (K${withdrawAmount})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="py-3 px-4 bg-[#182030] text-gray-300 hover:text-white font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
