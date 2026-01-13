import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800 font-mono text-sm relative overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800 text-slate-400">
        <Terminal size={16} />
        <span className="font-semibold tracking-wide text-xs uppercase">Build Logs</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
        </div>
      </div>

      {/* Log Output */}
      <div 
        ref={scrollRef}
        className="flex-1 p-6 overflow-y-auto space-y-2 text-xs md:text-sm"
      >
        <div className="text-slate-500 mb-4">
            // PromptForge Engine v2.4.0 initialized<br/>
            // Target: System Instruction Generation<br/>
            // ----------------------------------------
        </div>
        
        {logs.map((log, index) => {
          // Color coding for log types
          let colorClass = "text-slate-300";
          if (log.includes("[ERR]")) colorClass = "text-red-400";
          else if (log.includes("[WARN]")) colorClass = "text-amber-400";
          else if (log.includes("[SUCCESS]")) colorClass = "text-emerald-400";
          else if (log.includes("[INFO]")) colorClass = "text-blue-400";
          else if (log.includes("[STACK]")) colorClass = "text-purple-400";

          return (
            <div key={index} className={`${colorClass} font-mono tracking-tight leading-relaxed`}>
              <span className="opacity-50 mr-3">{new Date().toLocaleTimeString().split(' ')[0]}</span>
              {log}
            </div>
          );
        })}
        
        {/* Blinking Cursor */}
        <div className="inline-block w-2 h-4 bg-brand-500 animate-pulse mt-2 align-middle"></div>
      </div>
    </div>
  );
};

export default DevConsole;