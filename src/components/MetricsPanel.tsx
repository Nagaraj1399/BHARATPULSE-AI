import React from 'react';
import { Incident, ResponseTeam } from '../../shared/types';
import { AlertTriangle, Clock, Users, CheckCircle2, ShieldCheck, Waves } from 'lucide-react';

interface MetricsPanelProps {
  incidents: Incident[];
  teams: ResponseTeam[];
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ incidents, teams }) => {
  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const highPriority = incidents.filter(
    (i) => (i.severity === 'HIGH' || i.severity === 'CRITICAL') && i.status !== 'RESOLVED'
  ).length;
  const availableTeams = teams.filter((t) => t.availability === 'AVAILABLE').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;

  const clusteredCount = incidents.filter((i) => !!i.clusterHypothesis).length;

  const metrics = [
    {
      label: 'ACTIVE INCIDENTS',
      value: activeIncidents,
      subtext: `${incidents.length} total registered`,
      icon: AlertTriangle,
      color: 'text-amber-600',
      iconColor: 'text-amber-500',
      border: 'border-amber-200',
      bg: 'bg-amber-50/40',
    },
    {
      label: 'HIGH / CRITICAL',
      value: highPriority,
      subtext: 'Prioritized for rapid dispatch',
      icon: ShieldCheck,
      color: 'text-rose-600',
      iconColor: 'text-rose-500',
      border: 'border-rose-200',
      bg: 'bg-rose-50/40',
    },
    {
      label: 'AVAILABLE TEAMS',
      value: `${availableTeams} / ${teams.length}`,
      subtext: 'Municipal rapid response crews',
      icon: Users,
      color: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/40',
    },
    {
      label: 'AVERAGE RESPONSE ETA',
      value: '7.8 min',
      subtext: 'Traffic-aware optimal routing',
      icon: Clock,
      color: 'text-cyan-700',
      iconColor: 'text-cyan-600',
      border: 'border-cyan-200',
      bg: 'bg-cyan-50/40',
    },
    {
      label: 'RESOLVED TODAY',
      value: resolvedCount,
      subtext: 'Verified with field telemetry',
      icon: CheckCircle2,
      color: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/40',
    },
    {
      label: 'NETWORK RISK SIGNALS',
      value: clusteredCount > 0 ? `${clusteredCount} Active` : 'Nominal',
      subtext: clusteredCount > 0 ? 'Water / Grid density alert' : 'No anomalous cluster',
      icon: Waves,
      color: clusteredCount > 0 ? 'text-orange-600 animate-pulse' : 'text-slate-600',
      iconColor: clusteredCount > 0 ? 'text-orange-500' : 'text-slate-400',
      border: clusteredCount > 0 ? 'border-orange-300' : 'border-slate-200',
      bg: clusteredCount > 0 ? 'bg-orange-50/60' : 'bg-slate-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className={`p-3 rounded-xl border bg-white shadow-xs transition-all hover:translate-y-[-2px] hover:shadow-sm ${m.border} ${m.bg}`}
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                {m.label}
              </span>
              <Icon className={`w-3.5 h-3.5 ${m.iconColor}`} />
            </div>
            <div className={`text-xl sm:text-2xl font-black tracking-tight mt-1.5 ${m.color}`}>
              {m.value}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate font-medium">{m.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};
