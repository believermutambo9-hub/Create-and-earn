import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  Briefcase, 
  CheckCheck, 
  ArrowLeft, 
  CheckCircle2, 
  DollarSign, 
  FileText,
  Sparkles,
  Plus
} from 'lucide-react';
import { Message, CreatorProfile, Role } from '../../types';

interface MessagingScreenProps {
  user: CreatorProfile;
  activeRole: Role;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (text: string, isOffer?: boolean, offerAmount?: number, projectRef?: string) => Promise<void>;
  onAcceptOffer: (msgId: string, amount: number) => Promise<void>;
}

export const MessagingScreen: React.FC<MessagingScreenProps> = ({
  user,
  activeRole,
  messages,
  onBack,
  onSendMessage,
  onAcceptOffer,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('500');
  const [offerTitle, setOfferTitle] = useState('Brand Deal: TikTok Comedy Skit');
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    const text = inputMessage;
    setInputMessage('');
    try {
      await onSendMessage(text);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleSendCustomOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(offerAmount);
    if (!amount || amount <= 0) return;

    setSending(true);
    try {
      await onSendMessage(
        `Official Campaign Offer: K${amount} locked for "${offerTitle}".`,
        true,
        amount,
        offerTitle
      );
      setShowOfferModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] pb-24">
      {/* Messaging Header */}
      <div className="p-3 bg-[#111623] border-b border-[#1E2638] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#161D2B] border border-[#232D42] flex items-center justify-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80"
              alt="Hungry Lion"
              className="w-9 h-9 rounded-full object-cover border border-[#2B3954]"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#111623]"></span>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1">
              <span>Hungry Lion Lusaka</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />
            </h3>
            <p className="text-[10px] text-gray-400">Verified Brand • Active Escrow Deal</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {activeRole === 'business' && (
            <button
              onClick={() => setShowOfferModal(true)}
              className="px-2.5 py-1 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[11px] font-bold flex items-center space-x-1 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Send Offer</span>
            </button>
          )}

          <span className="text-[11px] font-black text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
            Escrow Protected
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 shadow-md ${
                  isMe
                    ? 'bg-[#FFB800] text-black font-medium rounded-br-none'
                    : 'bg-[#151D2C] text-gray-100 border border-[#24324A] rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>

                {/* Offer Card Attachment if present */}
                {msg.isOffer && (
                  <div className="bg-[#0E131E] rounded-xl p-3 border border-[#2B3B57] text-white space-y-2">
                    <div className="flex items-center space-x-2 text-[#FFB800]">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-wider">
                        Official Campaign Offer
                      </span>
                    </div>

                    <div className="text-xs font-bold text-gray-100">{msg.projectRef || 'Brand Deal'}</div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] text-gray-400">Guaranteed Escrow:</span>
                      <span className="text-base font-black text-[#10B981] font-mono">
                        K{msg.offerAmount || 500}
                      </span>
                    </div>

                    {msg.offerStatus === 'accepted' ? (
                      <div className="w-full py-1.5 bg-[#10B981]/20 text-[#10B981] font-bold text-center rounded-lg text-xs flex items-center justify-center space-x-1">
                        <CheckCheck className="w-4 h-4" />
                        <span>Contract Accepted & Funded!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAcceptOffer(msg.id, msg.offerAmount || 500)}
                        className="w-full py-2 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold rounded-lg text-xs shadow-md transition-all active:scale-95"
                      >
                        Accept & Lock in Escrow
                      </button>
                    )}
                  </div>
                )}

                <div
                  className={`text-[9px] flex items-center justify-end space-x-1 ${
                    isMe ? 'text-black/70' : 'text-gray-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-[#111623] border-t border-[#1E2638] flex items-center space-x-2"
      >
        <button
          type="button"
          onClick={() => setShowOfferModal(true)}
          className="w-9 h-9 rounded-xl bg-[#182030] text-gray-400 hover:text-[#FFB800] flex items-center justify-center border border-[#273650]"
          title="Send Offer"
        >
          <DollarSign className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message brand or creator..."
          className="flex-1 bg-[#182030] border border-[#2B3954] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
        />

        <button
          type="submit"
          disabled={sending || !inputMessage.trim()}
          className="w-9 h-9 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-black flex items-center justify-center shadow-md active:scale-95 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Custom Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-[#232D42] rounded-3xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl">
            <h3 className="font-bold text-sm text-white">Create Official Campaign Offer</h3>
            <p className="text-xs text-gray-400">Funds will be secured in Escrow until you approve video delivery.</p>

            <form onSubmit={handleSendCustomOffer} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0E14] border border-[#232D42] text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">Escrow Amount (Kwacha K)</label>
                <input
                  type="number"
                  required
                  min={50}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0E14] border border-[#232D42] text-white font-mono font-bold focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 py-2.5 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold rounded-xl"
                >
                  Send & Fund Offer
                </button>
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="py-2.5 px-4 bg-[#182030] text-gray-300 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
