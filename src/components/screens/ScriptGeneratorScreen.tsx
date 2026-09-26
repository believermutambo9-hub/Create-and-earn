import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  ArrowRight, 
  RotateCw, 
  Clock, 
  Film, 
  Users, 
  Clapperboard, 
  MapPin, 
  Smile, 
  Volume2,
  Video
} from 'lucide-react';
import { generateScriptAPI } from '../../services/aiService';
import { ScriptData, Project } from '../../types';

interface ScriptGeneratorScreenProps {
  initialIdea?: any;
  onSaveProject: (project: Partial<Project>) => void;
  onGenerateScenes: (script: ScriptData) => void;
}

export const ScriptGeneratorScreen: React.FC<ScriptGeneratorScreenProps> = ({
  initialIdea,
  onSaveProject,
  onGenerateScenes,
}) => {
  const [duration, setDuration] = useState('60 seconds');
  const [genre, setGenre] = useState('Comedy');
  const [title, setTitle] = useState(initialIdea?.title || 'Just a Like');
  const [ideaSummary, setIdeaSummary] = useState(
    initialIdea?.concept || 'A boyfriend accidentally likes another girl\'s photo at 2 AM right next to his girlfriend.'
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Script Data State
  const [scriptData, setScriptData] = useState<ScriptData>({
    title: initialIdea?.title || 'Just a Like',
    genre: 'Couple Comedy',
    duration: '60 seconds',
    characters: ['Boyfriend (Bwembya)', 'Girlfriend (Mwaka)', 'The Other Girl (Photo cameo)'],
    location: 'Dimly lit bedroom in Lusaka',
    openingHook: 'Boyfriend smiles peacefully at his phone in bed, double taps, then freezes as a sharp glare slices through the dark.',
    scenes: [
      {
        sceneNumber: 1,
        heading: 'SCENE 01: THE INCRIMINATING DOUBLE-TAP',
        location: 'Bedroom - Night',
        duration: '10s',
        action: 'Boyfriend is lying on pillow, phone glow illuminating his smiling face. Taps heart icon.',
        dialogue: 'Boyfriend: (Soft chuckle) "Heh, what a nice vacation photo..." *GASPS IN TERROR*',
        expression: 'From pure innocence to sheer panic in 0.5 seconds',
        cameraCue: 'Tight close-up on phone screen reflection in eyes'
      },
      {
        sceneNumber: 2,
        heading: 'SCENE 02: THE GHOST IN THE DUVET',
        location: 'Bedroom - Continuous',
        duration: '15s',
        action: 'Girlfriend turns around silently like an animatronic security camera.',
        dialogue: 'Girlfriend: "Who is that you are smiling with in my presence at 2:14 AM, Bwembya?"',
        expression: 'Unforgiving detective stare, unblinking',
        cameraCue: 'Slow creeping push-in over boyfriend\'s shoulder'
      },
      {
        sceneNumber: 3,
        heading: 'SCENE 03: THE WORST DEFENSE IN LEGAL HISTORY',
        location: 'Bedroom - Bedside',
        duration: '20s',
        action: 'Boyfriend tries to slide phone under mattress; girlfriend holds up his unlocked tablet with screen mirroring.',
        dialogue: 'Boyfriend: "It\'s not what you think! My thumb had a sudden involuntary muscle spasm!"\nGirlfriend: "And your muscle spasm specifically found her beach photo from 2021?"',
        expression: 'Profuse sweating, stuttering, deer in headlights',
        cameraCue: 'Rapid whip-pan back and forth between speakers'
      },
      {
        sceneNumber: 4,
        heading: 'SCENE 04: THE PUNCHLINE & CLIMAX',
        location: 'Balcony Door',
        duration: '15s',
        action: 'Girlfriend points towards the balcony door with a folded duvet.',
        dialogue: 'Girlfriend: "So you like her, but you can\'t even like my Sunday meals?"\nBoyfriend: *Drops phone onto bed* "But babe... it was just a like!"\nGirlfriend: "Court is adjourned. Explain your like to the mosquitoes outside."',
        expression: 'Girlfriend: Victorious smirk. Boyfriend: Absolute spiritual defeat.',
        cameraCue: 'Crash zoom onto boyfriend\'s face with comedy horn sound'
      }
    ],
    punchline: 'Girlfriend: "Unliking within 0.2 seconds means you premeditated the felony!"',
    ending: 'Dramatic soap-opera zoom on boyfriend standing on balcony holding a tiny throw pillow.'
  });

  const durationOptions = ['30 seconds', '60 seconds', '3 minutes', '5 minutes'];
  const genreOptions = ['Comedy', 'Drama', 'Romance', 'Advertisement', 'Short Film'];

  const handleGenerateScript = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await generateScriptAPI({
        title,
        category: genre,
        duration,
        genre,
        characters: 'Boyfriend, Girlfriend',
        idea: ideaSummary
      });
      if (res) {
        setScriptData(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!scriptData) return;
    const fullText = `TITLE: ${scriptData.title}\nGENRE: ${scriptData.genre} | DURATION: ${scriptData.duration}\n\nCHARACTERS: ${scriptData.characters.join(', ')}\nLOCATION: ${scriptData.location}\nHOOK: ${scriptData.openingHook}\n\n` +
      scriptData.scenes.map(s => `${s.heading}\nLocation: ${s.location} (${s.duration})\nAction: ${s.action}\nDialogue: ${s.dialogue}\nExpression: ${s.expression}\nCamera Cue: ${s.cameraCue}\n`).join('\n') +
      `\nPUNCHLINE: ${scriptData.punchline}\nENDING: ${scriptData.ending}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveProject({
      title: scriptData.title,
      type: 'script',
      category: scriptData.genre,
      summary: scriptData.openingHook || ideaSummary,
      content: scriptData,
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
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
          <span>FULL SCRIPT GENERATOR</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Create Your Script
        </h2>
        <p className="text-xs text-gray-400">
          Professional screenplay formatted scene-by-scene for mobile shooting.
        </p>
      </div>

      {/* Configuration Controls */}
      <div className="bg-[#121824] p-4 rounded-3xl border border-[#222E43] space-y-3.5 shadow-lg">
        {/* Title & Premise Input */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-400 block mb-1">Premise / Concept</label>
          <input
            type="text"
            value={ideaSummary}
            onChange={(e) => setIdeaSummary(e.target.value)}
            className="w-full bg-[#182030] border border-[#2B3954] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        {/* Duration Pills */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 block mb-1.5">
            Select Duration
          </label>
          <div className="flex flex-wrap gap-1.5">
            {durationOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setDuration(opt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  duration === opt
                    ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
                    : 'bg-[#182030] text-gray-300 hover:text-white border border-[#2B3852]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Pills */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 block mb-1.5">
            Select Genre
          </label>
          <div className="flex flex-wrap gap-1.5">
            {genreOptions.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  genre === g
                    ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20'
                    : 'bg-[#182030] text-gray-300 hover:text-white border border-[#2B3852]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateScript}
          disabled={loading}
          className="w-full py-3 px-4 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-50 mt-1"
        >
          {loading ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-black" />
              <span>Writing Screenplay & Dialogue...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>Generate Full Script</span>
            </>
          )}
        </button>
      </div>

      {/* Screenplay Content Presentation matching frame 5 */}
      {scriptData && (
        <div className="space-y-4">
          {/* Script Header Card */}
          <div className="bg-[#121824] rounded-3xl border border-[#222E43] p-4 sm:p-5 space-y-3 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider">
                  Screenplay Title
                </span>
                <h3 className="text-lg font-black text-white">{scriptData.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#EC4899]/20 text-[#F472B6] border border-[#EC4899]/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {scriptData.genre}
                </span>
                <span className="bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {scriptData.duration}
                </span>
              </div>
            </div>

            {/* Characters */}
            <div className="bg-[#161F2F] p-3 rounded-2xl border border-[#212E47]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Characters:
              </span>
              <ul className="text-xs text-gray-200 space-y-1">
                {scriptData.characters.map((char, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]"></span>
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opening Hook */}
            {scriptData.openingHook && (
              <div className="bg-[#FFB800]/10 p-3 rounded-2xl border border-[#FFB800]/30">
                <span className="text-[10px] font-black text-[#FFB800] uppercase tracking-wider block mb-1">
                  Opening Hook (0 - 3s)
                </span>
                <p className="text-xs text-amber-200 italic">
                  {scriptData.openingHook}
                </p>
              </div>
            )}
          </div>

          {/* Scenes Cards matching reference frame 5 */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 px-1">
              Script Scenes ({scriptData.scenes.length})
            </h4>

            {scriptData.scenes.map((scene) => (
              <div
                key={scene.sceneNumber}
                className="bg-[#121824] rounded-2xl border border-[#202C40] p-4 space-y-2.5 shadow-md relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-[#1A2335] pb-2">
                  <span className="text-xs font-black text-[#FFB800] tracking-wide">
                    {scene.heading || `SCENE 0${scene.sceneNumber}`}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 bg-[#1A2234] px-2 py-0.5 rounded border border-[#2B3852]">
                    ⏱️ {scene.duration}
                  </span>
                </div>

                {/* Action */}
                <div className="text-xs text-gray-300">
                  <strong className="text-white block text-[11px] uppercase tracking-wider text-gray-400 mb-0.5">
                    Action & Setting:
                  </strong>
                  <p className="italic bg-[#161D2B] p-2 rounded-xl border border-[#232F45]">
                    {scene.action}
                  </p>
                </div>

                {/* Dialogue */}
                <div className="text-xs">
                  <strong className="text-white block text-[11px] uppercase tracking-wider text-gray-400 mb-0.5">
                    Dialogue:
                  </strong>
                  <div className="bg-[#182132] p-2.5 rounded-xl border border-[#26354F] font-mono text-[11.5px] text-gray-100 whitespace-pre-line leading-relaxed">
                    {scene.dialogue}
                  </div>
                </div>

                {/* Expression & Camera cues */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="flex items-start space-x-1.5 text-gray-300 bg-[#151C2A] p-2 rounded-lg border border-[#222E42]">
                    <Smile className="w-3.5 h-3.5 text-[#EC4899] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-400 font-bold">Expression: </span>
                      <span>{scene.expression}</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-1.5 text-gray-300 bg-[#151C2A] p-2 rounded-lg border border-[#222E42]">
                    <Video className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-gray-400 font-bold">Camera Cue: </span>
                      <span>{scene.cameraCue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Climax Punchline & Ending */}
          <div className="bg-[#121824] rounded-2xl border border-[#222E43] p-4 space-y-2">
            <div className="text-xs">
              <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block mb-0.5">
                The Punchline:
              </span>
              <p className="font-bold text-white text-xs">{scriptData.punchline}</p>
            </div>
            <div className="text-xs pt-1 border-t border-[#1C2538]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Ending Cue:
              </span>
              <p className="text-gray-300 text-xs italic">{scriptData.ending}</p>
            </div>
          </div>

          {/* Bottom Action Buttons (Save Script & Create Scenes) */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleSave}
              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-98 ${
                saved
                  ? 'bg-[#10B981] text-black shadow-emerald-500/25'
                  : 'bg-[#FFB800] hover:bg-[#FFA500] text-black shadow-amber-500/25'
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4 fill-black" />}
              <span>{saved ? 'Script Saved in My Projects!' : 'Save Script'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                className="py-2.5 px-3 rounded-xl bg-[#141B28] hover:bg-[#1A2335] text-gray-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-1.5 border border-[#222E42] transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Full Script'}</span>
              </button>

              <button
                onClick={() => onGenerateScenes(scriptData)}
                className="py-2.5 px-3 rounded-xl bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#34D399] font-bold text-xs flex items-center justify-center space-x-1.5 border border-[#10B981]/40 transition-all"
              >
                <Clapperboard className="w-3.5 h-3.5" />
                <span>Create Scenes →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
