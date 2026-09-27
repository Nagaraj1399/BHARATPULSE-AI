import React, { useState, useEffect } from 'react';
import { Incident, AgentAction, NotificationItem, ResponseTeam } from '../../shared/types';
import { StatusBadge } from '../components/StatusBadge';
import { IncidentTimeline } from '../components/IncidentTimeline';
import { WorkOrderCard } from '../components/WorkOrderCard';
import { ResponseTeamCard } from '../components/ResponseTeamCard';
import { CriticalFacilityCard } from '../components/CriticalFacilityCard';
import { api } from '../lib/api';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileText,
  Camera,
  RefreshCw,
} from 'lucide-react';

interface IncidentDetailPageProps {
  incidentId: string;
  onBack: () => void;
  teams?: ResponseTeam[];
}

export const IncidentDetailPage: React.FC<IncidentDetailPageProps> = ({
  incidentId,
  onBack,
  teams = [],
}) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getIncident(incidentId);
      setIncident(data);
      if (data.actions) setActions(data.actions);
      if (data.notifications) setNotifications(data.notifications);
    } catch (err) {
      console.error('Failed to load incident:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [incidentId]);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      await api.stepVerifyDemo(incidentId);
      await loadData();
    } catch (e) {
      console.error('Error verifying incident:', e);
    } finally {
      setVerifying(false);
    }
  };

  const handleEscalate = async () => {
    try {
      await api.executeTool(
        'escalateIncident',
        {
          incidentId,
          reason: 'Dispatcher triggered manual critical escalation.',
          targetTier: 'DISASTER_MANAGEMENT_AUTHORITY',
          immediateActionsRequired: ['Area safety cordon', 'Substation isolation'],
        },
        incidentId
      );
      await loadData();
    } catch (e) {
      console.error('Error escalating incident:', e);
    }
  };

  if (loading && !incident) {
    return (
      <div className="py-20 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-cyan-400 mb-2" />
        <p className="text-sm">Loading incident telemetry...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-sm">Incident {incidentId} not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-3 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const assignedTeam = teams.find((t) => t.id === incident.assignedTeamId);

  return (
    <div className="py-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Back to Command Center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-amber-400">
                {incident.id}
              </span>
              <StatusBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {incident.type.replace('_', ' ')} Hazard
            </h1>
          </div>
        </div>

        {/* Action Buttons: Verification & Escalation */}
        <div className="flex items-center gap-2">
          {incident.status !== 'RESOLVED' && (
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifying}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{verifying ? 'VERIFYING...' : 'VERIFY RESOLUTION'}</span>
            </button>
          )}

          {incident.status !== 'ESCALATED' && incident.status !== 'RESOLVED' && (
            <button
              type="button"
              onClick={handleEscalate}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Escalate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Column Details & Right Column Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Core Incident Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Citizen Description Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Citizen Voice & Multimodal Report
              </span>
              <p className="text-sm font-semibold text-slate-100 mt-1 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                "{incident.description}"
              </p>
            </div>

            {/* AI Summary & Identified Risks */}
            {incident.aiSummary && (
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                  Gemini Operational Assessment (Confidence: {Math.round(incident.confidence * 100)}%)
                </span>
                <p className="text-slate-200 leading-relaxed">{incident.aiSummary}</p>
                {incident.risks && incident.risks.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {incident.risks.map((r, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]"
                      >
                        ⚠️ {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Geographic Location & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Address</span>
                <span className="font-medium text-slate-200 mt-0.5 block">
                  {incident.address || 'Indiranagar Urban Sector, Bengaluru'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Coordinates</span>
                <span className="font-mono text-cyan-400 mt-0.5 block">
                  {incident.latitude.toFixed(4)}° N, {incident.longitude.toFixed(4)}° E
                </span>
              </div>
            </div>

            {/* Photo Evidence if uploaded */}
            {incident.imageUrl && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-mono mb-2">
                  Multimodal Visual Evidence
                </span>
                <img
                  src={incident.imageUrl}
                  alt="Incident Photo"
                  className="rounded-xl border border-slate-800 max-h-60 object-cover"
                />
              </div>
            )}
          </div>

          {/* Assigned Work Order & Team Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Official Municipal Work Order
              </span>
              <WorkOrderCard
                workOrderId={incident.workOrderId}
                incidentId={incident.id}
                etaMinutes={incident.etaMinutes}
                teamName={incident.assignedTeamName}
              />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Assigned Municipal Unit
              </span>
              {assignedTeam ? (
                <ResponseTeamCard team={assignedTeam} isAssigned={true} />
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center">
                  Team assignment in progress...
                </div>
              )}
            </div>
          </div>

          {/* Nearby Critical Facilities */}
          {incident.criticalFacilities && incident.criticalFacilities.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Adjacent Critical Institutions ({incident.criticalFacilities.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incident.criticalFacilities.map((fac) => (
                  <CriticalFacilityCard key={fac.id} facility={fac} />
                ))}
              </div>
            </div>
          )}

          {/* Dispatched Radio & Field Notifications */}
          {notifications.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                Dispatched Field Alerts & Notifications ({notifications.length})
              </span>
              <div className="space-y-2 mt-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">
                        [{n.channel}] to {n.recipient}
                      </span>
                      <p className="text-slate-200 mt-0.5">{n.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour12: false })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Complete Agent Timeline & Audit Log */}
        <div className="space-y-4">
          <IncidentTimeline incident={incident} actions={actions} />
        </div>
      </div>
    </div>
  );
};
