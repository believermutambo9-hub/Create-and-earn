import React, { useState } from 'react';
import { Search, X, Briefcase, FileText, User, Building2, ChevronRight } from 'lucide-react';
import { Project, Opportunity, Screen } from '../../types';
import { CREATOR_CATEGORIES } from '../../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  opportunities: Opportunity[];
  onSelectProject: (p: Project) => void;
  onSelectOpportunity: (o: Opportunity) => void;
  onSelectCategory: (cat: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  opportunities,
  onSelectProject,
  onSelectOpportunity,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const matchedProjects = projects.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedOpps = opportunities.filter(o => 
    o.title.toLowerCase().includes(query.toLowerCase()) ||
    o.businessName.toLowerCase().includes(query.toLowerCase()) ||
    o.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedCategories = CREATOR_CATEGORIES.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#111723] border border-[#23314B] rounded-3xl p-5 w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl space-y-3">
        {/* Search Header */}
        <div className="flex items-center space-x-2 border-b border-[#1C2538] pb-3">
          <Search className="w-4 h-4 text-[#FFB800]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creators, brand deals, scripts..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#182030] text-gray-400 hover:text-white flex items-center justify-center text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Opportunities */}
          {matchedOpps.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Brand Opportunities ({matchedOpps.length})
              </span>
              {matchedOpps.map(opp => (
                <div
                  key={opp.id}
                  onClick={() => {
                    onSelectOpportunity(opp);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#151D2C] hover:bg-[#1B2538] border border-[#222E42] cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-2.5">
                    <Briefcase className="w-4 h-4 text-[#3B82F6]" />
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{opp.title}</h4>
                      <span className="text-[10px] text-gray-400">{opp.businessName}</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#FFB800]">K{opp.budget}</span>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {matchedProjects.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Saved Projects ({matchedProjects.length})
              </span>
              {matchedProjects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#151D2C] hover:bg-[#1B2538] border border-[#222E42] cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#60A5FA]" />
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{proj.title}</h4>
                      <span className="text-[10px] text-gray-400 capitalize">{proj.type} • {proj.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          )}

          {/* Categories */}
          {matchedCategories.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Creative Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchedCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.title);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-xl bg-[#182132] hover:bg-[#202C40] border border-[#283750] text-gray-200 text-xs flex items-center space-x-1"
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedOpps.length === 0 && matchedProjects.length === 0 && matchedCategories.length === 0 && (
            <div className="py-8 text-center text-gray-400">
              No results found for "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
