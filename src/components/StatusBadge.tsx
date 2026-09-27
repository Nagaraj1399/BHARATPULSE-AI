import React from 'react';
import { IncidentSeverity, IncidentStatus, TeamAvailability } from '../../shared/types';
import { SEVERITY_CONFIG } from '../../shared/schemas';

interface StatusBadgeProps {
  status?: IncidentStatus;
  severity?: IncidentSeverity;
  availability?: TeamAvailability;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  severity,
  availability,
  className = '',
}) => {
  if (severity) {
    const config = SEVERITY_CONFIG[severity];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.badgeClass} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.pingClass}`} />
        {config.label}
      </span>
    );
  }

  if (availability) {
    const isAvail = availability === 'AVAILABLE';
    const isDisp = availability === 'DISPATCHED' || availability === 'ON_SCENE';
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          isAvail
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : isDisp
            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
            : 'bg-slate-700/30 text-slate-400 border-slate-700'
        } ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isAvail ? 'bg-emerald-400 animate-pulse' : isDisp ? 'bg-cyan-400' : 'bg-slate-500'
          }`}
        />
        {availability.replace('_', ' ')}
      </span>
    );
  }

  if (status) {
    const isResolved = status === 'RESOLVED';
    const isEscalated = status === 'ESCALATED';
    const isVerifying = status === 'VERIFYING';
    const isDispatched = status === 'DISPATCHED' || status === 'ON_SITE';
    const isAnalyzing = status === 'ANALYZING' || status === 'INVESTIGATING';

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${
          isResolved
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : isEscalated
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
            : isVerifying
            ? 'bg-purple-500/15 text-purple-300 border-purple-500/40'
            : isDispatched
            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
            : isAnalyzing
            ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse'
            : 'bg-slate-800 text-slate-300 border-slate-700'
        } ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isResolved
              ? 'bg-emerald-400'
              : isEscalated
              ? 'bg-rose-500'
              : isVerifying
              ? 'bg-purple-400'
              : isDispatched
              ? 'bg-cyan-400'
              : isAnalyzing
              ? 'bg-amber-400'
              : 'bg-slate-400'
          }`}
        />
        {status.replace('_', ' ')}
      </span>
    );
  }

  return null;
};
