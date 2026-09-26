import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  Bookmark, 
  RotateCw, 
  Hash, 
  MessageSquare, 
  Flame, 
  ThumbsUp, 
  Tag 
} from 'lucide-react';
import { generateCaptionsAPI } from '../../services/aiService';
import { Project } from '../../types';

interface CaptionGeneratorScreenProps {
  initialDescription?: string;
  onSaveProject: (project: Partial<Project>) => void;
}

export const CaptionGeneratorScreen: React.FC<CaptionGeneratorScreenProps> = ({
  initialDescription = '',
  onSaveProject,
}) => {
  const [activePlatform, setActivePlatform] = useState<'TikTok / Reels' | 'Facebook' | 'Instagram'>('TikTok / Reels');
  const [description, setDescription] = useState(
    initialDescription || 'A funny skit about a boyfriend getting caught double-tapping an Instagram photo at 2 AM.'
  );
  const [loading, setLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [selectedCaptionType, setSelectedCaptionType] = useState<'funny' | 'short' | 'engagement' | 'professional'>('funny');

  // Captions data
  const [captionData, setCaptionData] = useState({
    shortCaption: 'When a 0.1-second double tap turns into a 3-hour trial. 😭💀 #JustALike',
    funnyCaption: 'When you like a photo and think it\'s just a like... but she sees it differently! 😂💔 Tag your partner who overthinks everything! 👇',
    professionalCaption: 'Behind every viral skit is real pain! Excited to share our new comedy short created with CREATE & EARN.',
    engagementCaption: 'Drop an emoji if your partner has ever caught you liking a photo from 2019! Who was in the wrong here? Tag them below! 👇😂',
    hashtags: [
      '#Comedy',
      '#RelationshipGoals',
      '#CoupleComedy',
      '#AfricanComedy',
      '#ZambianComedy',
      '#JustALike',
      '#FunnyVideos',
      '#LoveAndLaughs'
    ]
  });

  const handleGenerate = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await generateCaptionsAPI({
        description,
        platform: activePlatform,
        category: 'Comedy'
      });
      if (res) {
        setCaptionData(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getActiveCaptionText = () => {
    switch (selectedCaptionType) {
      case 'funny': return captionData.funnyCaption;
      case 'short': return captionData.shortCaption;
      case 'engagement': return captionData.engagementCaption;
      case 'professional': return captionData.professionalCaption;
      default: return captionData.funnyCaption;
    }
  };

  const handleCopyAll = () => {
    const fullText = `${getActiveCaptionText()}\n\n${captionData.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedType('all');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleShare = () => {
    const fullText = `${getActiveCaptionText()}\n\n${captionData.hashtags.join(' ')}`;
    if (navigator.share) {
      navigator.share({
        title: 'Video Caption & Hashtags',
        text: fullText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(fullText);
      alert('Copied to clipboard for Instagram/TikTok!');
    }
  };

  const handleSave = () => {
    onSaveProject({
      title: `Caption: ${description.slice(0, 24)}...`,
      type: 'caption',
      category: activePlatform,
      summary: getActiveCaptionText(),
      content: { ...captionData, platform: activePlatform },
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      status: 'Ready'
    });
    setSaved(true);
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 pb-24">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-1 text-[#FFB800] text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VIRAL COPYWRITING</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Caption & Hashtags
        </h2>
        <p className="text-xs text-gray-400">
          Generate irresistible hooks and viral hashtag clusters for maximum reach.
        </p>
      </div>

      {/* Platform Selector Tabs matching frame 7 */}
      <div className="bg-[#121824] p-1.5 rounded-2xl border border-[#222E42] flex items-center space-x-1">
        {(['TikTok / Reels', 'Facebook', 'Instagram'] as const).map((plat) => (
          <button
            key={plat}
            onClick={() => setActivePlatform(plat)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === plat
                ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {plat}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="bg-[#121824] p-4 rounded-3xl border border-[#222E42] space-y-3 shadow-lg">
        <label className="text-xs font-bold text-gray-300 block">
          Describe your video or topic
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="e.g. Couple comedy where boyfriend tries to defend double tapping an ex classmate's photo..."
          className="w-full bg-[#182030] border border-[#2B3954] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800] transition-colors resize-none"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 px-4 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-black" />
              <span>Generating Viral Captions...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>Generate Captions & Tags</span>
            </>
          )}
        </button>
      </div>

      {/* Caption Tone Picker Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'funny', label: '😂 Funny & Relatable' },
          { id: 'short', label: '⚡ Punchy & Short' },
          { id: 'engagement', label: '🔥 Call-to-Action' },
          { id: 'professional', label: '💼 Brand / Clean' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedCaptionType(item.id as any)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
              selectedCaptionType === item.id
                ? 'bg-[#1E293E] text-[#FFB800] border-[#FFB800]/50'
                : 'bg-[#121824] text-gray-400 border-[#202C40] hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Generated Caption Box matching frame 7 */}
      <div className="bg-[#121824] rounded-3xl border border-[#24314A] p-4 sm:p-5 space-y-4 shadow-xl">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Generated Caption
            </span>
            <span className="text-[10px] text-[#10B981] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
              High Virality Score
            </span>
          </div>

          <div className="bg-[#182132] p-4 rounded-2xl border border-[#273650] text-xs text-white leading-relaxed font-medium">
            {getActiveCaptionText()}
          </div>
        </div>

        {/* Suggested Hashtags matching frame 7 */}
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Suggested Hashtags
          </span>

          <div className="flex flex-wrap gap-1.5">
            {captionData.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#1A2335] text-[#60A5FA] border border-[#293854] px-2.5 py-1 rounded-xl text-[11px] font-semibold hover:border-[#60A5FA] transition-colors cursor-pointer select-all"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons matching frame 7 */}
        <div className="pt-2 border-t border-[#1C2538] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyAll}
              className="py-3 px-3 rounded-xl bg-[#161D2B] hover:bg-[#1E273A] text-gray-200 hover:text-white font-bold text-xs flex items-center justify-center space-x-1.5 border border-[#26344D] transition-all"
            >
              {copiedType === 'all' ? (
                <Check className="w-4 h-4 text-[#10B981]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copiedType === 'all' ? 'Copied All!' : 'Copy All'}</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3 px-3 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/25 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 border transition-all ${
              saved
                ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                : 'bg-[#131A27] border-[#202B3E] text-gray-300 hover:text-white'
            }`}
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved in Projects' : 'Save Caption to Projects'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
