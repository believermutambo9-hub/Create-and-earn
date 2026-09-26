import React, { useState } from 'react';
import { 
  Plus, 
  FolderKanban, 
  MoreVertical, 
  Search, 
  Eye, 
  Edit2, 
  Copy, 
  Trash2, 
  Share2, 
  Check, 
  FileText, 
  Lightbulb, 
  Clapperboard, 
  Hash,
  Sparkles
} from 'lucide-react';
import { Project, Screen } from '../../types';

interface ProjectsScreenProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onDuplicateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onNewProject: () => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
  onNewProject,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Scripts' | 'Ideas' | 'Captions' | 'Drafts' | 'Completed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filterTabs = ['All', 'Scripts', 'Ideas', 'Captions', 'Drafts', 'Completed'] as const;

  const filteredProjects = projects.filter((p) => {
    // Search
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Filter
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Scripts') return p.type === 'script' || p.type === 'scene';
    if (activeFilter === 'Ideas') return p.type === 'idea';
    if (activeFilter === 'Captions') return p.type === 'caption';
    if (activeFilter === 'Drafts') return p.status === 'Draft';
    if (activeFilter === 'Completed') return p.status === 'Completed' || p.status === 'Ready';
    return true;
  });

  const handleShare = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`Check out my creator project on CREATE & EARN: "${project.title}" (${project.category})`);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'script': return <FileText className="w-3.5 h-3.5 text-[#60A5FA]" />;
      case 'idea': return <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />;
      case 'scene': return <Clapperboard className="w-3.5 h-3.5 text-[#34D399]" />;
      case 'caption': return <Hash className="w-3.5 h-3.5 text-[#EC4899]" />;
      default: return <FolderKanban className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-24">
      {/* Header matching frame 8 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1 text-[#FFB800] text-xs font-bold mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WORKSPACE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            My Projects
          </h2>
        </div>

        {/* Plus Button matching top right in screenshot */}
        <button
          onClick={onNewProject}
          className="w-10 h-10 rounded-2xl bg-[#FFB800] hover:bg-[#FFA500] text-black flex items-center justify-center shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          title="Create New Project"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search saved projects, scripts, ideas..."
          className="w-full bg-[#131A27] border border-[#222E42] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800] transition-colors"
        />
      </div>

      {/* Filter Tabs matching frame 8 */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeFilter === tab
                ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
                : 'bg-[#141A28] text-gray-300 hover:text-white border border-[#222E42]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Projects List matching frame 8 */}
      <div className="space-y-2.5">
        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center bg-[#121824] rounded-3xl border border-[#202C3F] p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1A2234] mx-auto flex items-center justify-center text-gray-400">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No projects found</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Start by generating a hilarious idea, full script, or scene plan!
            </p>
            <button
              onClick={onNewProject}
              className="px-4 py-2 bg-[#FFB800] text-black font-extrabold text-xs rounded-xl shadow-md"
            >
              Create New Project
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project)}
              className="p-3.5 rounded-2xl bg-[#131A27] border border-[#202C3F] hover:border-[#FFB800]/40 cursor-pointer flex items-center justify-between space-x-3 transition-all relative group shadow-sm"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="relative shrink-0">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#101725] p-1 rounded-md border border-white/10">
                    {getTypeIcon(project.type)}
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FFB800] transition-colors truncate">
                    {project.title}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5">
                    <span className="capitalize text-[#60A5FA] font-semibold">
                      {project.type}
                    </span>
                    <span>•</span>
                    <span className="truncate">{project.category}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block">
                    {project.createdAt}
                  </span>
                </div>
              </div>

              {/* Right: Status badge & 3-dots Menu */}
              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    project.status === 'Completed' || project.status === 'Ready'
                      ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                      : project.status === 'In Production'
                      ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30'
                      : 'bg-[#6B7280]/20 text-gray-300 border border-gray-700'
                  }`}
                >
                  {project.status}
                </span>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuProjectId(
                        activeMenuProjectId === project.id ? null : project.id
                      );
                    }}
                    className="w-8 h-8 rounded-full bg-[#182132] text-gray-400 hover:text-white flex items-center justify-center border border-[#273650]"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Popover Menu */}
                  {activeMenuProjectId === project.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-10 w-40 bg-[#161E2E] border border-[#293B5A] rounded-2xl p-1.5 shadow-2xl z-30 space-y-1"
                    >
                      <button
                        onClick={() => {
                          onOpenProject(project);
                          setActiveMenuProjectId(null);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold text-gray-200 hover:bg-[#202C40] hover:text-white flex items-center space-x-2"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>Open & View</span>
                      </button>

                      <button
                        onClick={() => {
                          onDuplicateProject(project);
                          setActiveMenuProjectId(null);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold text-gray-200 hover:bg-[#202C40] hover:text-white flex items-center space-x-2"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#A855F7]" />
                        <span>Duplicate</span>
                      </button>

                      <button
                        onClick={(e) => {
                          handleShare(project, e);
                          setActiveMenuProjectId(null);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold text-gray-200 hover:bg-[#202C40] hover:text-white flex items-center space-x-2"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#34D399]" />
                        <span>{copiedId === project.id ? 'Copied Link' : 'Share'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${project.title}"?`)) {
                            onDeleteProject(project.id);
                          }
                          setActiveMenuProjectId(null);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/20 flex items-center space-x-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
