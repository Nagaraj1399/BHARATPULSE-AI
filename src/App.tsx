import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingHero } from './components/LandingHero';
import { CitizenPage } from './pages/Citizen';
import { DashboardPage } from './pages/Dashboard';
import { IncidentDetailPage } from './pages/IncidentDetail';
import { RiskIntelligencePage } from './pages/RiskIntelligence';
import { DemoController } from './components/DemoController';
import { JudgeModeModal } from './components/JudgeModeModal';
import { useIncidents } from './hooks/useIncidents';
import { useAgent } from './hooks/useAgent';
import { api } from './lib/api';
import { Incident, ResponseTeam, CriticalFacility, RiskZone } from '../shared/types';
import { speakConfirmedText, stopSpeaking } from './lib/elevenlabs';

export default function App() {
  const [activeTab, setActiveTab] = useState<'landing' | 'citizen' | 'dashboard' | 'risk'>('landing');
  const [detailedIncidentId, setDetailedIncidentId] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [judgeMode, setJudgeMode] = useState<boolean>(false);

  // Data fetching hooks
  const { incidents, refresh: refreshIncidents } = useIncidents(2500);
  const { actions, refresh: refreshActions } = useAgent();

  const [teams, setTeams] = useState<ResponseTeam[]>([]);
  const [facilities, setFacilities] = useState<CriticalFacility[]>([]);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);

  // Demo state
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);
  const [demoStepName, setDemoStepName] = useState<string>('Standby');
  const [confirmedNarration, setConfirmedNarration] = useState<string>('');

  const loadReferenceData = useCallback(async () => {
    try {
      const [teamsData, facilitiesData, riskData] = await Promise.all([
        api.getTeams(),
        api.getCriticalFacilities(),
        api.getRiskZones(),
      ]);
      setTeams(teamsData);
      setFacilities(facilitiesData);
      setRiskZones(riskData);
    } catch (e) {
      console.warn('Reference data load notice:', e);
    }
  }, []);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  // Set selected incident default if not set
  useEffect(() => {
    if (!selectedIncident && incidents.length > 0) {
      // Prefer high priority or BP-2048 if exists
      const demoInc = incidents.find((i) => i.id === 'BP-2048') || incidents[0];
      setSelectedIncident(demoInc);
    }
  }, [incidents, selectedIncident]);

  // 90-Second Demo Runner
  const handleRunDemo = async () => {
    setIsDemoRunning(true);
    setDemoStepIndex(0);
    setDemoStepName('Citizen Voice Intake');
    setActiveTab('dashboard'); // Switch to Command Center to visualize live orchestration

    try {
      // Step 1: Voice report received
      setDemoStepIndex(0);
      setDemoStepName('Citizen Voice Intake: "Major water leak outside school"');
      await new Promise((r) => setTimeout(r, 1200));

      // Trigger server orchestration
      const demoRes = await api.startDemo('en');
      await refreshIncidents();
      await refreshActions();

      const demoIncident = demoRes.incident;
      if (demoIncident) {
        setSelectedIncident(demoIncident);
      }

      // Step 2: Gemini Classified Incident
      setDemoStepIndex(1);
      setDemoStepName('Gemini: WATER_LEAK / HIGH PRIORITY classified');
      await new Promise((r) => setTimeout(r, 1400));

      // Step 3: School Detected
      setDemoStepIndex(2);
      setDemoStepName('School Detected — 180m (Indiranagar Govt High School)');
      await new Promise((r) => setTimeout(r, 1400));

      // Step 4: Response Team Found
      setDemoStepIndex(3);
      setDemoStepName('Response Team Selected: BWSSB Rapid Water Unit 01');
      await new Promise((r) => setTimeout(r, 1400));

      // Step 5: Route & ETA Calculated
      setDemoStepIndex(4);
      setDemoStepName('Route Calculated: 2.4km • Confirmed ETA: 8 minutes');
      await new Promise((r) => setTimeout(r, 1400));

      // Step 6: Work Order Created & Team Notified
      setDemoStepIndex(5);
      setDemoStepName('Work Order WO-BWSSB-2048 Created & Radio Alert Dispatched');
      await new Promise((r) => setTimeout(r, 1400));

      // Step 7: Network Risk Cluster Check
      setDemoStepIndex(6);
      setDemoStepName('Spatial Cluster Analysis: Network-level hydraulic risk evaluated');
      await new Promise((r) => setTimeout(r, 1500));

      // Voice readback of confirmed action
      const narration =
        demoRes.confirmedVoiceNarration ||
        "I've created incident BP-2048. A nearby water-response team has been assigned. Their estimated arrival time is eight minutes.";
      setConfirmedNarration(narration);
      speakConfirmedText(narration, 'en');

      // Step 8: On-site verification & resolution
      setDemoStepIndex(7);
      setDemoStepName('Field Verification Dispatched & Resolution Confirmed');
      await api.stepVerifyDemo('BP-2048');
      await refreshIncidents();
      await refreshActions();
    } catch (err) {
      console.error('Demo execution error:', err);
    } finally {
      setIsDemoRunning(false);
    }
  };

  const handleVerifyDemoStep = async () => {
    try {
      await api.stepVerifyDemo('BP-2048');
      await refreshIncidents();
      await refreshActions();
      setDemoStepIndex(7);
      setDemoStepName('Resolution verified by field telemetry');
    } catch (e) {
      console.error('Error verifying demo:', e);
    }
  };

  const handleResetDemo = async () => {
    stopSpeaking();
    setIsDemoRunning(false);
    setDemoStepIndex(0);
    setDemoStepName('Standby');
    setConfirmedNarration('');
    await api.resetDemo();
    await refreshIncidents();
    await refreshActions();
    await loadReferenceData();
    if (incidents.length > 0) {
      setSelectedIncident(incidents[0]);
    }
  };

  const handleSelectIncident = (inc: Incident) => {
    setSelectedIncident(inc);
  };

  const handleViewDetails = (id: string) => {
    setDetailedIncidentId(id);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <Header
        activeTab={detailedIncidentId ? 'dashboard' : activeTab}
        setActiveTab={(tab) => {
          setDetailedIncidentId(null);
          setActiveTab(tab);
        }}
        onRunDemo={handleRunDemo}
        isDemoRunning={isDemoRunning}
        judgeMode={judgeMode}
        setJudgeMode={setJudgeMode}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={detailedIncidentId ? 'dashboard' : activeTab}
          setActiveTab={(tab) => {
            setDetailedIncidentId(null);
            setActiveTab(tab);
          }}
        />

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
          {/* Persistent Floating Demo Controller if Demo active or triggered */}
          {(isDemoRunning || confirmedNarration || demoStepIndex > 0) && (
            <DemoController
              isRunning={isDemoRunning}
              onStartDemo={handleRunDemo}
              onVerifyStep={handleVerifyDemoStep}
              onReset={handleResetDemo}
              currentStepIndex={demoStepIndex}
              totalSteps={8}
              stepName={demoStepName}
              confirmedNarration={confirmedNarration}
            />
          )}

          {/* Router Switching */}
          {detailedIncidentId ? (
            <IncidentDetailPage
              incidentId={detailedIncidentId}
              onBack={() => setDetailedIncidentId(null)}
              teams={teams}
            />
          ) : activeTab === 'landing' ? (
            <LandingHero
              onOpenVoice={() => setActiveTab('citizen')}
              onOpenDashboard={() => setActiveTab('dashboard')}
              onRunDemo={handleRunDemo}
              isDemoRunning={isDemoRunning}
            />
          ) : activeTab === 'citizen' ? (
            <CitizenPage
              onIncidentCreated={(id) => {
                setDetailedIncidentId(id);
              }}
              onOpenDashboard={() => setActiveTab('dashboard')}
            />
          ) : activeTab === 'dashboard' ? (
            <DashboardPage
              incidents={incidents}
              teams={teams}
              facilities={facilities}
              riskZones={riskZones}
              actions={actions}
              selectedIncident={selectedIncident}
              onSelectIncident={handleSelectIncident}
              onViewDetails={handleViewDetails}
              onRefresh={async () => {
                await refreshIncidents();
                await refreshActions();
              }}
            />
          ) : (
            <RiskIntelligencePage
              riskZones={riskZones}
              incidents={incidents}
              onSelectZone={(zone) => {
                console.log('Selected zone:', zone.name);
              }}
            />
          )}
        </main>
      </div>

      {/* Hackathon Judge Mode Modal */}
      <JudgeModeModal
        isOpen={judgeMode}
        onClose={() => setJudgeMode(false)}
        actions={actions}
        incidents={incidents}
      />
    </div>
  );
}
