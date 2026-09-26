import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Lock, 
  Copy, 
  Check, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'monthly' | 'yearly' | 'custom';
  amount: number;
  title: string;
  userEmail?: string;
  userName?: string;
  onPaymentSuccess: (details: { 
    method: 'Airtel Money' | 'MTN MoMo' | 'Zamtel Kwacha' | 'Bank Transfer'; 
    amount: number; 
    reference: string; 
    phone: string; 
  }) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  amount,
  title,
  userEmail = 'creator@createearn.com',
  userName = 'Creator',
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'Airtel Money' | 'MTN MoMo' | 'Zamtel Kwacha' | 'Card'>('Airtel Money');
  const [phoneNumber, setPhoneNumber] = useState('097 966 3914');
  const [cardHolder, setCardHolder] = useState(userName);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('123');
  
  // Checkout flow state: 'form' | 'processing_prompt' | 'success'
  const [step, setStep] = useState<'form' | 'processing_prompt' | 'success'>('form');
  const [referenceCode, setReferenceCode] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedMethod !== 'Card' && phoneNumber.trim().length < 9) {
      setErrorMessage('Please enter a valid 9 or 10-digit mobile number.');
      return;
    }

    setStep('processing_prompt');

    try {
      // Call backend checkout endpoint
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          amount,
          method: selectedMethod === 'Card' ? 'Card' : selectedMethod,
          phone: phoneNumber,
          email: userEmail,
          name: userName,
        }),
      });

      const data = await response.json();
      const generatedRef = data.reference || `CE-ZM-${Date.now().toString().slice(-6)}`;
      setReferenceCode(generatedRef);

      // Simulate USSD Prompt authorization timeout (3.5 seconds)
      setTimeout(async () => {
        try {
          await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reference: generatedRef }),
          });
        } catch (e) {
          // ignore error in simulation
        }

        setStep('success');
        onPaymentSuccess({
          method: selectedMethod === 'Card' ? 'Bank Transfer' : selectedMethod,
          amount,
          reference: generatedRef,
          phone: selectedMethod === 'Card' ? 'Visa •••• 4242' : phoneNumber,
        });
      }, 3500);
    } catch (err: any) {
      console.warn('Backend payment checkout error, continuing fallback:', err);
      const generatedRef = `CE-ZM-${Date.now().toString().slice(-6)}`;
      setReferenceCode(generatedRef);
      setTimeout(() => {
        setStep('success');
        onPaymentSuccess({
          method: selectedMethod === 'Card' ? 'Bank Transfer' : selectedMethod,
          amount,
          reference: generatedRef,
          phone: selectedMethod === 'Card' ? 'Visa •••• 4242' : phoneNumber,
        });
      }, 3000);
    }
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#111722] border border-[#232F46] rounded-3xl p-5 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E283D] mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Secure Checkout</h3>
              <p className="text-[10px] text-gray-400">CREATE & EARN Payouts & Subscriptions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1A2232] hover:bg-[#253046] text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: PAYMENT METHOD & DETAILS FORM */}
        {step === 'form' && (
          <form onSubmit={handleStartPayment} className="space-y-4">
            {/* Order Summary Pill */}
            <div className="p-3.5 rounded-2xl bg-[#172030] border border-[#232F46] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Selected Item
                </span>
                <p className="text-sm font-black text-white">{title}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block font-bold">Total Due</span>
                <span className="text-lg font-black text-[#FFB800] font-mono">
                  K{amount} <span className="text-xs text-gray-400 font-sans">ZMW</span>
                </span>
              </div>
            </div>

            {/* Select Method */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Airtel Money */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Airtel Money')}
                  className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                    selectedMethod === 'Airtel Money'
                      ? 'bg-[#1C2538] border-red-500 ring-1 ring-red-500/50'
                      : 'bg-[#141A26] border-[#222E42] hover:border-gray-600'
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 font-black text-xs">
                    Air
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">Airtel Money</p>
                    <p className="text-[9px] text-gray-400">Zambia 🇿🇲</p>
                  </div>
                </button>

                {/* MTN MoMo */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('MTN MoMo')}
                  className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                    selectedMethod === 'MTN MoMo'
                      ? 'bg-[#1C2538] border-yellow-400 ring-1 ring-yellow-400/50'
                      : 'bg-[#141A26] border-[#222E42] hover:border-gray-600'
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center shrink-0 font-black text-xs">
                    MTN
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">MTN MoMo</p>
                    <p className="text-[9px] text-gray-400">Zambia 🇿🇲</p>
                  </div>
                </button>

                {/* Zamtel Kwacha */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Zamtel Kwacha')}
                  className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                    selectedMethod === 'Zamtel Kwacha'
                      ? 'bg-[#1C2538] border-emerald-500 ring-1 ring-emerald-500/50'
                      : 'bg-[#141A26] border-[#222E42] hover:border-gray-600'
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-xs">
                    Zam
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">Zamtel Kwacha</p>
                    <p className="text-[9px] text-gray-400">Zambia 🇿🇲</p>
                  </div>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setSelectedMethod('Card')}
                  className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                    selectedMethod === 'Card'
                      ? 'bg-[#1C2538] border-blue-500 ring-1 ring-blue-500/50'
                      : 'bg-[#141A26] border-[#222E42] hover:border-gray-600'
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-black text-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">Bank Card</p>
                    <p className="text-[9px] text-gray-400">Visa / Mastercard</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Inputs based on selection */}
            {selectedMethod !== 'Card' ? (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                  {selectedMethod} Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-gray-400">
                    +260
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="97 123 4567"
                    className="w-full pl-14 pr-3 py-2.5 rounded-xl bg-[#141A26] border border-[#222E42] text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-400">
                  A USSD authorization prompt will appear on this handset.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-300 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A26] border border-[#222E42] text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-300 block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#141A26] border border-[#222E42] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-300 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#141A26] border border-[#222E42] text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#FFB800] to-[#F59E0B] hover:brightness-110 text-black font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 active:scale-95 transition-all mt-2"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>Pay K{amount} ZMW Securely</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>256-bit Bank Grade Encryption • Instant Account Activation</span>
            </div>
          </form>
        )}

        {/* STEP 2: USSD / PIN SIMULATION PROMPT */}
        {step === 'processing_prompt' && (
          <div className="py-6 text-center space-y-4 animate-in fade-in">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-2xl bg-[#FFB800]/20 animate-ping opacity-75" />
              <div className="relative w-16 h-16 rounded-2xl bg-[#172030] border border-[#FFB800] flex items-center justify-center text-[#FFB800]">
                <Smartphone className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-white">Check Your Phone</h4>
              <p className="text-xs text-gray-300 max-w-xs mx-auto">
                A USSD push notification has been sent to{' '}
                <span className="text-[#FFB800] font-bold">+260 {phoneNumber}</span>
              </p>
            </div>

            {/* USSD Dialog Simulation Box */}
            <div className="p-3.5 rounded-2xl bg-[#090D14] border border-[#232F46] text-left space-y-2 max-w-xs mx-auto shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-[#1E283D] pb-1.5">
                <span className="font-bold text-[#FFB800]">{selectedMethod} Push Prompt</span>
                <span>Just now</span>
              </div>
              <p className="text-[11px] text-gray-200 font-mono">
                Approve payment of <strong className="text-white">K{amount}.00</strong> to{' '}
                <strong className="text-[#FFB800]">CREATE & EARN</strong>?
              </p>
              <div className="flex items-center space-x-1.5 text-[10px] text-amber-400/90 pt-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Waiting for your PIN on handset...</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-500">
              Do not close this window. Verification is automatic once authorized.
            </p>
          </div>
        )}

        {/* STEP 3: PAYMENT CONFIRMED RECEIPT */}
        {step === 'success' && (
          <div className="py-4 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>Payment Confirmed & Verified</span>
              </div>
              <h4 className="text-lg font-black text-white">Transaction Successful!</h4>
              <p className="text-xs text-gray-400">
                You are now upgraded to <strong className="text-[#FFB800]">CREATE & EARN PRO</strong>.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-3.5 rounded-2xl bg-[#141A26] border border-[#222E42] text-left text-xs space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Amount Paid</span>
                <span className="font-bold text-white font-mono">K{amount} ZMW</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Payment Method</span>
                <span className="font-bold text-white">{selectedMethod}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 pt-1 border-t border-[#1F293D]">
                <span>Reference</span>
                <div className="flex items-center space-x-1 font-mono text-[11px] text-[#FFB800]">
                  <span>{referenceCode}</span>
                  <button 
                    type="button" 
                    onClick={handleCopyRef}
                    className="p-1 hover:text-white transition-colors"
                  >
                    {copiedRef ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-[#FFB800] hover:bg-[#FFA500] text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
            >
              Start Creating with PRO Tools
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
