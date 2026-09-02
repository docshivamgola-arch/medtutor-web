import React, { useState } from 'react';
import { 
  ChevronDown, ChevronRight, CheckCircle2, 
  Clock, BookMarked, Search, X
} from 'lucide-react';
import { MEDICAL_SYSTEMS } from '../data/systemsData';

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

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-[57px] left-0 z-40 h-full lg:h-[calc(100vh-57px-48px)]
        w-72 bg-slate-900/95 lg:bg-slate-950 border-r border-slate-800/80 flex flex-col
        transition-transform duration-200 ease-in-out shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400">
              Curriculum Tree
            </span>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
              19 Subjects
            </span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search / Filter in tree */}
        <div className="p-2.5 border-b border-slate-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Filter organs & systems..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
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
                  className="w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: system.badgeColor }}
                    />
                    <span>{system.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500">
                      {system.nodes.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                </button>

                {/* Node Items */}
                {isExpanded && (
                  <div className="ml-3 pl-2 border-l border-slate-800 space-y-0.5 mt-0.5 mb-1">
                    {(filterQuery ? matchingNodes : system.nodes).map(node => {
                      const isActive = node.id === activeNodeId;
                      let badge = null;
                      if (node.status === 'active') {
                        badge = (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Live
                          </span>
                        );
                      } else if (node.status === 'in-production') {
                        badge = (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            <Clock className="w-2.5 h-2.5" /> Next
                          </span>
                        );
                      } else {
                        badge = (
                          <span className="flex items-center gap-1 text-[9px] text-slate-500">
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
                              ? 'bg-teal-500/10 text-teal-300 font-bold border border-teal-500/30 shadow-sm' 
                              : node.status === 'active'
                                ? 'text-slate-300 hover:bg-slate-900 hover:text-white'
                                : 'text-slate-500 hover:text-slate-400'
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
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300">Curriculum Progress</span>
            <span className="font-mono text-teal-400 font-bold">1 / 19 Live</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 w-[5.2%]" />
          </div>
        </div>
      </aside>
    </>
  );
};
