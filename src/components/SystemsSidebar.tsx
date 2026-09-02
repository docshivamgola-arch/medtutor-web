import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, CheckCircle2, 
  Clock, BookMarked, Search, X
} from 'lucide-react';
import { MEDICAL_SYSTEMS } from '../data/systemsData';
import { useTheme } from '../context/ThemeContext';

interface SystemsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

export const SystemsSidebar: React.FC<SystemsSidebarProps> = ({
  isOpen,
  onClose,
  activeNodeId,
  onSelectNode
}) => {
  const { isDark } = useTheme();
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({
    endocrine: true,
    hepatobiliary: true,
    cardiovascular: false,
    cns: false,
    renal: false
  });
  const [filterQuery, setFilterQuery] = useState('');

  const toggleSystem = (systemId: string) => {
    setExpandedSystems(prev => ({ ...prev, [systemId]: !prev[systemId] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container with Smooth Slide Animation & Dynamic Collapse */}
      <aside className={`
        fixed lg:relative top-0 lg:top-0 left-0 z-40 h-full lg:h-[calc(100vh-57px-48px)]
        flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-hidden
        ${isOpen 
          ? 'w-72 opacity-100 translate-x-0 border-r pointer-events-auto' 
          : 'w-0 -translate-x-full lg:translate-x-0 opacity-0 border-r-0 pointer-events-none'}
        ${isDark 
          ? 'bg-slate-900/95 lg:bg-slate-950 border-slate-800/80 text-slate-100' 
          : 'bg-white/95 lg:bg-white border-slate-200 text-slate-900 shadow-sm'}
      `}>
        {/* Inner container with fixed width to prevent text reflow during collapse animation */}
        <div className="w-72 flex flex-col h-full shrink-0">
          {/* Top Header */}
          <div className={`p-3.5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-teal-600 dark:text-teal-400">
                Curriculum Tree
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                19 Subjects
              </span>
            </div>
            <button 
              onClick={onClose}
              className={`lg:hidden p-1 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search / Filter in tree */}
          <div className={`p-2.5 border-b ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Filter organs & systems..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className={`w-full rounded-lg pl-8 pr-2.5 py-1 text-xs focus:outline-none focus:border-teal-500 transition-colors border ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Tree List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {MEDICAL_SYSTEMS.map(system => {
              const isExpanded = expandedSystems[system.id] || Boolean(filterQuery);
              const matchingNodes = system.nodes.filter(n => 
                n.name.toLowerCase().includes(filterQuery.toLowerCase())
              );

              if (filterQuery && matchingNodes.length === 0) return null;

              return (
                <div key={system.id} className="rounded-xl overflow-hidden">
                  {/* System Header */}
                  <button
                    onClick={() => toggleSystem(system.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isDark 
                        ? 'text-slate-300 hover:bg-slate-900 hover:text-white' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: system.badgeColor }}
                      />
                      <span className="truncate">{system.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">
                        {system.nodes.length}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Node Items */}
                  {isExpanded && (
                    <div className={`ml-3 pl-2 border-l space-y-0.5 mt-0.5 mb-1 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      {(filterQuery ? matchingNodes : system.nodes).map(node => {
                        const isActive = node.id === activeNodeId;
                        let badge = null;
                        if (node.status === 'active') {
                          badge = (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Live
                            </span>
                          );
                        } else if (node.status === 'in-production') {
                          badge = (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                              <Clock className="w-2.5 h-2.5" /> Next
                            </span>
                          );
                        } else {
                          badge = (
                            <span className="flex items-center gap-1 text-[9px] text-slate-400">
                              <BookMarked className="w-2.5 h-2.5" />
                            </span>
                          );
                        }

                        return (
                          <button
                            key={node.id}
                            disabled={node.status !== 'active'}
                            onClick={() => {
                              if (node.status === 'active') {
                                onSelectNode(node.id);
                                onClose();
                              } else {
                                alert(`${node.name} is scheduled for next release!`);
                              }
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all text-left cursor-pointer disabled:cursor-not-allowed ${
                              isActive 
                                ? isDark
                                  ? 'bg-teal-500/10 text-teal-300 font-bold border border-teal-500/30 shadow-sm'
                                  : 'bg-teal-50 text-teal-800 font-bold border border-teal-300 shadow-sm'
                                : node.status === 'active'
                                  ? isDark ? 'text-slate-300 hover:bg-slate-900 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                  : isDark ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <span className="truncate pr-1">{node.name}</span>
                            {badge}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Progress Bar */}
          <div className={`p-3 border-t text-[11px] ${
            isDark ? 'border-slate-800 bg-slate-950/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Curriculum Progress</span>
              <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">1 / 19 Live</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 w-[5.2%]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
