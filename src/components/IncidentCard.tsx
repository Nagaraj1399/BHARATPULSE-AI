import React from 'react';
import { Incident } from '../../shared/types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock, Users, School, Waves, ChevronRight } from 'lucide-react';

interface IncidentCardProps {
  incident: Incident;
  isSelected?: boolean;
  onSelect?: (incident: Incident) => void;
  onViewDetails?: (id: string) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  isSelected = false,
  onSelect,
  onViewDetails,
}) => {
  const timeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 60000;
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${Math.round(diff)}m ago`;
    return `${Math.round(diff / 60)}h ago`;
  };

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
        isSelected
          ? 'bg-slate-900 border-cyan-400 shadow-md shadow-cyan-500/10'
          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`}
      onClick={() => onSelect?.(incident)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-amber-400">
            {incident.id}
          </span>
          <StatusBadge severity={incident.severity} />
        </div>
        <StatusBadge status={incident.status} />
      </div>

      {/* Description */}
      <p className="text-xs text-slate-200 font-medium mt-2 line-clamp-2 leading-relaxed">
        {incident.description}
      </p>

      {/* Location / Address */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 truncate">
        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
        <span className="truncate">{incident.address || `${incident.latitude}, ${incident.longitude}`}</span>
      </div>

      {/* Cluster Warning Pill if detected */}
      {incident.clusterHypothesis && (
        <div className="mt-2 flex items-center gap-1 px-2 py-0.5 rounded bg-orange-950/60 border border-orange-500/40 text-[10px] text-orange-300 font-semibold">
          <Waves className="w-3 h-3 text-orange-400 animate-pulse" />
          <span>NETWORK-LEVEL RISK DETECTED</span>
        </div>
      )}

      {/* Nearby School/Facility Tag */}
      {incident.criticalFacilities && incident.criticalFacilities.length > 0 && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 truncate">
          <School className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{incident.criticalFacilities[0].name}</span>
          <span className="text-slate-400">({incident.criticalFacilities[0].distanceMeters}m)</span>
        </div>
      )}

      {/* Footer Metrics & Actions */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          {incident.assignedTeamName ? (
            <span className="flex items-center gap-1 text-cyan-400 font-medium">
              <Users className="w-3 h-3" />
              <span className="truncate max-w-[110px]">{incident.assignedTeamName}</span>
            </span>
          ) : (
            <span className="text-slate-500">Unassigned</span>
          )}

          {incident.etaMinutes && (
            <span className="flex items-center gap-1 text-amber-400 font-mono font-semibold">
              <Clock className="w-3 h-3" />
              {incident.etaMinutes}m ETA
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-mono">{timeAgo(incident.createdAt)}</span>
          {onViewDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(incident.id);
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
              title="Inspect Incident Deep Dive"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
