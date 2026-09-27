import React from 'react';
import { Mic, Cpu, Wrench, Play, ArrowRight, Radio, Shield, Waves, CheckCircle2 } from 'lucide-react';

interface LandingHeroProps {
  onOpenVoice: () => void;
  onOpenDashboard: () => void;
  onRunDemo: () => void;
  isDemoRunning?: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenVoice,
  onOpenDashboard,
  onRunDemo,
  isDemoRunning = false,
}) => {
  return (
    <div className="py-8 sm:py-16 space-y-16 max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono tracking-wide shadow-lg shadow-amber-500/10">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          AUTONOMOUS CIVIC-RESPONSE AGENT • BENGALURU
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          BHARAT<span className="text-amber-400">PULSE</span> <span className="text-cyan-400 font-mono">AI</span>
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-slate-200">
          India's AI Operating System for Future Cities
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          "From citizen voice to coordinated action."
          <br />
          <span className="text-slate-300 font-medium">Listen. Understand. Act. Verify.</span>
          <br />
          Cities don't need another dashboard. They need an operating agent.
        </p>

        {/* 3 Core Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={onOpenVoice}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-xl shadow-amber-500/25 active:scale-95"
          >
            <Mic className="w-5 h-5" />
            <span>TALK TO BHARATPULSE</span>
          </button>

          <button
            type="button"
            onClick={onOpenDashboard}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-black text-sm flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>OPEN COMMAND CENTER</span>
          </button>

          <button
            type="button"
            onClick={onRunDemo}
            disabled={isDemoRunning}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 hover:brightness-110 text-white font-black text-sm flex items-center gap-2 transition-all shadow-xl shadow-orange-500/25 active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-5 h-5 fill-current ${isDemoRunning ? 'animate-spin' : ''}`} />
            <span>{isDemoRunning ? 'DEMO IN PROGRESS...' : 'RUN 90-SECOND DEMO'}</span>
          </button>
        </div>
      </div>

      {/* 3 Pillars: LISTEN, UNDERSTAND, ACT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* LISTEN */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl space-y-3 group">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Radio className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
            01 • VOICE LAYER
          </span>
          <h3 className="text-lg font-black text-white">LISTEN</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multilingual natural voice conversation powered by ElevenLabs. Citizens report in English, Hindi, Kannada, Tamil, Telugu, or Bengali with photos and GPS.
          </p>
          <div className="pt-2 text-[11px] text-amber-300 font-semibold flex items-center gap-1">
            <span>Natural Indian Accents & Zero Slop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* UNDERSTAND */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl space-y-3 group">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <Cpu className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
            02 • BRAIN LAYER
          </span>
          <h3 className="text-lg font-black text-white">UNDERSTAND</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gemini multimodal reasoning assesses severity, scans adjacent schools and hospitals, detects spatial infrastructure clusters, and plans tools.
          </p>
          <div className="pt-2 text-[11px] text-cyan-300 font-semibold flex items-center gap-1">
            <span>Autonomous Tool Execution</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* ACT */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl space-y-3 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
            03 • ACTION LAYER
          </span>
          <h3 className="text-lg font-black text-white">ACT & VERIFY</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Node.js backend issues real work orders, computes traffic routes, alerts municipal crews, and enforces photographic and pressure verification before closing.
          </p>
          <div className="pt-2 text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
            <span>Audit Trail & Field Verification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* The 90-Second Demo Showcase Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
              PRIMARY JUDGE EXPERIENCE
            </span>
            <h3 className="text-2xl font-black text-white">
              The 90-Second Live Incident Demonstration
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Experience the complete autonomous loop for a high-priority water leak flooding outside Indiranagar Government High School. Watch Gemini detect the school at 180m, find BWSSB Unit 01, calculate an 8-minute ETA, issue work orders, and verify repair completion with field telemetry.
            </p>
          </div>

          <button
            type="button"
            onClick={onRunDemo}
            disabled={isDemoRunning}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-xl shadow-amber-500/25 active:scale-95 whitespace-nowrap"
          >
            <Play className={`w-5 h-5 fill-current ${isDemoRunning ? 'animate-spin' : ''}`} />
            <span>LAUNCH LIVE DEMO NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
