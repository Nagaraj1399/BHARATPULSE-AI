import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import { speakConfirmedText } from '../lib/voicePlayback';
import { AIAvatar } from './AIAvatar';
import { PersonaId } from '../lib/aiPersonas';
import { soundFx } from '../lib/soundFx';

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

interface DemoStepInfo {
  step: number;
  personaId: PersonaId;
  title: string;
  desc: string;
  tag: string;
}

export const DemoController: React.FC<DemoControllerProps> = ({
  isRunning,
  onStartDemo,
  onVerifyStep,
  onReset,
  currentStepIndex,
  totalSteps = 10,
  stepName,
  confirmedNarration,
}) => {
  const steps: DemoStepInfo[] = [
    {
      step: 1,
      personaId: 'setu',
      title: 'Citizen Voice Intake',
      desc: 'Citizen speaks to SETU: "There is a major water leak outside a school and the road is flooding." SETU: "I\'ve understood the report. Checking city conditions."',
      tag: 'SETU VOICE',
    },
    {
      step: 2,
      personaId: 'jal',
      title: 'Hydrological Signal',
      desc: 'JAL assesses water infrastructure anomaly: 450mm distribution feeder rupture, high severity.',
      tag: 'JAL WATER',
    },
    {
      step: 3,
      personaId: 'drishti',
      title: 'Cluster & Risk Pattern',
      desc: 'DRISHTI correlates 4 nearby reports within 1.8km: POSSIBLE NETWORK EVENT detected.',
      tag: 'DRISHTI CLUSTER',
    },
    {
      step: 4,
      personaId: 'raksha',
      title: 'Vulnerability Buffer Scan',
      desc: 'RAKSHA identifies Indiranagar Govt High School at 180m; prioritizes life-safety containment.',
      tag: 'RAKSHA SAFETY',
    },
    {
      step: 5,
      personaId: 'pulse',
      title: 'Response Team & Traffic Route',
      desc: 'BWSSB Rapid Water Unit 01 selected; dynamic road network route calculated: Confirmed ETA 8m.',
      tag: 'MUNICIPAL SQUAD',
    },
    {
      step: 6,
      personaId: 'pulse',
      title: 'Autonomous Work Order',
      desc: 'PULSE coordinates dispatch: Work Order WO-BWSSB-2048 issued and broadcast to field squad.',
      tag: 'WORK ORDER',
    },
    {
      step: 7,
      personaId: 'pulse',
      title: 'City Shield Authorization',
      desc: 'All 6 autonomous tool invocations cryptographically logged and signed on the AI Action Ledger.',
      tag: 'CITY SHIELD',
    },
    {
      step: 8,
      personaId: 'raksha',
      title: 'Field Verification Request',
      desc: 'Technician on-site repair checklist and photographic requirement triggered.',
      tag: 'VERIFY GATE',
    },
    {
      step: 9,
      personaId: 'pulse',
      title: 'Verified Resolution',
      desc: 'Visual ground truth validated: sleeve welding complete, valve sealed, road cleared. Status: RESOLVED.',
      tag: 'RESOLVED',
    },
    {
      step: 10,
      personaId: 'pulse',
      title: 'India 2030 Closed Loop',
      desc: 'LISTEN · UNDERSTAND · PREDICT · ACT · VERIFY · LEARN. City memory updated to prevent repeat failure.',
      tag: 'FUTURE 2030',
    },
  ];

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];
  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / totalSteps) * 100));

  return (
    <div className="bg-[#090D16] border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-2xl mb-6 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <AIAvatar
            personaId={currentStep.personaId}
            size="sm"
            state={isRunning ? 'acting' : 'idle'}
            showBadge={false}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold font-mono text-[10px] uppercase border border-amber-500/40">
                90-SECOND HACKATHON DEMO · 2030
              </span>
              {isRunning && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  AUTONOMOUS AGENT ACTIVE
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              "Listen. Understand. Predict. Act. Verify. Learn."
            </h3>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playSignalReceived();
              onStartDemo();
            }}
            disabled={isRunning}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg ${
              isRunning
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-amber-500/25 active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'AGENT EXECUTING...' : 'RUN 90s DEMO'}</span>
          </button>

          {onVerifyStep && (
            <button
              type="button"
              onClick={() => {
                soundFx.playActionConfirmed();
                onVerifyStep();
              }}
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

      {/* Active Step Highlight Box */}
      <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold shrink-0 mt-0.5">
          STEP 0{currentStep.step} / 10
        </div>
        <div>
          <span className="text-xs font-bold text-white block">
            {currentStep.title} ({currentStep.tag})
          </span>
          <p className="text-xs text-slate-300 mt-0.5">{currentStep.desc}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span>{stepName || currentStep.title}</span>
          <span className="text-amber-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Confirmed Voice Narration Banner */}
      {confirmedNarration && (
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/40 text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-indigo-300 font-medium">
            <Volume2 className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-pulse" />
            <span className="text-slate-100 font-semibold italic">"{confirmedNarration}"</span>
          </div>
          <button
            type="button"
            onClick={() => speakConfirmedText(confirmedNarration)}
            className="px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px] hover:brightness-110 flex-shrink-0"
          >
            Replay Voice
          </button>
        </div>
      )}

      {/* Horizontal 10-Step Timeline Dots */}
      <div className="mt-3 grid grid-cols-5 sm:grid-cols-10 gap-1 text-center font-mono">
        {steps.map((st, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={idx}
              className={`p-1.5 rounded-lg border text-[9px] transition-all truncate ${
                isCurrent
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div>0{idx + 1}</div>
              <div className="truncate text-[8px]">{st.tag.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
