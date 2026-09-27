import React from 'react';
import { SupportedLanguage } from '../../shared/types';
import { SUPPORTED_LANGUAGES } from '../../shared/schemas';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onSelect: (lang: SupportedLanguage) => void;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelect,
  compact = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      {!compact && (
        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          Language:
        </span>
      )}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onSelect(lang.code)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={`${lang.label} (${lang.native})`}
            >
              <span>{lang.native}</span>
              {!compact && <span className="ml-1 text-[10px] text-slate-500 uppercase">{lang.code}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
