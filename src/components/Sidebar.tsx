import React from 'react';
import { Home, Radio, Activity, Shield, Info, Layers } from 'lucide-react';

interface SidebarProps {
  activeTab: 'landing' | 'citizen' | 'dashboard' | 'risk';
  setActiveTab: (tab: 'landing' | 'citizen' | 'dashboard' | 'risk') => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const items = [
    { id: 'landing', label: 'Overview', icon: Home, badge: 'Home' },
    { id: 'citizen', label: 'Citizen Voice', icon: Radio, badge: 'ElevenLabs' },
    { id: 'dashboard', label: 'Command Center', icon: Activity, badge: 'Live Ops' },
    { id: 'risk', label: 'Risk Intelligence', icon: Shield, badge: '2030 Model' },
  ] as const;

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800/80 flex flex-col justify-between p-4 hidden md:flex min-h-[calc(100vh-4.25rem)]">
      <div>
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-cyan-400" />
          Operating Architecture
        </div>
        <nav className="mt-2 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-800/90 text-white border border-slate-700 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 font-mono">
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Autonomous System Status Box */}
      <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Agent Loop
          </span>
          <span className="text-cyan-400 font-mono">AUTONOMOUS</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
          Gemini Multimodal Brain + Node Action Tools + ElevenLabs Voice
        </p>
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Target: Bengaluru</span>
          <span className="text-emerald-400 font-bold">READY</span>
        </div>
      </div>
    </aside>
  );
};
