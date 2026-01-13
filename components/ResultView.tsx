import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import { suggestImprovements, refineSystemInstruction } from '../services/geminiService';

interface ResultViewProps {
  content: string;
  onUpdate: (newContent: string) => void;
  onClose: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ content, onUpdate, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingRefinement, setLoadingRefinement] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGetTips = async () => {
    setLoadingSuggestions(true);
    const tips = await suggestImprovements(content);
    setSuggestions(tips);
    setLoadingSuggestions(false);
  };

  const handleApplyRefinement = async () => {
    if (!suggestions) return;
    setLoadingRefinement(true);
    try {
        const refined = await refineSystemInstruction(content, suggestions);
        onUpdate(refined);
        setSuggestions(null); // Clear suggestions as they are applied
    } catch (e) {
        console.error("Failed to apply refinement", e);
    } finally {
        setLoadingRefinement(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 w-full lg:w-[600px] absolute right-0 top-0 shadow-2xl z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-2 text-brand-400">
          <Sparkles size={20} />
          <span className="font-bold text-lg">Generated Instruction</span>
        </div>
        <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white lg:hidden"
        >
            Close
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Output Box */}
        <div className="relative group">
            <div className="absolute top-3 right-3 flex gap-2">
                <button
                    onClick={handleCopy}
                    className="p-2 bg-slate-700/50 hover:bg-slate-700 text-gray-300 rounded-md transition-all backdrop-blur-sm border border-slate-600"
                    title="Copy to clipboard"
                >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
            </div>
            
            <pre className="w-full h-full p-4 bg-slate-950/50 border border-slate-800 rounded-xl text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                {content}
            </pre>
        </div>

        {/* AI Analysis Section */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-400">AI Analysis & Refinement</h3>
                <button 
                    onClick={handleGetTips}
                    disabled={loadingSuggestions || loadingRefinement}
                    className="text-xs flex items-center gap-1 text-brand-400 hover:text-brand-300 disabled:opacity-50"
                >
                   {loadingSuggestions ? <RefreshCw className="animate-spin" size={12}/> : <Sparkles size={12}/>}
                   {suggestions ? 'Refresh Analysis' : 'Analyze Prompt'}
                </button>
            </div>
            
            {loadingSuggestions && (
                <div className="text-sm text-gray-500 animate-pulse">Analyzing structural integrity of prompt...</div>
            )}

            {!loadingSuggestions && !suggestions && (
                <p className="text-sm text-gray-600">Click analyze to let the engine find potential weak points in this instruction set.</p>
            )}

            {suggestions && (
                 <div className="space-y-3">
                     <div className="text-sm text-gray-300 prose prose-invert max-w-none">
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                             <div className="whitespace-pre-wrap font-sans">{suggestions}</div>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleApplyRefinement}
                        disabled={loadingRefinement}
                        className="w-full py-2 bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/30 text-brand-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all"
                    >
                        {loadingRefinement ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                        {loadingRefinement ? 'Refining Instruction...' : 'Apply Improvements to Instruction'}
                    </button>
                </div>
            )}
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <button 
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-brand-900/20"
        >
          {copied ? 'Copied to Clipboard' : 'Copy System Instruction'}
        </button>
      </div>
    </div>
  );
};

export default ResultView;