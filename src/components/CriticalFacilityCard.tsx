import React from 'react';
import { CriticalFacility } from '../../shared/types';
import { School, Hospital, Shield, MapPin, AlertCircle } from 'lucide-react';

interface CriticalFacilityCardProps {
  facility: CriticalFacility;
}

export const CriticalFacilityCard: React.FC<CriticalFacilityCardProps> = ({ facility }) => {
  const isSchool = facility.type === 'school';
  const isHospital = facility.type === 'hospital';

  return (
    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isSchool
                ? 'bg-amber-500/20 text-amber-300'
                : isHospital
                ? 'bg-rose-500/20 text-rose-300'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isSchool ? (
              <School className="w-4 h-4" />
            ) : isHospital ? (
              <Hospital className="w-4 h-4" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
          </div>
          <div>
            <h5 className="font-bold text-slate-100">{facility.name}</h5>
            <span className="text-[10px] text-slate-400 uppercase font-mono">{facility.type}</span>
          </div>
        </div>
        {facility.distanceMeters && (
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold text-[10px]">
            {facility.distanceMeters}m away
          </span>
        )}
      </div>

      {facility.riskRelevance && (
        <div className="mt-2.5 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-slate-300 text-[11px] leading-relaxed flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{facility.riskRelevance}</span>
        </div>
      )}
    </div>
  );
};
