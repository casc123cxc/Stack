import React from 'react';
import { Constraint } from '../types';
import { ShieldAlert, Code2, Zap, AlertTriangle } from 'lucide-react';

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
      default: return <Code2 size={16} />;
    }
  };

  const getColor = (category: string, active: boolean) => {
    if (!active) return 'text-gray-500';
    switch(category) {
      case 'safety': return 'text-emerald-400';
      case 'compatibility': return 'text-amber-400';
      case 'performance': return 'text-blue-400';
      default: return 'text-brand-400';
    }
  };

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
              relative p-3 rounded-lg border cursor-pointer transition-all duration-200 group
              ${c.active 
                ? 'bg-slate-800/80 border-brand-500/50' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${getColor(c.category, c.active)}`}>
                {getIcon(c.category)}
              </div>
              <div>
                <div className={`font-medium text-sm ${c.active ? 'text-gray-200' : 'text-gray-500'}`}>
                  {c.label}
                </div>
                <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {c.description}
                </div>
              </div>
              <div className="ml-auto">
                 <div className={`
                    w-4 h-4 rounded border flex items-center justify-center transition-colors
                    ${c.active ? 'bg-brand-600 border-brand-500' : 'border-slate-600'}
                 `}>
                    {c.active && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConstraintBuilder;