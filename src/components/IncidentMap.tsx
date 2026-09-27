import React, { useState, useMemo } from 'react';
import { Incident, ResponseTeam, CriticalFacility, RiskZone } from '../../shared/types';
import { SEVERITY_CONFIG, BENGALURU_CENTER } from '../../shared/schemas';
import { Shield, School, Hospital, Navigation, Waves, MapPin, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface IncidentMapProps {
  incidents: Incident[];
  teams?: ResponseTeam[];
  facilities?: CriticalFacility[];
  riskZones?: RiskZone[];
  selectedIncident?: Incident | null;
  onSelectIncident?: (incident: Incident) => void;
  showRiskZones?: boolean;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  teams = [],
  facilities = [],
  riskZones = [],
  selectedIncident,
  onSelectIncident,
  showRiskZones = true,
}) => {
  const [zoom, setZoom] = useState(1);
  const [filterType, setFilterType] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<{
    title: string;
    type: string;
    detail: string;
    x: number;
    y: number;
  } | null>(null);

  // Map bounding box around Bengaluru urban area
  // Lat: 12.82 to 13.06, Lng: 77.50 to 77.76
  const bounds = {
    minLat: 12.83,
    maxLat: 13.04,
    minLng: 77.52,
    maxLng: 77.74,
  };

  // Converts geographic (lat, lng) to canvas percentages (0 - 100%)
  const toCoords = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    // Latitude decreases as you go south
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return {
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(4, Math.min(96, y)),
    };
  };

  const filteredIncidents = useMemo(() => {
    if (filterType === 'all') return incidents;
    if (filterType === 'critical')
      return incidents.filter((i) => i.severity === 'HIGH' || i.severity === 'CRITICAL');
    if (filterType === 'active') return incidents.filter((i) => i.status !== 'RESOLVED');
    return incidents.filter((i) => i.type === filterType);
  }, [incidents, filterType]);

  // Major Bengaluru Road Network Grid for vector overlay
  const roadGrid = [
    { name: 'Outer Ring Road (ORR)', path: 'M 15 25 Q 40 45 75 75 Q 85 55 90 20' },
    { name: 'Old Airport Road', path: 'M 45 42 L 80 50' },
    { name: 'Hosur Road / Silk Board', path: 'M 48 55 L 60 90' },
    { name: '100 Feet Road Indiranagar', path: 'M 62 30 L 66 45' },
    { name: 'MG Road Corridor', path: 'M 40 40 L 58 38' },
  ];

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 pointer-events-auto">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="text-xs font-bold text-slate-200">BENGALURU TACTICAL MAP</span>
          <span className="text-[10px] text-slate-500 font-mono">12.9716° N, 77.5946° E</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({incidents.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('critical')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
              filterType === 'critical'
                ? 'bg-rose-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            High Risk
          </button>
          <button
            type="button"
            onClick={() => setFilterType('active')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
              filterType === 'active'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Map Surface (Vector Canvas) */}
      <div
        className="relative flex-1 w-full h-full bg-[#070b14] overflow-hidden select-none transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Subtle Military/Civic Coordinate Grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Animated Radar Sweep Overlay */}
        <div className="absolute -inset-[50%] bg-[conic-gradient(from_0deg,transparent_0_320deg,rgba(6,182,212,0.08)_360deg)] animate-[spin_10s_linear_infinite] pointer-events-none rounded-full" />

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Major Urban Arteries */}
          {roadGrid.map((road, idx) => (
            <path
              key={idx}
              d={road.path}
              fill="none"
              stroke="#1e293b"
              strokeWidth="2.5"
              strokeDasharray="4,4"
              className="opacity-70"
            />
          ))}

          {/* Active Incident Response Route Polyline */}
          {selectedIncident?.routeCoordinates && selectedIncident.routeCoordinates.length > 1 && (
            <polyline
              points={selectedIncident.routeCoordinates
                .map((pt) => {
                  const c = toCoords(pt[0], pt[1]);
                  return `${c.x}%,${c.y}%`;
                })
                .join(' ')}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse shadow-lg"
            />
          )}
        </svg>

        {/* Risk Zones (Heat Polygons) */}
        {showRiskZones &&
          riskZones.map((zone) => {
            const pos = toCoords(zone.latitude, zone.longitude);
            const isHigh = zone.riskLevel === 'HIGH' || zone.riskLevel === 'SEVERE';
            return (
              <div
                key={zone.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onMouseEnter={() =>
                  setHoveredItem({
                    title: zone.name,
                    type: `Risk Zone: ${zone.category.replace('_', ' ')}`,
                    detail: `${zone.riskLevel} Risk • ${zone.contributingSignals[0] || ''}`,
                    x: pos.x,
                    y: pos.y,
                  })
                }
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border transition-all ${
                    isHigh
                      ? 'border-orange-500/40 bg-orange-500/10 animate-pulse'
                      : 'border-cyan-500/30 bg-cyan-500/5'
                  }`}
                />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono uppercase tracking-wider text-slate-400 opacity-60">
                  {zone.category.split('_')[0]}
                </span>
              </div>
            );
          })}

        {/* Critical Facilities (Schools, Hospitals, Metro) */}
        {facilities.map((facility) => {
          const pos = toCoords(facility.latitude, facility.longitude);
          const isSchool = facility.type === 'school';
          const isHospital = facility.type === 'hospital';
          return (
            <div
              key={facility.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto cursor-pointer group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseEnter={() =>
                setHoveredItem({
                  title: facility.name,
                  type: facility.type.toUpperCase(),
                  detail: (facility as any).vulnerabilityNotes || facility.vicinity || '',
                  x: pos.x,
                  y: pos.y,
                })
              }
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                className={`p-1.5 rounded-lg border shadow-lg transition-transform group-hover:scale-125 ${
                  isSchool
                    ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                    : isHospital
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                    : 'bg-slate-900/80 border-slate-700 text-slate-300'
                }`}
              >
                {isSchool ? (
                  <School className="w-3.5 h-3.5" />
                ) : isHospital ? (
                  <Hospital className="w-3.5 h-3.5" />
                ) : (
                  <Shield className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          );
        })}

        {/* Municipal Response Teams (Blue Markers) */}
        {teams.map((team) => {
          const pos = toCoords(team.latitude, team.longitude);
          const isAvail = team.availability === 'AVAILABLE';
          return (
            <div
              key={team.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-auto cursor-pointer group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseEnter={() =>
                setHoveredItem({
                  title: team.name,
                  type: `Team: ${team.department}`,
                  detail: `Status: ${team.availability} • Active Load: ${team.currentLoad}`,
                  x: pos.x,
                  y: pos.y,
                })
              }
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative">
                {isAvail && (
                  <div className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping" />
                )}
                <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white/80 shadow-md shadow-blue-500/40 flex items-center justify-center text-white transition-transform group-hover:scale-125">
                  <Navigation className="w-3 h-3 rotate-45" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Incident Markers (Color Coded by Severity) */}
        {filteredIncidents.map((incident) => {
          const pos = toCoords(incident.latitude, incident.longitude);
          const isSelected = selectedIncident?.id === incident.id;
          const config = SEVERITY_CONFIG[incident.severity];

          return (
            <div
              key={incident.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto cursor-pointer transition-all duration-200 ${
                isSelected ? 'scale-135 z-30' : 'hover:scale-120'
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => onSelectIncident?.(incident)}
              onMouseEnter={() =>
                setHoveredItem({
                  title: `${incident.id}: ${incident.type.replace('_', ' ')}`,
                  type: `${incident.severity} PRIORITY • ${incident.status}`,
                  detail: incident.description,
                  x: pos.x,
                  y: pos.y,
                })
              }
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative flex items-center justify-center">
                {/* Active Ripple for High/Critical */}
                {(incident.severity === 'HIGH' || incident.severity === 'CRITICAL') &&
                  incident.status !== 'RESOLVED' && (
                    <div
                      className="absolute -inset-2 rounded-full animate-ping opacity-50"
                      style={{ backgroundColor: config.color }}
                    />
                  )}

                {/* Marker Body */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white/90 text-slate-950 font-bold text-[10px]"
                  style={{
                    backgroundColor: config.color,
                    boxShadow: isSelected ? `0 0 20px ${config.color}` : undefined,
                  }}
                >
                  <MapPin className="w-4 h-4 fill-slate-950 stroke-white" />
                </div>

                {/* Assigned Team ETA Tag */}
                {incident.etaMinutes && incident.status !== 'RESOLVED' && (
                  <span className="absolute -bottom-4 bg-slate-950/90 text-cyan-300 font-mono text-[9px] px-1 py-0.2 rounded border border-cyan-500/40 whitespace-nowrap shadow-sm">
                    {incident.etaMinutes}m ETA
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Hovered Card Tooltip */}
        {hoveredItem && (
          <div
            className="absolute z-40 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl text-xs max-w-xs pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${Math.max(18, Math.min(82, hoveredItem.x))}%`,
              top: `${Math.max(22, hoveredItem.y)}%`,
            }}
          >
            <div className="font-bold text-white text-xs">{hoveredItem.title}</div>
            <div className="text-[10px] text-amber-400 font-semibold uppercase mt-0.5">
              {hoveredItem.type}
            </div>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {hoveredItem.detail}
            </p>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="px-4 py-2 bg-slate-950/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">Legend:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Response Team
          </span>
          <span className="flex items-center gap-1">
            <School className="w-3.5 h-3.5 text-amber-400" /> Critical Facility
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.9, z - 0.15))}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
