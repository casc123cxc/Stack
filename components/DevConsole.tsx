
import React, { useEffect, useRef } from 'react';
import { Terminal, CheckCircle2, AlertCircle, Info, BrainCircuit, Loader2, FileCode, PlayCircle } from 'lucide-react';

interface DevConsoleProps {
  logs: string[];
}

const DevConsole: React.FC<DevConsoleProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const parseLog = (log: string) => {
    if (log.includes("[ERR]")) return { type: 'error', text: log.replace('[ERR]', '').trim(), icon: <AlertCircle size={14} className="text-rose-500" /> };
    if (log.includes("[WARN]")) return { type: 'warn', text: log.replace('[WARN]', '').trim(), icon: <AlertCircle size={14} className="text-amber-500" /> };
    if (log.includes("[SUCCESS]")) return { type: 'success', text: log.replace('[SUCCESS]', '').trim(), icon: <CheckCircle2 size={14} className="text-emerald-500" /> };
    if (log.includes("[THINK]")) return { type: 'think', text: log.replace('[THINK]', '').trim(), icon: <BrainCircuit size={14} className="text-purple-400 animate-pulse" /> };
    if (log.includes("[STACK]")) return { type: 'stack', text: log.replace('[STACK]', '').trim(), icon: <FileCode size={14} className="text-blue-400" /> };
    if (log.includes("[VIS]")) return { type: 'vis', text: log.replace('[VIS]', '').trim(), icon: <PlayCircle size={14} className="text-pink-400" /> };
    // Default Info
    return { type: 'info', text: log.replace(/\[.*?\]/, '').trim(), icon: <Info size={14} className="text-slate-500" /> };
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 backdrop-blur-md border-l border-slate-800 font-sans relative overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
        <Terminal size={16} className="text-slate-400" />
        <span className="font-semibold tracking-wide text-xs uppercase text-slate-400">Process Timeline</span>
        <div className="ml-auto flex gap-1.5">
           {/* Decorative indicators */}
          <div className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
        </div>
      </div>

      {/* Log Output */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto"
      >
        <div className="space-y-6 relative">
          
          {/* Timeline Line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-800/50"></div>

          {logs.length === 0 && (
             <div className="flex flex-col items-center justify-center h-40 text-slate-600 opacity-50">
                <p className="text-xs">Waiting for jobs...</p>
             </div>
          )}

          {logs.map((log, index) => {
            const { type, text, icon } = parseLog(log);
            const isLast = index === logs.length - 1;

            return (
              <div key={index} className={`relative flex gap-4 group ${isLast ? 'opacity-100' : 'opacity-70 hover:opacity-100'} transition-opacity`}>
                {/* Timeline Node */}
                <div className={`
                    relative z-10 w-10 h-10 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center shrink-0
                    ${type === 'think' ? 'shadow-[0_0_10px_rgba(168,85,247,0.2)] border-purple-500/30' : ''}
                    ${type === 'success' ? 'border-emerald-500/30 bg-emerald-950/10' : ''}
                    ${type === 'error' ? 'border-rose-500/30 bg-rose-950/10' : ''}
                `}>
                   {icon}
                </div>

                {/* Content Card */}
                <div className="flex-1 py-1">
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider
                            ${type === 'error' ? 'text-rose-400' : ''}
                            ${type === 'success' ? 'text-emerald-400' : ''}
                            ${type === 'think' ? 'text-purple-400' : ''}
                            ${type === 'stack' ? 'text-blue-400' : ''}
                            ${type === 'vis' ? 'text-pink-400' : ''}
                            ${type === 'warn' ? 'text-amber-400' : ''}
                            ${type === 'info' ? 'text-slate-500' : ''}
                        `}>
                            {type}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono">
                           {new Date().toLocaleTimeString().split(' ')[0]}
                        </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        {text}
                    </p>
                </div>
              </div>
            );
          })}
          
          {/* Active Indicator at bottom if active */}
           {logs.length > 0 && !logs.some(l => l.includes("[SUCCESS]") || l.includes("[ERR]")) && (
              <div className="relative flex gap-4 animate-pulse opacity-50">
                  <div className="relative z-10 w-10 h-10 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center shrink-0">
                      <Loader2 size={14} className="animate-spin text-slate-500"/>
                  </div>
                  <div className="flex-1 py-3">
                      <div className="h-2 w-24 bg-slate-800 rounded mb-2"></div>
                      <div className="h-2 w-48 bg-slate-800/50 rounded"></div>
                  </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default DevConsole;
