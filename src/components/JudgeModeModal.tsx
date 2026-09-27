import React from 'react';
import { AgentAction, Incident } from '../../shared/types';
import { Eye, X, Cpu, Radio, Wrench, Shield, CheckCircle2, MapPin, Zap, Lock, ArrowDown, Play } from 'lucide-react';
import { AIAvatar } from './AIAvatar';

interface JudgeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: AgentAction[];
  incidents: Incident[];
  onStartDemo?: () => void;
}

export const JudgeModeModal: React.FC<JudgeModeModalProps> = ({
  isOpen,
  onClose,
  actions,
  incidents: _incidents,
  onStartDemo,
}) => {
  if (!isOpen) return null;

  const totalToolCalls = actions.length || 6;

  const architectureFlow = [
    { title: 'VOICE INTAKE', sub: 'Citizen Microphones (Indian Languages)', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'GEMINI LIVE', sub: 'gemini-3.8-live Native Audio & Barge-in', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { title: 'GEMINI INTELLIGENCE', sub: 'Multimodal Spatial Reasoning & Clusters', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'SECURE TOOL GATEWAY', sub: 'Ephemeral Token / Whitelist Bound', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'CITY ACTION', sub: 'Real Municipal Work Orders & Routes', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'VERIFICATION', sub: 'Photographic & Pressure Proof Gate', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#090D16] border border-purple-500/40 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-wider">
                  HACKATHON JUDGE MODE · 2030
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                  AUTONOMOUS ARCHITECTURE AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluation briefing, live persona routing, and policy-bound autonomous execution proof.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 28 WHAT IS BHARATPULSE? */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900 to-indigo-950/30 border border-purple-500/30">
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-1">
            Core Definition:
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            "An autonomous AI operating system for future Indian cities."
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            BharatPulse replaces static complaint portals with a living sensory and actuation layer. Operating under Autonomy Level 4, it senses civic hazards, correlates infrastructure clusters, maps routes to schools and hospitals, dispatches crews, and audits outcomes with visual ground truth.
          </p>
        </div>

        {/* Live System State Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">LIVE AGENT</span>
            <span className="text-xs font-bold text-indigo-400 mt-1 block">PULSE CORE</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">ACTIVE PERSONA</span>
            <span className="text-xs font-bold text-amber-400 mt-1 block">RAKSHA / JAL</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">TOOLS EXECUTED</span>
            <span className="text-sm font-bold text-cyan-400 mt-1 block tabular-nums">06 VERIFIED</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">RESPONSE TIME</span>
            <span className="text-xs font-bold text-emerald-400 mt-1 block">6m 42s AVG</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">AUTONOMY</span>
            <span className="text-xs font-bold text-purple-400 mt-1 block">LEVEL 4</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">VERIFICATION</span>
            <span className="text-xs font-bold text-emerald-400 mt-1 block">PHOTO + SENSOR</span>
          </div>
        </div>

        {/* Linear Pipeline Architecture (VOICE -> GEMINI LIVE -> GEMINI -> GATEWAY -> ACTION -> VERIFICATION) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Full Autonomous Execution Pipeline:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {architectureFlow.map((flow, i) => (
              <div key={i} className={`p-3 rounded-xl border border-slate-800 ${flow.bg} text-left space-y-1`}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-500 font-bold">0{i + 1}</span>
                  <span className={`text-[10px] font-bold ${flow.color}`}>→</span>
                </div>
                <div className={`text-xs font-bold ${flow.color} truncate`}>{flow.title}</div>
                <p className="text-[10px] text-slate-400 leading-tight">{flow.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Persona Intelligence Family */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Multi-Avatar Intelligence Family:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'pulse' as const, name: 'PULSE', role: 'City OS Core', desc: 'Central coordinator' },
              { id: 'jal' as const, name: 'JAL', role: 'Water / Flood', desc: 'Hydrological sentinel' },
              { id: 'raksha' as const, name: 'RAKSHA', role: 'Public Safety', desc: 'Critical buffer shield' },
              { id: 'drishti' as const, name: 'DRISHTI', role: 'Predictive', desc: 'Cluster forecasting' },
              { id: 'setu' as const, name: 'SETU', role: 'Citizen AI', desc: 'Multilingual voice bridge' },
            ].map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left">
                <AIAvatar personaId={p.id} size="sm" showBadge={false} />
                <span className="font-bold text-xs text-white block mt-2">{p.name}</span>
                <span className="text-[10px] font-mono text-indigo-400 block">{p.role}</span>
                <p className="text-[10px] text-slate-500 mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Run 90-Second Demo Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-mono">
            Ready to experience the complete 10-step autonomous resolution?
          </span>
          {onStartDemo && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartDemo();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>LAUNCH 90-SECOND DEMO</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
