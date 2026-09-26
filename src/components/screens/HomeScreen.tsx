import React from 'react';
import { 
  Lightbulb, 
  FileText, 
  Clapperboard, 
  Hash, 
  FolderKanban, 
  LayoutGrid, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Briefcase,
  Heart,
  Users,
  Home as HomeIcon,
  Building,
  Flame
} from 'lucide-react';
import { Screen, CreatorProfile, Project, Opportunity } from '../../types';

interface HomeScreenProps {
  user: CreatorProfile;
  projects: Project[];
  opportunities: Opportunity[];
  onNavigate: (screen: Screen) => void;
  onSelectProject: (project: Project) => void;
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onQuickCategory: (category: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  projects,
  opportunities,
  onNavigate,
  onSelectProject,
  onSelectOpportunity,
  onQuickCategory,
}) => {
  // Quick Actions matching the 6 icons in reference image
  const quickActions = [
    {
      id: 'idea-generator' as Screen,
      title: 'Idea Generator',
      subtitle: '💡 Create an Idea',
      icon: Lightbulb,
      bgColor: 'bg-[#8B5CF6]/20',
      iconColor: 'text-[#A78BFA]',
      borderColor: 'border-[#8B5CF6]/30',
      badgeColor: 'bg-[#8B5CF6]',
    },
    {
      id: 'script-generator' as Screen,
      title: 'Full Script',
      subtitle: '📝 Create a Script',
      icon: FileText,
      bgColor: 'bg-[#3B82F6]/20',
      iconColor: 'text-[#60A5FA]',
      borderColor: 'border-[#3B82F6]/30',
      badgeColor: 'bg-[#3B82F6]',
    },
    {
      id: 'scene-generator' as Screen,
      title: 'Scene Generator',
      subtitle: '🎬 Create Scenes',
      icon: Clapperboard,
      bgColor: 'bg-[#10B981]/20',
      iconColor: 'text-[#34D399]',
      borderColor: 'border-[#10B981]/30',
      badgeColor: 'bg-[#10B981]',
    },
    {
      id: 'caption-generator' as Screen,
      title: 'Caption & Tags',
      subtitle: '📱 Captions & Hashtags',
      icon: Hash,
      bgColor: 'bg-[#EC4899]/20',
      iconColor: 'text-[#F472B6]',
      borderColor: 'border-[#EC4899]/30',
      badgeColor: 'bg-[#EC4899]',
    },
    {
      id: 'projects' as Screen,
      title: 'My Projects',
      subtitle: '📁 Saved Works',
      icon: FolderKanban,
      bgColor: 'bg-[#F97316]/20',
      iconColor: 'text-[#FB923C]',
      borderColor: 'border-[#F97316]/30',
      badgeColor: 'bg-[#F97316]',
    },
    {
      id: 'opportunities' as Screen,
      title: 'Earn Kwacha',
      subtitle: '💼 Brand Deals',
      icon: Briefcase,
      bgColor: 'bg-[#06B6D4]/20',
      iconColor: 'text-[#22D3EE]',
      borderColor: 'border-[#06B6D4]/30',
      badgeColor: 'bg-[#06B6D4]',
    },
  ];

  // Trending categories matching mockup
  const trendingCategories = [
    {
      name: 'Couple Comedy',
      emoji: '❤️',
      icon: Heart,
      bg: 'from-pink-600 to-rose-700',
      color: '#EC4899',
    },
    {
      name: 'Boyfriend vs Girlfriend',
      emoji: '👫',
      icon: Users,
      bg: 'from-purple-600 to-indigo-700',
      color: '#8B5CF6',
    },
    {
      name: 'Village vs Town',
      emoji: '🏡',
      icon: HomeIcon,
      bg: 'from-emerald-600 to-teal-700',
      color: '#10B981',
    },
    {
      name: 'Workplace Comedy',
      emoji: '💼',
      icon: Building,
      bg: 'from-blue-600 to-cyan-700',
      color: '#3B82F6',
    },
    {
      name: 'Zambian Vibes 🇿🇲',
      emoji: '🇿🇲',
      icon: Flame,
      bg: 'from-amber-600 to-orange-700',
      color: '#F59E0B',
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 space-y-6 pb-24">
      {/* Hero Banner matching frame 2 in screenshot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172030] via-[#1A253A] to-[#121824] border border-[#26354D] p-5 shadow-xl">
        <div className="relative z-10 max-w-[62%]">
          <div className="inline-flex items-center space-x-1 bg-[#FFB800]/20 text-[#FFB800] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FFB800]/30 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>AI CREATOR POWER</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Turn Your Ideas Into <span className="text-[#FFB800]">Creator Gold!</span>
          </h2>
          <p className="text-xs text-gray-300 mt-1 line-clamp-2">
            Get AI-powered ideas, scripts, scenes, captions & connect to paying brands.
          </p>
          <button
            onClick={() => onNavigate('idea-generator')}
            className="mt-3.5 px-4 py-2 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <span>Generate Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Creator cutout image */}
        <div className="absolute -bottom-2 -right-3 w-36 h-40 sm:w-44 sm:h-44 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
            alt="Smiling African Creator"
            className="w-full h-full object-cover object-top mask-radial"
            style={{
              maskImage: 'linear-gradient(to top, transparent 5%, black 40%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 40%)',
            }}
          />
        </div>
      </div>

      {/* Quick Actions (6 Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center space-x-1.5">
            <span>Quick Actions</span>
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">One-Tap Tools</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#141B28] hover:bg-[#1A2335] border border-[#222E42] hover:border-[#FFB800]/40 transition-all duration-200 group active:scale-95 text-center shadow-sm"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${action.bgColor} border ${action.borderColor} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <span className="text-[11px] font-bold text-gray-200 group-hover:text-white leading-tight">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Categories Horizontal Scroller */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Trending Categories
          </h3>
          <button
            onClick={() => onNavigate('create-hub')}
            className="text-[11px] text-[#FFB800] hover:underline font-bold flex items-center space-x-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {trendingCategories.map((cat, idx) => {
            const CatIcon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onQuickCategory(cat.name);
                  onNavigate('idea-generator');
                }}
                className={`flex-shrink-0 flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl bg-[#131A28] border border-[#202B3F] hover:border-[#FFB800]/50 transition-all active:scale-95`}
              >
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${cat.bg} flex items-center justify-center text-white text-xs shadow-sm`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-gray-200 whitespace-nowrap">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunities For You */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Opportunities For You
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
              Live Deals
            </span>
          </div>
          <button
            onClick={() => onNavigate('opportunities')}
            className="text-[11px] text-[#FFB800] hover:underline font-bold flex items-center space-x-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {opportunities.slice(0, 2).map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-2xl bg-[#131A27] border border-[#222E42] hover:border-[#FFB800]/40 transition-all flex flex-col justify-between space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={opp.businessLogo}
                    alt={opp.businessName}
                    className="w-10 h-10 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {opp.businessName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {opp.title}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-medium block">Budget</span>
                  <span className="text-sm font-black text-[#FFB800]">
                    K{opp.budget}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1C2538] text-[11px]">
                <div className="flex items-center space-x-3 text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{opp.deadline}</span>
                  </span>
                  <span>•</span>
                  <span>{opp.applicantsCount} applied</span>
                </div>

                <button
                  onClick={() => onSelectOpportunity(opp)}
                  className="px-3 py-1.5 bg-[#FFB800] hover:bg-[#FFA500] text-black font-extrabold text-[11px] rounded-lg transition-all active:scale-95 shadow-sm"
                >
                  View Opportunity
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            My Projects
          </h3>
          <button
            onClick={() => onNavigate('projects')}
            className="text-[11px] text-[#FFB800] hover:underline font-bold flex items-center space-x-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className="p-3 rounded-2xl bg-[#131A27] border border-[#202C3F] hover:border-[#FFB800]/40 cursor-pointer flex items-center justify-between space-x-3 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={proj.thumbnail}
                  alt={proj.title}
                  className="w-11 h-11 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#FFB800] transition-colors line-clamp-1">
                    {proj.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-0.5">
                    <span className="capitalize text-[#60A5FA] font-medium">{proj.type}</span>
                    <span>•</span>
                    <span>{proj.category}</span>
                    <span>•</span>
                    <span>{proj.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    proj.status === 'Completed'
                      ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                      : proj.status === 'Ready'
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30'
                      : 'bg-[#6B7280]/20 text-gray-300 border border-gray-700'
                  }`}
                >
                  {proj.status}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
