
import React, { useState, useCallback, useEffect } from 'react';
import { BuildConfiguration, AndroidVersion, BuildType, LogEntry, BuildStatus } from './types';
import Terminal from './components/Terminal';
import BuildForm from './components/BuildForm';
import { analyzeBuildResults } from './services/geminiService';

const App: React.FC = () => {
  const [config, setConfig] = useState<BuildConfiguration>({
    outputName: 'Matrix_Sanders_OS',
    androidVersion: AndroidVersion.R_11,
    buildType: BuildType.LINEAGE_OS,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<BuildStatus>(BuildStatus.IDLE);
  const [progress, setProgress] = useState<number>(0);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [zipUrl, setZipUrl] = useState<string | null>(null);

  const addLog = useCallback((message: string, level: LogEntry['level'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      level,
      message,
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const startBuild = async () => {
    if (status !== BuildStatus.IDLE && status !== BuildStatus.COMPLETED && status !== BuildStatus.FAILED) return;

    setLogs([]);
    setAnalysis(null);
    setZipUrl(null);
    setProgress(0);
    setStatus(BuildStatus.INITIALIZING);

    addLog(`INIT: Matrix Build Engine context established for project [${config.outputName}]`, 'info');
    addLog(`DEVICE: Motorola Moto G5S Plus (sanders) detected.`, 'info');
    addLog(`ENV: Checking virtualization layers... KVM active.`, 'info');

    const steps = [
      { msg: 'Synchronizing with remote source grid...', delay: 1500, status: BuildStatus.SYNCING },
      { msg: 'Fetching vendor blobs: Proprietary Motorola Sanders components...', delay: 2000, status: BuildStatus.SYNCING },
      { msg: 'Mapping kernel source: msm8953 mainline-ready branches...', delay: 2500, status: BuildStatus.SYNCING },
      { msg: 'Applying security patches: Security String 2024-05-01...', delay: 1800, status: BuildStatus.PATCHING },
      { msg: 'Injecting Matrix UI custom overlays and accent colors...', delay: 1200, status: BuildStatus.PATCHING },
      { msg: 'Initiating Ninja Build System: make bacon -j$(nproc)', delay: 500, level: 'warn', status: BuildStatus.BUILDING },
      { msg: 'Resource Compilation: Generating framework resources...', delay: 3000, status: BuildStatus.BUILDING },
      { msg: 'Binary Synthesis: Linking SystemUI and SettingsLib...', delay: 2500, status: BuildStatus.BUILDING },
      { msg: 'ART Optimization: dex2oat hyper-threading active...', delay: 2000, status: BuildStatus.BUILDING },
      { msg: 'Kernel Compilation: Packing Image.gz-dtb...', delay: 3000, status: BuildStatus.BUILDING },
      { msg: 'Packaging: Encapsulating build into signed OTA archive...', delay: 2000, status: BuildStatus.BUILDING },
    ];

    let currentStep = 0;
    for (const step of steps) {
      currentStep++;
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setStatus(step.status);
      setProgress((currentStep / steps.length) * 100);
      addLog(step.msg, (step as any).level || 'info');
    }

    setStatus(BuildStatus.COMPLETED);
    setProgress(100);
    addLog(`DEPLOY: Build sequence finalized. ${config.outputName}.zip is valid.`, 'success');
    
    // Create a mock download
    const blob = new Blob([`Dummy Firmware Data for ${config.outputName}`], { type: 'application/zip' });
    setZipUrl(URL.createObjectURL(blob));

    // Get Gemini Analysis
    const logMessages = logs.map(l => l.message);
    const result = await analyzeBuildResults(logMessages, config.outputName);
    setAnalysis(result);
  };

  const getStatusText = () => {
    switch (status) {
      case BuildStatus.IDLE: return 'ENGINE IDLE';
      case BuildStatus.INITIALIZING: return 'CORES WARMING';
      case BuildStatus.SYNCING: return 'SYNCING GRID';
      case BuildStatus.PATCHING: return 'REWRITING';
      case BuildStatus.BUILDING: return 'SYNTHESIZING';
      case BuildStatus.COMPLETED: return 'STABLE BUILD';
      case BuildStatus.FAILED: return 'FAILURE';
      default: return 'AWAITING';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-6xl mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-cyan-500 rounded-lg flex items-center justify-center neon-border animate-pulse shadow-[0_0_25px_rgba(6,182,212,0.3)] rotate-3">
            <span className="text-black font-black text-3xl">X</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-cyan-400 tracking-tighter neon-text-cyan italic">
              SANDERS_MATRIX
            </h1>
            <p className="text-[10px] font-mono text-cyan-800 tracking-[0.5em] uppercase font-bold">
              Neural Firmware Synthesis Lab
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <div className="text-right">
            <p className="text-[10px] font-mono text-cyan-900 uppercase font-bold">Process State</p>
            <p className={`text-sm font-black mono tracking-widest ${status === BuildStatus.COMPLETED ? 'text-green-400' : status === BuildStatus.BUILDING ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`}>
              {getStatusText()}
            </p>
          </div>
          <button
            onClick={startBuild}
            disabled={status !== BuildStatus.IDLE && status !== BuildStatus.COMPLETED && status !== BuildStatus.FAILED}
            className={`px-10 py-4 rounded-sm font-black tracking-widest uppercase transition-all transform active:scale-95 border-2 ${
              status === BuildStatus.IDLE || status === BuildStatus.COMPLETED || status === BuildStatus.FAILED
                ? 'bg-cyan-500 text-black border-cyan-400 hover:bg-transparent hover:text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                : 'bg-transparent text-slate-700 border-slate-800 cursor-not-allowed'
            }`}
          >
            {status === BuildStatus.BUILDING ? 'In Progress' : 'Initiate Build'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <BuildForm 
            config={config} 
            onChange={setConfig} 
            disabled={status !== BuildStatus.IDLE && status !== BuildStatus.COMPLETED && status !== BuildStatus.FAILED}
          />
          
          {analysis && (
            <div className="glass-panel p-6 rounded-lg border-magenta-500/30 border-l-4 animate-in fade-in zoom-in slide-in-from-left-4 duration-700 bg-magenta-950/10">
              <div className="flex items-center space-x-2 mb-4">
                 <div className="w-2 h-2 bg-magenta-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(217,70,239,0.8)]"></div>
                 <h3 className="text-magenta-400 font-black uppercase tracking-tighter text-xs">Gemini Neural Summary</h3>
              </div>
              <div className="text-[11px] leading-relaxed text-magenta-100/70 font-mono prose prose-invert prose-xs max-w-none">
                {analysis.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
              </div>
            </div>
          )}

          {/* Current Configuration Summary (Always Visible) */}
          <div className="glass-panel p-6 rounded-lg border-amber-500/30 border-r-4 bg-amber-950/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
              <h3 className="text-amber-400 font-black uppercase tracking-tighter text-xs font-mono">Build Specs Manifest</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] text-amber-900 uppercase font-bold tracking-widest">A-Version</span>
                <span className="text-sm font-black text-amber-200 mono drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]">{config.androidVersion}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-amber-900 uppercase font-bold tracking-widest">Type</span>
                <span className="text-sm font-black text-amber-200 mono drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]">{config.buildType}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-amber-900 uppercase font-bold tracking-widest">Identifier</span>
                <span className="text-sm font-black text-amber-200 mono truncate drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]" title={config.outputName}>
                  {config.outputName}
                </span>
              </div>
            </div>
          </div>

          {zipUrl && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <a
                href={zipUrl}
                download={`${config.outputName}.zip`}
                className="group flex items-center justify-between px-6 py-5 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-lg text-emerald-400 font-black hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(52,211,153,0.1)] hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-emerald-500/20 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">Build Ready</p>
                    <p className="text-sm truncate max-w-[200px]">{config.outputName}.zip</p>
                  </div>
                </div>
                <span className="text-xs border border-emerald-500/50 px-2 py-1 rounded group-hover:bg-emerald-500 group-hover:text-black transition-colors">DOWNLOAD</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Console */}
        <div className="lg:col-span-7">
          <Terminal 
            logs={logs} 
            isBuilding={status !== BuildStatus.IDLE && status !== BuildStatus.COMPLETED && status !== BuildStatus.FAILED}
            progress={progress}
            status={status}
          />
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded border border-cyan-900/20 flex flex-col items-center">
              <p className="text-[9px] font-mono text-cyan-900 uppercase font-bold mb-1">Target</p>
              <p className="text-xs font-black text-cyan-200 tracking-wider">XT1805</p>
            </div>
            <div className="glass-panel p-4 rounded border border-cyan-900/20 flex flex-col items-center">
              <p className="text-[9px] font-mono text-cyan-900 uppercase font-bold mb-1">Arch</p>
              <p className="text-xs font-black text-cyan-200 tracking-wider">AARCH64</p>
            </div>
            <div className="glass-panel p-4 rounded border border-cyan-900/20 flex flex-col items-center">
              <p className="text-[9px] font-mono text-cyan-900 uppercase font-bold mb-1">Entropy</p>
              <p className="text-xs font-black text-cyan-200 tracking-wider">SECURE</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mt-16 py-8 border-t border-cyan-950/40 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="text-[10px] font-mono text-cyan-950 tracking-[0.2em] uppercase font-bold">
          © 2024 MATRIX_SYNDICATE // GLOBAL_ACCESS
        </div>
        <div className="flex space-x-8 text-[10px] font-mono text-cyan-900 tracking-widest uppercase font-bold">
          <span className="hover:text-cyan-400 cursor-help transition-colors decoration-dashed underline underline-offset-4">X-Protocol</span>
          <span className="hover:text-magenta-400 cursor-help transition-colors decoration-dashed underline underline-offset-4">Neuro-Link</span>
          <span className="hover:text-amber-400 cursor-help transition-colors decoration-dashed underline underline-offset-4">Grid-Stats</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
