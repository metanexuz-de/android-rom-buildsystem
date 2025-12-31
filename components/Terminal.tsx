
import React, { useEffect, useRef } from 'react';
import { LogEntry, BuildStatus } from '../types';

interface TerminalProps {
  logs: LogEntry[];
  isBuilding: boolean;
  progress: number;
  status: BuildStatus;
}

const Terminal: React.FC<TerminalProps> = ({ logs, isBuilding, progress, status }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return 'text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.5)]';
      case 'warn': return 'text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]';
      case 'error': return 'text-rose-500 font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]';
      case 'success': return 'text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.6)]';
      default: return 'text-slate-400';
    }
  }

  // Generate progress segments
  const segments = 20;
  const activeSegments = Math.floor((progress / 100) * segments);

  return (
    <div className="flex flex-col h-[520px] glass-panel rounded-lg overflow-hidden neon-border transition-all duration-500 border-opacity-50 hover:border-opacity-100">
      {/* Header */}
      <div className="bg-black/70 px-4 py-3 flex items-center justify-between border-b border-cyan-900/50">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        </div>
        <div className="text-[10px] font-mono text-cyan-500 tracking-[0.2em] uppercase font-bold">
          [ OS.MATRIX // SANDERS-V4 ]
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[10px] text-slate-500 mono hidden sm:inline">{status}</span>
          {isBuilding && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
              <span className="text-[10px] text-cyan-400 mono font-bold">ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Area */}
      <div className="bg-black/40 px-4 py-3 border-b border-cyan-900/20 flex items-center space-x-4">
        <div className="flex-1 h-3 bg-cyan-950/30 rounded-sm flex items-center px-1 space-x-1 overflow-hidden border border-cyan-900/30">
          {[...Array(segments)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-sm transition-all duration-300 ${
                i < activeSegments 
                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' 
                  : 'bg-cyan-900/20'
              }`}
            />
          ))}
        </div>
        <div className="w-12 text-right">
          <span className="text-xs font-mono text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Log Viewport */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 mono text-xs sm:text-sm overflow-y-auto bg-[#020202] custom-scrollbar"
      >
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
            <div className="w-16 h-16 border-2 border-dashed border-cyan-500 rounded-full animate-spin-slow"></div>
            <div className="text-cyan-500 italic tracking-widest text-xs uppercase">Awaiting Neural Connection...</div>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="mb-1.5 flex group">
              <span className="text-slate-600 mr-4 shrink-0 font-mono select-none opacity-50 group-hover:opacity-100 transition-opacity">
                {log.timestamp}
              </span>
              <span className={`${getLevelColor(log.level)} break-all leading-relaxed`}>
                <span className="mr-2 opacity-50 font-bold">
                  {log.level === 'error' ? 'ERR' : log.level === 'success' ? 'OK ' : log.level === 'warn' ? 'WRN' : 'LOG'}
                </span>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #164e63; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #22d3ee; }
      `}} />
    </div>
  );
};

export default Terminal;
