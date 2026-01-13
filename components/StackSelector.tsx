import React from 'react';
import { TECH_STACKS } from '../constants';
import { TechStack } from '../types';

interface StackSelectorProps {
  selected: TechStack[];
  onToggle: (stack: TechStack) => void;
}

const StackSelector: React.FC<StackSelectorProps> = ({ selected, onToggle }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Technology Stack
        </label>
        <span className="text-xs text-brand-400 font-mono">
            {selected.length > 0 ? `${selected.length} selected` : 'Select stacks'}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {TECH_STACKS.map((stack) => {
          const isSelected = selected.includes(stack);
          return (
            <button
              key={stack}
              onClick={() => onToggle(stack)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                ${isSelected 
                  ? 'bg-brand-600 border-brand-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' 
                  : 'bg-slate-800 border-slate-700 text-gray-400 hover:bg-slate-700 hover:text-gray-200'}
              `}
            >
              {stack}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StackSelector;