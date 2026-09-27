import React from 'react';
import { ResponseTeam } from '../../shared/types';
import { StatusBadge } from './StatusBadge';
import { Shield, MapPin, Phone, Truck, Wrench } from 'lucide-react';

interface ResponseTeamCardProps {
  team: ResponseTeam;
  isAssigned?: boolean;
}

export const ResponseTeamCard: React.FC<ResponseTeamCardProps> = ({ team, isAssigned = false }) => {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        isAssigned
          ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
          : 'bg-slate-900/80 border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-slate-500 uppercase">{team.id}</span>
            {isAssigned && (
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[9px] uppercase border border-cyan-500/30">
                Assigned
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-white mt-0.5">{team.name}</h4>
          <p className="text-xs text-amber-400 font-medium">{team.department}</p>
        </div>
        <StatusBadge availability={team.availability} />
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Distance</span>
          <span className="font-mono font-bold text-slate-200">
            {team.distanceKm ? `${team.distanceKm} km` : '2.4 km'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Current Load</span>
          <span className="font-mono font-bold text-slate-200">{team.currentLoad} incidents</span>
        </div>
      </div>

      {/* Capabilities Tags */}
      <div className="mt-3">
        <span className="text-[10px] text-slate-500 uppercase block mb-1">Capabilities</span>
        <div className="flex flex-wrap gap-1">
          {team.capabilities.map((cap, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* Vehicle and Phone Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Truck className="w-3 h-3 text-slate-500" />
          {team.vehicleId || 'KA-01-EQ-1002'}
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <Phone className="w-3 h-3 text-slate-500" />
          {team.contactPhone || '+91 80 2294 5100'}
        </span>
      </div>
    </div>
  );
};
