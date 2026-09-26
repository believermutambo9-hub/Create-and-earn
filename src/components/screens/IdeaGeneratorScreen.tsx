import React, { useState } from 'react';
import { Sparkles, Copy, Check, Bookmark, ArrowRight, RotateCw, Edit3, Flame, Clock, MapPin, Users } from 'lucide-react';
import { generateIdeaAPI } from '../../services/aiService';
import { Project } from '../../types';

interface IdeaGeneratorScreenProps {
  initialCategory?: string;
  onSaveToProjects: (project: Partial<Project>) => void;
  onCreateScriptWithIdea: (ideaData: any) => void;
}

export const IdeaGeneratorScreen: React.FC<IdeaGeneratorScreenProps> = ({
  initialCategory = 'Couple Comedy',
  onSaveToProjects,
  onCreateScriptWithIdea,
}) => {
  const [category, setCategory] = useState(initialCategory);
  const [prompt, setPrompt] = useState('My girlfriend catches me liking another girl\'s photo at 2 AM');
  const [tone, setTone] = useState('Relatable African Comedy');
  const [duration, setDuration] = useState('45 seconds');
  const [language, setLanguage] = useState('English & Zambian Slang');
  const [audience, setAudience] = useState('Couples & Young Adults');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Generated idea result
  const [generatedIdea, setGeneratedIdea] = useState<any>({
    title: 'Just a Like',
    category: 'Couple Comedy',
    concept: 'You\'re caught liking another girl\'s photo by your girlfriend. What happens next will have you crying... with laughter!',
    hook: '"Babe, whose finger tapped that heart icon?" A peaceful night transforms into a high-stakes court interrogation.',
    characters: ['Boyfriend (Bwembya)', 'Girlfriend (Mwaka)', 'The Phone (Siri/notification)'],
    location: 'Dimly lit bedroom in Lusaka',
    punchline: 'Girlfriend: "You unliked it in 0.3 seconds? That means you were thinking about what you did!"',
    suggestedDuration: '45 seconds',
    audience: 'Couples, young adults',
    tone: 'Hilarious & Relatable',
    viralScore: '9.8/10'
  });

  const categoriesList = [
    'Couple Comedy',
    'Boyfriend vs Girlfriend',
    'Village vs Town',
    'Workplace Comedy',
    'Family Comedy',
    'Love & Romance',
    'Zambian Comedy 🇿🇲',
    'Brand & Restaurant Advertisement',
    'Marketplace Bargaining',
    'Student Life'
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const result = await generateIdeaAPI({
        category,
        prompt,
        tone,
        duration,
        audience,
        language
      });
      if (result) {
        setGeneratedIdea(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedIdea) return;
    const textToCopy = `Title: ${generatedIdea.title}\nCategory: ${generatedIdea.category}\nConcept: ${generatedIdea.concept}\nHook: ${generatedIdea.hook}\nPunchline: ${generatedIdea.punchline}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!generatedIdea) return;
    onSaveToProjects({
      title: generatedIdea.title,
      type: 'idea',
      category: generatedIdea.category || category,
      summary: generatedIdea.concept,
      content: generatedIdea,
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
          <span>AI IDEA GENERATOR</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Create an Idea
        </h2>
        <p className="text-xs text-gray-400">
          Transform a simple premise into an unstoppable viral concept.
        </p>
      </div>

      {/* Input Form matching frame 4 */}
      <div className="space-y-3.5 bg-[#121824] p-4 rounded-3xl border border-[#212C41] shadow-lg">
        {/* Category selector */}
        <div>
          <label className="text-xs font-bold text-gray-300 block mb-1.5">
            Select a category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFB800] transition-colors"
          >
            {categoriesList.map((c) => (
              <option key={c} value={c} className="bg-[#121824] text-white">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Premise input */}
        <div>
          <label className="text-xs font-bold text-gray-300 block mb-1.5">
            Add a short idea or situation (optional)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="e.g. My girlfriend catches me liking another girl's photo..."
            className="w-full bg-[#182030] border border-[#2B3954] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800] transition-colors resize-none"
          />
        </div>

        {/* Options Row: Duration & Tone */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#182030] border border-[#2B3954] rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#FFB800]"
            >
              <option value="30 seconds">30 seconds</option>
              <option value="45 seconds">45 seconds</option>
              <option value="60 seconds">60 seconds</option>
              <option value="3 minutes">3 minutes</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-[#182030] border border-[#2B3954] rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-[#FFB800]"
            >
              <option value="Relatable African Comedy">Relatable Comedy</option>
              <option value="Satirical & Witty">Satirical & Witty</option>
              <option value="Dramatic Soap Twist">Dramatic Twist</option>
              <option value="High Energy Commercial">Brand Commercial</option>
            </select>
          </div>
        </div>

        {/* Generate Button (Bright yellow) */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-black" />
              <span>Generating Viral Concept...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span className="tracking-wide">GENERATE IDEA</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Idea Result Card matching frame 4 */}
      {generatedIdea && (
        <div className="bg-[#121824] rounded-3xl border border-[#24314A] p-4 sm:p-5 space-y-4 shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1C263B] pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]"></span>
              <span className="text-xs font-black tracking-wider uppercase text-gray-300">
                Generated Idea
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-[#182030] text-gray-300 hover:text-white border border-[#2B3852] text-xs flex items-center space-x-1 transition-all"
                title="Copy Idea"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Title & Viral Score */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider">
                Title
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                "{generatedIdea.title}"
              </h3>
            </div>
            {generatedIdea.viralScore && (
              <div className="bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] px-2 py-0.5 rounded-full text-[10px] font-black flex items-center space-x-1 shrink-0">
                <Flame className="w-3 h-3" />
                <span>Viral {generatedIdea.viralScore}</span>
              </div>
            )}
          </div>

          {/* Situation / Concept */}
          <div className="bg-[#161E2E] p-3 rounded-2xl border border-[#212E47]">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Situation / Concept
            </span>
            <p className="text-xs text-gray-200 leading-relaxed">
              {generatedIdea.concept}
            </p>
          </div>

          {/* Hook */}
          {generatedIdea.hook && (
            <div className="bg-[#FFB800]/10 p-3 rounded-2xl border border-[#FFB800]/30">
              <span className="text-[10px] font-black text-[#FFB800] uppercase tracking-wider block mb-1">
                Opening Hook (First 3 Seconds)
              </span>
              <p className="text-xs text-amber-200 italic font-medium">
                {generatedIdea.hook}
              </p>
            </div>
          )}

          {/* Details Grid: Characters, Location, Punchline */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start space-x-2 text-gray-300">
              <Users className="w-3.5 h-3.5 text-[#60A5FA] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Characters: </strong>
                <span>
                  {Array.isArray(generatedIdea.characters)
                    ? generatedIdea.characters.join(', ')
                    : generatedIdea.characters}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-[#34D399] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Location: </strong>
                <span>{generatedIdea.location}</span>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-gray-300">
              <Clock className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Suggested Duration: </strong>
                <span>{generatedIdea.suggestedDuration || duration}</span>
              </div>
            </div>
          </div>

          {/* Climax / Punchline */}
          {generatedIdea.punchline && (
            <div className="bg-[#182030] p-3 rounded-2xl border border-[#2A3750]">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block mb-1">
                Climax Punchline
              </span>
              <p className="text-xs font-semibold text-white">
                {generatedIdea.punchline}
              </p>
            </div>
          )}

          {/* Buttons: Save, Generate Again, Create Script */}
          <div className="pt-2 border-t border-[#1C263B] flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all border ${
                saved
                  ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
                  : 'bg-[#182030] border-[#2A3750] text-gray-200 hover:text-white hover:border-gray-500'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{saved ? 'Saved in Projects' : 'Save'}</span>
            </button>

            <button
              onClick={handleGenerate}
              className="py-2.5 px-3 rounded-xl bg-[#182030] border border-[#2A3750] text-gray-300 hover:text-white font-bold text-xs flex items-center space-x-1.5 hover:border-gray-500 transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>

            <button
              onClick={() => onCreateScriptWithIdea(generatedIdea)}
              className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <span>Create Script</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
