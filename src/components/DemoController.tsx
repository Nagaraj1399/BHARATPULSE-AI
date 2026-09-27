import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, FastForward, Volume2, ShieldCheck, AlertCircle } from 'lucide-react';
import { speakConfirmedText, stopSpeaking } from '../lib/elevenlabs';

interface DemoControllerProps {
  isRunning: boolean;
  onStartDemo: () => Promise<void>;
  onVerifyStep?: () => Promise<void>;
  onReset: () => Promise<void>;
  currentStepIndex: number;
  totalSteps: number;
  stepName?: string;
  confirmedNarration?: string;
}

export const DemoController: React.FC<DemoControllerProps> = ({
  isRunning,
  onStartDemo,
  onVerifyStep,
  onReset,
  currentStepIndex,
  totalSteps,
  stepName,
  confirmedNarration,
}) => {
  const steps = [
    { title: 'Citizen Voice Intake', desc: 'Voice: "There is a major water leak outside a school and the road is flooding."' },
    { title: 'Gemini Multimodal Analysis', desc: 'Classification: WATER_LEAK / HIGH PRIORITY. Immediate safety hazard.' },
    { title: 'Critical Infrastructure Scan', desc: 'School Detected: Indiranagar Govt High School at 180m.' },
    { title: 'Response Team Selection', desc: 'BWSSB Rapid Water Unit 01 selected based on capabilities & proximity.' },
    { title: 'Traffic Route & ETA', desc: 'Route calculated: 2.4 km via 100ft road. ETA: 8 minutes.' },
    { title: 'Work Order & Team Dispatch', desc: 'Work Order WO-BWSSB-2048 generated & radio alert sent to field squad.' },
    { title: 'Network-Level Risk Check', desc: 'Cluster hypothesis: 3 related water incidents detected in sector.' },
    { title: 'On-Site Verification & Resolution', desc: 'Field evidence verified: Valve sealed, water drained, incident resolved!' },
  ];

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / totalSteps) * 100));

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-amber-500/40 p-4 sm:p-5 shadow-2xl shadow-amber-500/10 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono text-[10px] uppercase border border-amber-500/40">
              90-SECOND HACKATHON DEMO CONTROLLER
            </span>
            {isRunning && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                LIVE AUTONOMOUS AGENT ACTIVE
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            "Listen. Understand. Act. Verify."
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Observes real-world problem, investigates critical facilities, assigns team, and verifies resolution.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onStartDemo}
            disabled={isRunning}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg ${
              isRunning
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-amber-500/25 active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'AGENT EXECUTING...' : 'RUN 90s DEMO'}</span>
          </button>

          {onVerifyStep && (
            <button
              type="button"
              onClick={onVerifyStep}
              className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1 transition-all"
              title="Trigger Final Resolution Verification Step"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verify & Resolve</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Reset All Incidents to Default Seed State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span>
            STEP {Math.min(currentStepIndex + 1, totalSteps)} OF {totalSteps}: {stepName || steps[Math.min(currentStepIndex, steps.length - 1)]?.title}
          </span>
          <span className="text-amber-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Confirmed Voice Narration Banner */}
      {confirmedNarration && (
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-500/40 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-cyan-300 font-medium">
            <Volume2 className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
            <span className="text-slate-100 font-semibold italic">"{confirmedNarration}"</span>
          </div>
          <button
            type="button"
            onClick={() => speakConfirmedText(confirmedNarration)}
            className="px-2 py-1 rounded bg-cyan-500 text-slate-950 font-bold text-[10px] hover:brightness-110 flex-shrink-0"
          >
            Replay Voice
          </button>
        </div>
      )}

      {/* Horizontal Mini-Steps Visualizer */}
      <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-1 text-center">
        {steps.map((st, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={idx}
              className={`p-1.5 rounded-lg border text-[10px] transition-all ${
                isCurrent
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm'
                  : isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="font-mono text-[9px] text-slate-500">0{idx + 1}</div>
              <div className="truncate">{st.title.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
