import React, { useState } from 'react';
import { RiskZone, Incident } from '../../shared/types';
import { ShieldAlert, Waves, Zap, Flame, AlertTriangle, Sun, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

interface RiskMapProps {
  riskZones: RiskZone[];
  incidents: Incident[];
  onSelectZone?: (zone: RiskZone) => void;
}

export const RiskMap: React.FC<RiskMapProps> = ({ riskZones, incidents, onSelectZone }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(riskZones[0] || null);

  const categories = [
    { id: 'ALL', label: 'All Hazards', icon: Layers },
    { id: 'FLOODING', label: 'Urban Flooding', icon: Waves },
    { id: 'WATER_INFRASTRUCTURE', label: 'Water Infrastructure', icon: Waves },
    { id: 'ROAD_HAZARDS', label: 'Roadbed & Pavements', icon: AlertTriangle },
    { id: 'ELECTRICAL_GRID', label: 'Electrical Grid', icon: Zap },
    { id: 'HEAT_ISLAND', label: 'Heat Island Distress', icon: Sun },
  ];

  const filteredZones = selectedCategory === 'ALL'
    ? riskZones
    : riskZones.filter((z) => z.category === selectedCategory);

  const clusteredIncidents = incidents.filter((i) => !!i.clusterHypothesis);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase border border-rose-500/40">
              PROTOTYPE RISK MODEL
            </span>
            <span className="text-xs text-slate-400 font-mono">BENGALURU 2030 RESILIENCE SIMULATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            City Risk Intelligence & Predictive Vulnerability
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Synthesizes real-time citizen reports, weather forecasts, infrastructure telemetry, and machine learning models to forecast civic failures before they cascade.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">Active Risk Zones</span>
            <span className="text-xl font-bold text-amber-400">{riskZones.length}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">Network Clusters</span>
            <span className="text-xl font-bold text-orange-400">{clusteredIncidents.length}</span>
          </div>
        </div>
      </div>

      {/* Network Anomaly Alert Banner if incidents clustered */}
      {clusteredIncidents.length > 0 && (
        <div className="p-4 rounded-xl bg-orange-950/40 border-2 border-orange-500/50 shadow-xl shadow-orange-500/10">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-orange-300">
                  NETWORK-LEVEL RISK DETECTED
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-900/60 text-orange-200 border border-orange-700">
                  {clusteredIncidents.length} Coupled Incidents
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium mt-1 leading-relaxed">
                {clusteredIncidents[0]?.clusterHypothesis ||
                  'Multiple similar incidents are geographically clustered within a 1.8km radius. This indicates a potential shared municipal infrastructure trunk line failure rather than isolated anomalies.'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {clusteredIncidents.map((inc) => (
                  <span
                    key={inc.id}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                  >
                    {inc.id}: {inc.type} ({inc.severity})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hazard Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Zones List & Deep Dive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zones List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Identified Risk Sectors ({filteredZones.length})
          </h4>
          {filteredZones.map((zone) => {
            const isSelected = selectedZone?.id === zone.id;
            const isHigh = zone.riskLevel === 'HIGH' || zone.riskLevel === 'SEVERE';
            return (
              <div
                key={zone.id}
                onClick={() => {
                  setSelectedZone(zone);
                  onSelectZone?.(zone);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/70 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{zone.id}</span>
                    <h5 className="text-xs font-bold text-white mt-0.5">{zone.name}</h5>
                    <span className="text-[10px] text-cyan-400 font-semibold uppercase">
                      {zone.category.replace('_', ' ')}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {zone.riskLevel}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Radius: {zone.radiusMeters}m</span>
                  <span className="text-amber-400 font-mono flex items-center gap-0.5">
                    Inspect <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Zone Deep Dive Panel */}
        {selectedZone && (
          <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-amber-400 font-bold">{selectedZone.id}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                    {selectedZone.latitude.toFixed(4)}° N, {selectedZone.longitude.toFixed(4)}° E
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">{selectedZone.name}</h3>
                <span className="text-xs text-cyan-400 font-bold uppercase">
                  Category: {selectedZone.category.replace('_', ' ')}
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase">{selectedZone.riskLevel} Risk</span>
              </div>
            </div>

            {/* Contributing Operational Signals */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Contributing Signals & Hazard Triggers
              </h5>
              <div className="space-y-2">
                {selectedZone.contributingSignals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-200 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{sig}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Autonomous Recommended Mitigation Actions */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Autonomous Recommended Mitigation Protocols
              </h5>
              <div className="space-y-2">
                {selectedZone.recommendedActions.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Model updated: {new Date(selectedZone.lastUpdated).toLocaleDateString()}</span>
              <span className="text-amber-400">BharatPulse Municipal Threat Engine</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
