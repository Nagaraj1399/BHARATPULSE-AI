import { civicStore } from './admin';
import { Incident } from '../../../shared/types';

export const incidentsDb = {
  getAll: () => civicStore.getIncidents(),
  getById: (id: string) => civicStore.getIncidentById(id),
  save: (incident: Incident) => civicStore.saveIncident(incident),
  create: (data: Partial<Incident> & { id: string; description: string; latitude: number; longitude: number }): Incident => {
    const now = new Date().toISOString();
    const newIncident: Incident = {
      id: data.id,
      type: data.type || 'OTHER',
      description: data.description,
      language: data.language || 'en',
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address || `${data.latitude.toFixed(4)}° N, ${data.longitude.toFixed(4)}° E, Bengaluru`,
      severity: data.severity || 'MEDIUM',
      confidence: data.confidence || 0.85,
      status: data.status || 'RECEIVED',
      assignedTeamId: data.assignedTeamId || null,
      assignedTeamName: data.assignedTeamName,
      criticalFacilities: data.criticalFacilities || [],
      imageUrl: data.imageUrl,
      aiSummary: data.aiSummary,
      risks: data.risks || [],
      requiredDepartments: data.requiredDepartments || [],
      clusterHypothesis: data.clusterHypothesis || null,
      workOrderId: data.workOrderId,
      etaMinutes: data.etaMinutes,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    };
    return civicStore.saveIncident(newIncident);
  },
  updateStatus: (id: string, status: Incident['status'], extra?: Partial<Incident>): Incident | null => {
    const inc = civicStore.getIncidentById(id);
    if (!inc) return null;
    inc.status = status;
    if (status === 'RESOLVED') {
      inc.resolvedAt = new Date().toISOString();
    }
    if (extra) {
      Object.assign(inc, extra);
    }
    return civicStore.saveIncident(inc);
  },
};
