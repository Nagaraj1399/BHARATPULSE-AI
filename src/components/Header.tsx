import React from 'react';
import { Play, Activity, Radio, Shield, Map, Eye } from 'lucide-react';

interface HeaderProps {
  activeTab: 'landing' | 'citizen' | 'dashboard' | 'risk';
  setActiveTab: (tab: 'landing' | 'citizen' | 'dashboard' | 'risk') => void;
  onRunDemo: () => void;
  isDemoRunning?: boolean;
  judgeMode: boolean;
  setJudgeMode: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRunDemo,
  isDemoRunning = false,
  judgeMode,
  setJudgeMode,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Sovereign Tricolor India Accent Micro-Bar */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-amber-500" />
        <div className="w-1/3 bg-slate-100" />
        <div className="w-1/3 bg-emerald-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand and Taglines */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-600 to-cyan-500 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wider text-white">
                BHARAT<span className="text-amber-400">PULSE</span> <span className="text-cyan-400 font-mono text-xs">AI</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] uppercase font-bold tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Bengaluru Node
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate">
              India's AI Operating System for Future Cities
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'landing'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('citizen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'citizen'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            Citizen Voice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'dashboard'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Command Center
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'risk'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Risk Intelligence
          </button>
        </nav>

        {/* Action Controls: 90-Second Demo & Judge Mode */}
        <div className="flex items-center gap-2">
          {/* Judge Mode Switch */}
          <button
            type="button"
            onClick={() => setJudgeMode(!judgeMode)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              judgeMode
                ? 'bg-purple-900/40 text-purple-300 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Architecture & Telemetry Judge Mode"
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>JUDGE MODE</span>
            {judgeMode && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />}
          </button>

          {/* RUN 90-SECOND DEMO Button */}
          <button
            type="button"
            onClick={onRunDemo}
            disabled={isDemoRunning}
            className={`relative group overflow-hidden px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide flex items-center gap-2 transition-all shadow-lg ${
              isDemoRunning
                ? 'bg-slate-800 text-amber-300 border border-amber-500/40 cursor-wait'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-amber-500/25 active:scale-95'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${isDemoRunning ? 'animate-spin' : ''}`} />
            <span>{isDemoRunning ? 'RUNNING DEMO...' : 'RUN 90-SECOND DEMO'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
