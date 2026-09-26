import React, { useState } from 'react';
import { 
  Clapperboard, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Camera, 
  Video, 
  Sun, 
  Volume2, 
  Smile, 
  UserCheck, 
  Download, 
  Share2, 
  Check, 
  RotateCw,
  Film
} from 'lucide-react';
import { generateScenesAPI } from '../../services/aiService';
import { SceneShot, ScriptData, Project } from '../../types';

interface SceneGeneratorScreenProps {
  initialScript?: ScriptData;
  onSaveProject: (project: Partial<Project>) => void;
}

export const SceneGeneratorScreen: React.FC<SceneGeneratorScreenProps> = ({
  initialScript,
  onSaveProject,
}) => {
  const [scriptTitle, setScriptTitle] = useState(initialScript?.title || 'Just a Like');
  const [loading, setLoading] = useState(false);
  const [expandedScene, setExpandedScene] = useState<number | null>(1);
  const [saved, setSaved] = useState(false);
  const [showFullPlanModal, setShowFullPlanModal] = useState(false);

  // Scene Shot List State matching frame 6
  const [scenes, setScenes] = useState<SceneShot[]>([
    {
      sceneNumber: 1,
      title: 'Scene 1: The Incriminating Tap',
      location: 'Bedroom - Soft Lamp Light',
      characters: 'Boyfriend (Bwembya)',
      dialogue: 'Boyfriend: (Whispering) "Just scrolling before dinner..." *double taps*',
      facialExpression: 'Playful grin turning instantly to sheer panic',
      bodyLanguage: 'Freezes stiff like a statue, finger stuck on glass',
      cameraShot: 'Medium close-up (Chest level)',
      cameraMovement: 'Smooth push-in 1.5x zoom',
      lighting: 'Warm ambient evening lamp + harsh cyan phone glow',
      soundSuggestion: 'Fast heartbeat sound effect (thump-thump)',
      estimatedDuration: '7 seconds'
    },
    {
      sceneNumber: 2,
      title: 'Scene 2: Shadow in the Doorway',
      location: 'Doorway & Bedside',
      characters: 'Girlfriend (Mwaka)',
      dialogue: 'Girlfriend: "Whose beauty are you appreciating with both thumbs?"',
      facialExpression: 'Deadpan detective smirk with raised eyebrow',
      bodyLanguage: 'Standing arms folded, weight shifted to one hip',
      cameraShot: 'Low angle intimidating medium shot',
      cameraMovement: 'Slow dramatic tilt up from slippers to eyes',
      lighting: 'Backlit from hallway creating halo silhouette',
      soundSuggestion: 'Dramatic suspense soap-opera violin sting',
      estimatedDuration: '10 seconds'
    },
    {
      sceneNumber: 3,
      title: 'Scene 3: The Interrogation',
      location: 'Bedside & Nightstand',
      characters: 'Boyfriend & Girlfriend',
      dialogue: 'Boyfriend: "My finger slipped on the glass! The screen protector has static electricity!"',
      facialExpression: 'Desperate sweating versus Sherlock Holmes composure',
      bodyLanguage: 'Boyfriend waving hands frantically trying to shield screen',
      cameraShot: 'Over-the-shoulder ping pong shot',
      cameraMovement: 'Rapid whip-pans back and forth',
      lighting: 'Full room light clicked on suddenly (harsh, high key)',
      soundSuggestion: 'Energetic fast tempo comedic marimba drums',
      estimatedDuration: '14 seconds'
    },
    {
      sceneNumber: 4,
      title: 'Scene 4: The Climax Punchline',
      location: 'Front Balcony Door',
      characters: 'Both',
      dialogue: 'Girlfriend: "Go explain your static electricity to the guard dog outside."\nBoyfriend: "Babe, it was just a like!"',
      facialExpression: 'Defeated disbelief, staring into emptiness',
      bodyLanguage: 'Slumping shoulders, hands on head in despair',
      cameraShot: 'Wide shot pulling backwards, crash zoom on locked door',
      cameraMovement: 'Static wide shot ending with door slam',
      lighting: 'Outdoor porch light casting long comedic shadows',
      soundSuggestion: 'Slide whistle down + viral audience laughter',
      estimatedDuration: '9 seconds'
    }
  ]);

  // Thumbnails for scenes matching frame 6
  const sceneThumbnails = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
  ];

  const handleRegenerateScenes = async () => {
    setLoading(true);
    try {
      const res = await generateScenesAPI({
        scriptTitle,
        scriptContent: initialScript?.openingHook || 'Comedy confrontation between couple'
      });
      if (res && Array.isArray(res) && res.length > 0) {
        setScenes(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = () => {
    onSaveProject({
      title: `${scriptTitle} (Director Shot List)`,
      type: 'scene',
      category: 'Director Plan',
      summary: `${scenes.length} camera shots planned with cues, durations & lighting.`,
      content: scenes,
      thumbnail: sceneThumbnails[0],
      status: 'Ready'
    });
    setSaved(true);
  };

  const totalDuration = scenes.reduce((acc, curr) => {
    const num = parseInt(curr.estimatedDuration, 10) || 10;
    return acc + num;
  }, 0);

  return (
    <div className="flex-1 flex flex-col p-4 space-y-5 pb-24">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-1 text-[#FFB800] text-xs font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRODUCTION DIRECTOR</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Scene-by-Scene Generator
        </h2>
        <p className="text-xs text-gray-400">
          Turn your script into an actionable, filmable mobile video plan.
        </p>
      </div>

      {/* Script Selection Bar */}
      <div className="bg-[#121824] p-3.5 rounded-2xl border border-[#212C41] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            Target Script:
          </span>
          <h3 className="text-sm font-black text-white">{scriptTitle}</h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
            ~{totalDuration}s Total
          </span>
          <button
            onClick={handleRegenerateScenes}
            disabled={loading}
            className="p-2 rounded-xl bg-[#182030] text-gray-300 hover:text-white border border-[#2B3954] transition-all"
            title="Regenerate Scenes"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FFB800]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Scene list matching frame 6 in mockup */}
      <div className="space-y-3">
        {scenes.map((scene, idx) => {
          const isExpanded = expandedScene === scene.sceneNumber;
          const thumbnail = sceneThumbnails[idx % sceneThumbnails.length];

          return (
            <div
              key={scene.sceneNumber}
              className="bg-[#121824] rounded-2xl border border-[#202C40] overflow-hidden transition-all shadow-md"
            >
              {/* Scene Card Header (Collapsible) */}
              <div
                onClick={() => setExpandedScene(isExpanded ? null : scene.sceneNumber)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#161F2F] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {/* Thumbnail matching screenshot */}
                  <img
                    src={thumbnail}
                    alt={scene.title}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs sm:text-sm font-black text-white">
                        Scene {scene.sceneNumber}
                      </h4>
                      <span className="text-[10px] font-bold text-gray-400">
                        ({scene.estimatedDuration})
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5 font-medium">
                      {scene.dialogue || scene.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-gray-400 font-bold hidden sm:inline">
                    {scene.cameraShot}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#FFB800]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Detailed Director Specs */}
              {isExpanded && (
                <div className="p-4 pt-1 bg-[#0E131E] border-t border-[#1C2538] space-y-3 text-xs">
                  {/* Location & Characters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-[#151C2A] p-2.5 rounded-xl border border-[#222E42]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                        Location:
                      </span>
                      <p className="text-white font-semibold">{scene.location}</p>
                    </div>

                    <div className="bg-[#151C2A] p-2.5 rounded-xl border border-[#222E42]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                        Characters on Screen:
                      </span>
                      <p className="text-white font-semibold">{scene.characters}</p>
                    </div>
                  </div>

                  {/* Dialogue & Delivery */}
                  <div className="bg-[#161F30] p-3 rounded-xl border border-[#23314B]">
                    <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider block mb-1">
                      Script Dialogue:
                    </span>
                    <p className="font-mono text-xs text-gray-100 whitespace-pre-line leading-relaxed">
                      {scene.dialogue}
                    </p>
                  </div>

                  {/* Acting Cues: Facial Expression & Body Language */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-[#151C2A] p-2.5 rounded-xl border border-[#222E42] flex items-start space-x-2">
                      <Smile className="w-4 h-4 text-[#EC4899] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Facial Expression:
                        </span>
                        <p className="text-gray-200">{scene.facialExpression}</p>
                      </div>
                    </div>

                    <div className="bg-[#151C2A] p-2.5 rounded-xl border border-[#222E42] flex items-start space-x-2">
                      <UserCheck className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Body Language:
                        </span>
                        <p className="text-gray-200">{scene.bodyLanguage}</p>
                      </div>
                    </div>
                  </div>

                  {/* Camera & Lighting Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="bg-[#151C2A] p-2 rounded-xl border border-[#222E42]">
                      <div className="flex items-center space-x-1 text-gray-400 text-[10px] font-bold mb-0.5">
                        <Camera className="w-3 h-3 text-[#3B82F6]" />
                        <span>Camera Shot</span>
                      </div>
                      <p className="text-white text-[11px] font-bold">{scene.cameraShot}</p>
                    </div>

                    <div className="bg-[#151C2A] p-2 rounded-xl border border-[#222E42]">
                      <div className="flex items-center space-x-1 text-gray-400 text-[10px] font-bold mb-0.5">
                        <Video className="w-3 h-3 text-[#A855F7]" />
                        <span>Movement</span>
                      </div>
                      <p className="text-white text-[11px] font-bold">{scene.cameraMovement}</p>
                    </div>

                    <div className="bg-[#151C2A] p-2 rounded-xl border border-[#222E42] col-span-2 sm:col-span-1">
                      <div className="flex items-center space-x-1 text-gray-400 text-[10px] font-bold mb-0.5">
                        <Sun className="w-3 h-3 text-[#F59E0B]" />
                        <span>Lighting</span>
                      </div>
                      <p className="text-white text-[11px] font-bold line-clamp-1">{scene.lighting}</p>
                    </div>
                  </div>

                  {/* Sound Suggestion */}
                  <div className="bg-[#151C2A] p-2.5 rounded-xl border border-[#222E42] flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-[#F43F5E] shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Sound / Foley Suggestion:
                      </span>
                      <p className="text-xs text-gray-200 font-medium">{scene.soundSuggestion}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Main Button matching frame 6 ("View Full Video Plan") */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => setShowFullPlanModal(true)}
          className="w-full py-4 px-6 bg-[#FFB800] hover:bg-[#FFA500] text-black font-black text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 active:scale-98 transition-all"
        >
          <Film className="w-5 h-5 fill-black" />
          <span>View Full Video Plan</span>
        </button>

        <button
          onClick={handleSavePlan}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all border ${
            saved
              ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]'
              : 'bg-[#131A27] border-[#222E42] text-gray-300 hover:text-white'
          }`}
        >
          {saved ? <Check className="w-4 h-4" /> : <Clapperboard className="w-4 h-4" />}
          <span>{saved ? 'Shot List Saved to Projects' : 'Save Shot List'}</span>
        </button>
      </div>

      {/* Modal: Full Video Plan Overview */}
      {showFullPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111723] border border-[#23314B] rounded-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1C2538] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#FFB800] uppercase tracking-wider">
                  DIRECTOR PRODUCTION SHEET
                </span>
                <h3 className="text-base font-black text-white">{scriptTitle}</h3>
              </div>
              <button
                onClick={() => setShowFullPlanModal(false)}
                className="w-8 h-8 rounded-full bg-[#182030] text-gray-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 rounded-xl bg-[#161E2E] border border-[#212E46] flex items-center justify-between">
                <span>Total Shooting Time</span>
                <strong className="text-[#FFB800] font-black">{totalDuration} seconds</strong>
              </div>

              <div className="p-3 rounded-xl bg-[#161E2E] border border-[#212E46] flex items-center justify-between">
                <span>Number of Camera Setups</span>
                <strong className="text-white font-bold">{scenes.length} angles</strong>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-gray-300 uppercase tracking-wider text-[11px]">
                  Production Schedule Sequence:
                </h5>
                {scenes.map((s) => (
                  <div key={s.sceneNumber} className="p-2.5 rounded-lg bg-[#141B28] border border-[#202B3E]">
                    <div className="flex justify-between font-bold text-white text-[11px]">
                      <span>{s.title}</span>
                      <span className="text-[#FFB800]">{s.estimatedDuration}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Cam: {s.cameraShot} • Lighting: {s.lighting}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-2 border-t border-[#1C2538]">
              <button
                onClick={() => {
                  alert('Video plan exported to your device storage & WhatsApp clipboard!');
                  setShowFullPlanModal(false);
                }}
                className="flex-1 py-2.5 bg-[#FFB800] text-black font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Director PDF</span>
              </button>
              <button
                onClick={() => setShowFullPlanModal(false)}
                className="py-2.5 px-4 bg-[#182030] text-gray-300 hover:text-white font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
