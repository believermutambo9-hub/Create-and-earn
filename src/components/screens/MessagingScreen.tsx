import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  Briefcase, 
  CheckCheck, 
  ArrowLeft, 
  CheckCircle2, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import { Message, CreatorProfile } from '../../types';

interface MessagingScreenProps {
  user: CreatorProfile;
  onBack: () => void;
  onAcceptOffer?: (amount: number) => void;
}

export const MessagingScreen: React.FC<MessagingScreenProps> = ({
  user,
  onBack,
  onAcceptOffer,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      senderId: 'b-101',
      senderName: 'Hungry Lion Brand Lead',
      senderAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      receiverId: user.id,
      text: 'Hi Ace! We loved your "Just a Like" concept and your audience engagement in Lusaka. We would love for you to lead our new 8-piece Spicy Wing campaign.',
      timestamp: '10:14 AM',
      isRead: true,
    },
    {
      id: 'm-2',
      senderId: 'b-101',
      senderName: 'Hungry Lion Brand Lead',
      senderAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      receiverId: user.id,
      text: 'Here is an official campaign contract offer:',
      timestamp: '10:15 AM',
      isOffer: true,
      offerAmount: 500,
      projectRef: 'Campaign: Funny Restaurant Skit',
      isRead: true,
    },
    {
      id: 'm-3',
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverId: 'b-101',
      text: 'Hello team! That sounds incredible. I have already generated the scene-by-scene script with camera shots on CREATE & EARN. We can start filming tomorrow!',
      timestamp: '10:22 AM',
      isRead: true,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [offerAccepted, setOfferAccepted] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverId: 'b-101',
      text: inputMessage,
      timestamp: 'Just now',
      isRead: true,
    };

    setMessages([...messages, newMsg]);
    setInputMessage('');

    // Simulated reply
    setTimeout(() => {
      const reply: Message = {
        id: `m-reply-${Date.now()}`,
        senderId: 'b-101',
        senderName: 'Hungry Lion Brand Lead',
        senderAvatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
        receiverId: user.id,
        text: 'Awesome! Once the video is uploaded, our escrow system will instantly deposit the K500 to your Available Balance.',
        timestamp: 'Just now',
        isRead: true,
      };
      setMessages((prev) => [...prev, reply]);
    }, 1200);
  };

  const handleAcceptContract = (amount: number) => {
    setOfferAccepted(true);
    if (onAcceptOffer) {
      onAcceptOffer(amount);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0E14] pb-24">
      {/* Messaging Header */}
      <div className="p-3 bg-[#111623] border-b border-[#1E2638] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80"
              alt="Hungry Lion"
              className="w-10 h-10 rounded-full object-cover border border-[#2B3954]"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-[#111623]"></span>
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1">
              <span>Hungry Lion Lusaka</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3B82F6]" />
            </h3>
            <p className="text-[10px] text-gray-400">Verified Brand • Active Deal in Escrow</p>
          </div>
        </div>

        <span className="text-[11px] font-black text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
          K500 Deal
        </span>
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

                    <div className="text-xs font-bold">{msg.projectRef}</div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] text-gray-400">Contract Value:</span>
                      <span className="text-base font-black text-[#10B981] font-mono">
                        K{msg.offerAmount}
                      </span>
                    </div>

                    {offerAccepted ? (
                      <div className="w-full py-1.5 bg-[#10B981]/20 text-[#10B981] font-bold text-center rounded-lg text-xs flex items-center justify-center space-x-1">
                        <CheckCheck className="w-4 h-4" />
                        <span>Contract Accepted & Funded!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAcceptContract(msg.offerAmount || 500)}
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
          onClick={() => alert('Attach project script or video storyboard.')}
          className="w-9 h-9 rounded-xl bg-[#182030] text-gray-400 hover:text-white flex items-center justify-center border border-[#273650]"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Message Hungry Lion Lusaka..."
          className="flex-1 bg-[#182030] border border-[#2B3954] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]"
        />

        <button
          type="submit"
          className="w-9 h-9 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-black flex items-center justify-center shadow-md active:scale-95 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
