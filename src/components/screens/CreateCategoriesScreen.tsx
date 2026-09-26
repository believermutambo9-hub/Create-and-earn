import React, { useState } from 'react';
import { Search, ChevronRight, Sparkles, Lightbulb, FileText, Clapperboard, Hash } from 'lucide-react';
import { CREATOR_CATEGORIES } from '../../data/mockData';
import { Screen } from '../../types';

interface CreateCategoriesScreenProps {
  onSelectCategory: (categoryName: string, targetTool?: Screen) => void;
  onNavigate: (screen: Screen) => void;
}

export const CreateCategoriesScreen: React.FC<CreateCategoriesScreenProps> = ({
  onSelectCategory,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatForAction, setSelectedCatForAction] = useState<string | null>(null);

  const filteredCategories = CREATOR_CATEGORIES.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-24">
      {/* Header Title */}
      <div>
        <div className="inline-flex items-center space-x-1 text-[#FFB800] text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CONTENT CATEGORIES</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          What do you want to create?
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Select a creative genre to ignite viral AI scripts, ideas, and scenes.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories (e.g. Comedy, Village, Dating, Afrobeat)..."
          className="w-full bg-[#131A27] border border-[#222E42] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800] transition-colors"
        />
      </div>

      {/* Categories List (Matching frame 3 in reference image) */}
      <div className="space-y-2.5">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setSelectedCatForAction(cat.title)}
            className="p-3.5 rounded-2xl bg-[#131A27] border border-[#202B3F] hover:border-[#FFB800]/50 cursor-pointer flex items-center justify-between space-x-3 transition-all group shadow-sm active:scale-98"
          >
            <div className="flex items-center space-x-3.5">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform`}
              >
                <span>{cat.emoji}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#FFB800] transition-colors">
                  {cat.title}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                  {cat.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cat.subcategories.slice(0, 3).map((sub, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-[#1A2234] text-gray-300 px-1.5 py-0.5 rounded border border-[#293750]"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#FFB800] group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        ))}
      </div>

      {/* Action Dialog when a category is tapped */}
      {selectedCatForAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#121824] border border-[#24314A] rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider">
                  Select Tool for
                </span>
                <h3 className="text-lg font-black text-white">{selectedCatForAction}</h3>
              </div>
              <button
                onClick={() => setSelectedCatForAction(null)}
                className="w-7 h-7 rounded-full bg-[#1A2234] text-gray-400 hover:text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Where would you like to start your creative process with this category?
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelectCategory(selectedCatForAction, 'idea-generator');
                  setSelectedCatForAction(null);
                }}
                className="w-full p-3 rounded-xl bg-[#1A2234] hover:bg-[#8B5CF6]/20 border border-[#283652] hover:border-[#8B5CF6] text-left flex items-center space-x-3 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/20 text-[#A78BFA] flex items-center justify-center">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Generate Idea</h5>
                  <p className="text-[10px] text-gray-400">Premise, hook, punchline & concept</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onSelectCategory(selectedCatForAction, 'script-generator');
                  setSelectedCatForAction(null);
                }}
                className="w-full p-3 rounded-xl bg-[#1A2234] hover:bg-[#3B82F6]/20 border border-[#283652] hover:border-[#3B82F6] text-left flex items-center space-x-3 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/20 text-[#60A5FA] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Generate Full Script</h5>
                  <p className="text-[10px] text-gray-400">Complete screenplay with dialogue & cues</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onSelectCategory(selectedCatForAction, 'scene-generator');
                  setSelectedCatForAction(null);
                }}
                className="w-full p-3 rounded-xl bg-[#1A2234] hover:bg-[#10B981]/20 border border-[#283652] hover:border-[#10B981] text-left flex items-center space-x-3 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#10B981]/20 text-[#34D399] flex items-center justify-center">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Director's Scene Plan</h5>
                  <p className="text-[10px] text-gray-400">Shot list, camera movements, lighting & acting</p>
                </div>
              </button>

              <button
                onClick={() => {
                  onSelectCategory(selectedCatForAction, 'caption-generator');
                  setSelectedCatForAction(null);
                }}
                className="w-full p-3 rounded-xl bg-[#1A2234] hover:bg-[#EC4899]/20 border border-[#283652] hover:border-[#EC4899] text-left flex items-center space-x-3 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-[#EC4899]/20 text-[#F472B6] flex items-center justify-center">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Captions & Hashtags</h5>
                  <p className="text-[10px] text-gray-400">TikTok, Reels & Facebook viral copy</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
