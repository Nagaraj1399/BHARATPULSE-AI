import React, { useState } from 'react';
import { Incident, ResponseTeam, CriticalFacility, RiskZone, AgentAction } from '../../shared/types';
import { MetricsPanel } from './MetricsPanel';
import { IncidentMap } from './IncidentMap';
import { AgentActivity } from './AgentActivity';
import { IncidentCard } from './IncidentCard';
import { Activity, Filter, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

interface CommandCenterProps {
  incidents: Incident[];
  teams: ResponseTeam[];
  facilities: CriticalFacility[];
  riskZones: RiskZone[];
  actions: AgentAction[];
  selectedIncident: Incident | null;
  onSelectIncident: (inc: Incident) => void;
  onViewDetails: (id: string) => void;
  onRefresh: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  incidents,
  teams,
  facilities,
  riskZones,
  actions,
  selectedIncident,
  onSelectIncident,
  onViewDetails,
  onRefresh,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.type.toLowerCase().includes(q) ||
        (inc.address && inc.address.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              CITY RESILIENCE COMMAND CENTER
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              AUTONOMOUS OPS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial coordination, automated work orders & verified civic incident resolution.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sync State</span>
        </button>
      </div>

      {/* Top Telemetry Metrics Panel */}
      <MetricsPanel incidents={incidents} teams={teams} />

      {/* Main Grid: Interactive Tactical Map + Live AI Agent Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left & Center: Tactical Map (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <IncidentMap
            incidents={incidents}
            teams={teams}
            facilities={facilities}
            riskZones={riskZones}
            selectedIncident={selectedIncident}
            onSelectIncident={onSelectIncident}
          />

          {/* Quick Active Selection Preview Banner */}
          {selectedIncident && (
            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {selectedIncident.id}
                  </span>
                  <span className="text-xs font-bold text-white uppercase">
                    {selectedIncident.type.replace('_', ' ')}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                    {selectedIncident.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  {selectedIncident.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onViewDetails(selectedIncident.id)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap self-start sm:self-auto"
              >
                <span>View Full Audit Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live AI Agent Telemetry Activity */}
        <div className="lg:col-span-1 h-[540px]">
          <AgentActivity actions={actions} />
        </div>
      </div>

      {/* Bottom Area: Incident Queue & Filters */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Live Municipal Incident Queue ({filteredIncidents.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Auto-dispatched via Gemini tools
            </span>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  filterSeverity === sev
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Incident Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncidents.slice(0, 9).map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              isSelected={selectedIncident?.id === incident.id}
              onSelect={onSelectIncident}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
