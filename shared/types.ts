export type IncidentCategory =
  | 'WATER_LEAK'
  | 'FLOODING'
  | 'ROAD_DAMAGE'
  | 'GARBAGE_OVERFLOW'
  | 'FALLEN_TREE'
  | 'ELECTRICAL_HAZARD'
  | 'FIRE_RISK'
  | 'TRAFFIC_OBSTRUCTION'
  | 'HEAT_EMERGENCY'
  | 'AIR_QUALITY'
  | 'OTHER';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus =
  | 'RECEIVED'
  | 'ANALYZING'
  | 'INVESTIGATING'
  | 'DISPATCHING'
  | 'DISPATCHED'
  | 'ON_SITE'
  | 'VERIFYING'
  | 'RESOLVED'
  | 'ESCALATED';

export type TeamAvailability = 'AVAILABLE' | 'DISPATCHED' | 'ON_SCENE' | 'OFF_DUTY';

export type WorkOrderStatus = 'PENDING' | 'ACCEPTED' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED' | 'REJECTED';

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'bn';

export interface CriticalFacility {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'fire_station' | 'police_station' | 'metro_station' | 'major_road' | 'public_facility';
  latitude: number;
  longitude: number;
  vicinity?: string;
  distanceMeters?: number;
  riskRelevance?: string;
  vulnerabilityNotes?: string;
}

export interface Incident {
  id: string;
  type: IncidentCategory;
  description: string;
  language: SupportedLanguage | string;
  latitude: number;
  longitude: number;
  address?: string;
  severity: IncidentSeverity;
  confidence: number;
  status: IncidentStatus;
  assignedTeamId: string | null;
  assignedTeamName?: string;
  criticalFacilities: CriticalFacility[];
  imageUrl?: string;
  aiSummary?: string;
  risks?: string[];
  requiredDepartments?: string[];
  clusterHypothesis?: string | null;
  workOrderId?: string;
  etaMinutes?: number;
  routeCoordinates?: [number, number][];
  verificationNotes?: string;
  verificationPhotoUrl?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface ResponseTeam {
  id: string;
  name: string;
  department: string;
  capabilities: string[];
  latitude: number;
  longitude: number;
  availability: TeamAvailability;
  currentLoad: number;
  contactPhone?: string;
  vehicleId?: string;
  distanceKm?: number;
  etaMinutes?: number;
}

export interface WorkOrder {
  id: string;
  incidentId: string;
  teamId: string;
  teamName?: string;
  priority: IncidentSeverity;
  status: WorkOrderStatus;
  etaMinutes: number;
  instructions?: string;
  createdAt: string;
  completedAt: string | null;
}

export interface AgentAction {
  id: string;
  incidentId: string;
  tool: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED';
  summary: string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  latencyMs?: number;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  incidentId: string;
  teamId?: string;
  recipient: string;
  channel: 'IN_APP' | 'SMS_SIMULATED' | 'RADIO_DISPATCH' | 'WHATSAPP_SIMULATED';
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  timestamp: string;
}

export interface RiskZone {
  id: string;
  name: string;
  category: 'FLOODING' | 'WATER_INFRASTRUCTURE' | 'HEAT_ISLAND' | 'ROAD_HAZARDS' | 'ELECTRICAL_GRID';
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'SEVERE';
  latitude: number;
  longitude: number;
  radiusMeters: number;
  contributingSignals: string[];
  recommendedActions: string[];
  lastUpdated: string;
}

export interface IncidentClusterResult {
  detected: boolean;
  incidentCount: number;
  radiusKm: number;
  timeWindowMinutes: number;
  hypothesis: string;
  incidentIds: string[];
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  trafficStatus: 'NORMAL' | 'MODERATE' | 'HEAVY';
  polyline?: string;
  coordinates: [number, number][];
  isSimulated?: boolean;
}

export type AgentLoopPhase =
  | 'OBSERVE'
  | 'UNDERSTAND'
  | 'PLAN'
  | 'INVESTIGATE'
  | 'ACT'
  | 'VERIFY'
  | 'RESOLVE';

export interface AgentState {
  currentPhase: AgentLoopPhase;
  activeAction: string;
  progressPercent: number;
  activeIncidentId: string | null;
  logs: AgentAction[];
}

export interface VoiceSessionState {
  status: 'idle' | 'listening' | 'thinking' | 'acting' | 'speaking' | 'complete';
  transcript: string;
  assistantResponse: string;
  selectedLanguage: SupportedLanguage;
  incidentId: string | null;
  audioVisualizerLevel?: number;
}
