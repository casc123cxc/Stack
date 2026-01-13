
import React from 'react';
import { Constraint } from '../types';
import { ShieldAlert, Code2, Zap, AlertTriangle, Cpu, Heart } from 'lucide-react';

interface ConstraintBuilderProps {
  constraints: Constraint[];
  onToggle: (id: string) => void;
}

const ConstraintBuilder: React.FC<ConstraintBuilderProps> = ({ constraints, onToggle }) => {
  
  const getIcon = (category: string) => {
    switch(category) {
      case 'safety': return <ShieldAlert size={16} />;
      case 'style': return <Code2 size={16} />;
      case 'performance': return <Zap size={16} />;
      case 'compatibility': return <AlertTriangle size={16} />;
      case 'optimization': return <Cpu size={16} />;
      case 'content': return <Heart size={16} />;
      default: return <Code2 size={16} />;
    }
  };

  const getColor = (category: string, active: boolean) => {
    if (!active) return 'text-gray-500';
    switch(category) {
      case 'safety': return 'text-emerald-400';
      case 'compatibility': return 'text-amber-400';
      case 'performance': return 'text-blue-400';
      case 'content': return 'text-rose-400';
      case 'optimization': return 'text-cyan-400';
      default: return 'text-brand-400';
    }
  };

  // Grouping for better layout if list gets too long? For now grid is fine.
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Guardrails & Constraints
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {constraints.map((c) => (
          <div
            key={c.id}
            onClick={() => onToggle(c.id)}
            className={`
              relative p-3 rounded-lg border cursor-pointer transition-all duration-200 group flex items-start gap-3
              ${c.active 
                ? 'bg-slate-800/80 border-brand-500/50 shadow-md shadow-black/20' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'}
            `}
          >
            <div className={`mt-0.5 shrink-0 transition-colors ${getColor(c.category, c.active)}`}>
               {getIcon(c.category)}
            </div>
            
            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between">
                  <span className={`font-medium text-sm transition-colors ${c.active ? 'text-gray-200' : 'text-gray-500'}`}>
                    {c.label}
                  </span>
                  
                  {/* Active Indicator Dot */}
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${c.active ? 'bg-brand-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]' : 'bg-transparent'}`}></div>
               </div>
               
               <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                  {c.description}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConstraintBuilder;
