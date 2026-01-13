import React, { useState, useRef } from 'react';
import { ProjectConfig, TechStack, Template } from './types';
import { DEFAULT_CONSTRAINTS, PROJECT_TEMPLATES } from './constants';
import { generateSystemInstruction, analyzeProjectUrl } from './services/geminiService';
import StackSelector from './components/StackSelector';
import ConstraintBuilder from './components/ConstraintBuilder';
import ResultView from './components/ResultView';
import DevConsole from './components/DevConsole';
import { Cpu, Terminal, Wand2, Loader2, ArrowRight, Layers, Database, Box, Link2, Search } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<ProjectConfig>({
    name: '',
    description: '',
    selectedStacks: ['Python'], 
    additionalContext: '',
    constraints: DEFAULT_CONSTRAINTS,
    tone: 'Professional'
  });

  const [urlInput, setUrlInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  
  // Ref for interval cleanup
  const logIntervalRef = useRef<number | null>(null);

  const handleConstraintToggle = (id: string) => {
    setConfig(prev => ({
      ...prev,
      constraints: prev.constraints.map(c => 
        c.id === id ? { ...c, active: !c.active } : c
      )
    }));
  };

  const handleStackToggle = (stack: TechStack) => {
    setConfig(prev => {
      const current = prev.selectedStacks;
      const exists = current.includes(stack);
      const newStacks = exists
        ? current.filter(s => s !== stack)
        : [...current, stack];
      return { ...prev, selectedStacks: newStacks };
    });
  };

  const applyTemplate = (template: Template) => {
    setConfig(prev => ({
      ...prev,
      ...template.config,
      // Ensure we keep existing name if user typed one, or use empty
      name: prev.name || "",
      // Reset constraints to defaults, or customized in future
      constraints: DEFAULT_CONSTRAINTS
    }));
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const handleAnalyzeUrl = async () => {
    if (!urlInput) return;
    
    setIsAnalyzing(true);
    // Reset view to show logs if hidden, but we aren't generating full prompt yet
    // Just minimal logs for analysis
    
    try {
      // Basic validation
      new URL(urlInput);
    } catch {
      alert("Please enter a valid URL (e.g., https://github.com/...)");
      setIsAnalyzing(false);
      return;
    }

    addLog(`[INFO] Analyzing external resource: ${urlInput}`);
    addLog(`[NET] Initiating search grounding...`);

    try {
      const analysis = await analyzeProjectUrl(urlInput);
      
      addLog(`[SUCCESS] Analysis complete.`);
      if (analysis.name) addLog(`[DATA] Detected Name: ${analysis.name}`);
      if (analysis.selectedStacks) addLog(`[DATA] Detected Stack: ${analysis.selectedStacks.join(', ')}`);

      setConfig(prev => ({
        ...prev,
        name: analysis.name || prev.name,
        description: analysis.description || prev.description,
        selectedStacks: (analysis.selectedStacks as TechStack[]) || prev.selectedStacks,
        tone: (analysis.tone as any) || prev.tone
      }));

    } catch (e) {
      addLog(`[ERR] Analysis failed. Ensure URL is accessible.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSimulationLogs = () => {
    const steps = [
        `[INFO] Starting compile job for project: "${config.name || 'Untitled'}"`,
        `[CTX] Parsing description (${config.description.length} chars)...`,
        ...config.selectedStacks.map(s => `[STACK] Loading definitions for ${s}...`),
        `[WARN] Checking constraint compatibility...`,
        `[INFO] ${config.constraints.filter(c => c.active).length} active constraints applied.`,
        `[INFO] Tone setting: ${config.tone}`,
        `[REQ] Initiating handshake with Gemini API...`,
        `[NET] Sending payload (approx. 4kb)...`,
        `[WAIT] Awaiting token stream...`,
    ];

    let stepIndex = 0;
    
    // Clear previous interval if exists
    if (logIntervalRef.current) clearInterval(logIntervalRef.current);

    logIntervalRef.current = window.setInterval(() => {
        if (stepIndex < steps.length) {
            addLog(steps[stepIndex]);
            stepIndex++;
        }
    }, 600); // Add a log every 600ms
  };

  const handleGenerate = async () => {
    if (!config.description) return; 

    setIsGenerating(true);
    setLogs([]);
    setGeneratedContent(null);
    setShowResult(false);
    
    generateSimulationLogs();

    try {
      const result = await generateSystemInstruction(config);
      
      // Add success logs
      addLog(`[SUCCESS] Response received.`);
      addLog(`[INFO] Validating markdown structure...`);
      addLog(`[INFO] Finalizing output...`);
      
      // Small delay to let user see "success" before switching
      setTimeout(() => {
          setGeneratedContent(result);
          setShowResult(true);
          if (logIntervalRef.current) clearInterval(logIntervalRef.current);
      }, 800);

    } catch (error) {
      addLog(`[ERR] Generation failed: ${error}`);
      alert("Error generating prompt. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex text-slate-200 font-sans selection:bg-brand-500/30">
      
      {/* Sidebar / Left Panel */}
      <div className="w-full lg:w-2/3 xl:w-1/2 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Cpu className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">PromptForge</h1>
              <p className="text-xs text-brand-400 font-medium">System Instruction Architect</p>
            </div>
          </div>
        </header>

        {/* Scrollable Form Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
          
          {/* Smart Import */}
          <section className="bg-slate-800/20 border border-brand-500/20 rounded-xl p-4">
            <label className="text-sm font-semibold text-brand-300 uppercase tracking-wider flex items-center gap-2 mb-3">
               <Link2 size={16} />
               Smart Import (GitHub / YouTube / Web)
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="https://github.com/username/repo or video url..." 
                className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-slate-600"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button
                onClick={handleAnalyzeUrl}
                disabled={isAnalyzing || !urlInput}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {isAnalyzing ? 'Analyzing...' : 'Auto-Detect'}
              </button>
            </div>
            {isAnalyzing && (
               <div className="mt-2 text-xs text-slate-500 font-mono">
                  Scanning URL content via Gemini Grounding...
               </div>
            )}
          </section>

          {/* Quick Start Templates */}
          <section className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Quick Start Templates</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PROJECT_TEMPLATES.map((t, idx) => (
                    <button
                        key={idx}
                        onClick={() => applyTemplate(t)}
                        className="flex flex-col gap-2 p-3 bg-slate-800/40 border border-slate-700 hover:bg-slate-800 hover:border-brand-500/50 rounded-lg text-left transition-all group"
                    >
                        <div className="flex items-center gap-2 text-gray-300 group-hover:text-brand-400">
                             {t.icon === 'layers' && <Layers size={18}/>}
                             {t.icon === 'database' && <Database size={18}/>}
                             {t.icon === 'cpu' && <Box size={18}/>}
                             <span className="font-medium text-sm">{t.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-snug">{t.description}</p>
                    </button>
                ))}
            </div>
          </section>

          <section className="space-y-4">
             <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Project Identity</label>
                <input 
                  type="text" 
                  placeholder="e.g. Finance Dashboard Scraper" 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600"
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                />
             </div>
             
             <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Core Instruction</label>
                <textarea 
                  placeholder="Describe what the LLM should do. E.g., 'Create a Python script that scrapes stock data using BeautifulSoup and saves it to CSV. Handle 429 errors gracefully.'" 
                  className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none placeholder-slate-600"
                  value={config.description}
                  onChange={(e) => setConfig({...config, description: e.target.value})}
                />
             </div>
          </section>

          <StackSelector 
            selected={config.selectedStacks} 
            onToggle={handleStackToggle} 
          />

          <ConstraintBuilder 
            constraints={config.constraints} 
            onToggle={handleConstraintToggle} 
          />

          <section>
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Persona Tone
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Professional', 'Educational', 'Concise', 'Socratic'].map(t => (
                    <button
                        key={t}
                        onClick={() => setConfig({...config, tone: t as any})}
                        className={`py-2 px-3 rounded-md text-sm border transition-all ${config.tone === t ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-800 text-gray-500 hover:border-slate-600'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
          </section>

        </main>

        {/* Floating Action Bar */}
        <div className="absolute bottom-0 left-0 w-full lg:w-2/3 xl:w-1/2 p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-4">
                <button
                    disabled={isGenerating || !config.description}
                    onClick={handleGenerate}
                    className={`
                        flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all
                        ${isGenerating || !config.description 
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                            : 'bg-white text-slate-900 hover:bg-brand-50 hover:scale-[1.01] active:scale-[0.99]'}
                    `}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="animate-spin" />
                            <span className="text-sm font-normal text-slate-500">Constructing...</span>
                        </>
                    ) : (
                        <>
                            <Wand2 size={20} className={!config.description ? 'opacity-50' : 'text-brand-600'} />
                            <span>Construct Instruction</span>
                            <ArrowRight size={20} className="opacity-40" />
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>

      {/* Right Panel - Dynamic: Console or Result */}
      <div className={`
        fixed inset-0 lg:static lg:inset-auto bg-slate-900/95 lg:bg-slate-950 lg:w-1/3 xl:w-1/2 transition-all duration-500 ease-in-out z-20
        ${(showResult || isGenerating) ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
         {/* Show Console for Analysis Logs too */}
         {(!showResult && (isGenerating || logs.length > 0)) && (
             <div className="h-full w-full">
                <DevConsole logs={logs} />
             </div>
         )}

         {(!isGenerating && !generatedContent && logs.length === 0) && (
             <div className="hidden lg:flex h-full flex-col items-center justify-center text-slate-600 space-y-4 p-12 text-center">
                 <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Terminal size={32} />
                 </div>
                 <div>
                    <h3 className="text-lg font-medium text-slate-400">Ready to Forge</h3>
                    <p className="text-sm max-w-xs mx-auto mt-2">Configure manually or import from URL to auto-detect stack and constraints.</p>
                 </div>
             </div>
         )}

         {!isGenerating && generatedContent && (
             <ResultView 
                content={generatedContent} 
                onClose={() => setShowResult(false)}
             />
         )}
      </div>

    </div>
  );
}