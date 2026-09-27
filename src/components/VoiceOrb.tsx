import React from 'react';
import { Mic, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';

interface VoiceOrbProps {
  status: 'idle' | 'listening' | 'transcribing' | 'thinking' | 'acting' | 'speaking' | 'complete' | 'error';
  audioLevel?: number;
  recordingSeconds?: number;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  status,
  audioLevel = 0.2,
  recordingSeconds = 0,
  onClick,
  size = 'lg',
}) => {
  const isListening = status === 'listening';
  const isTranscribing = status === 'transcribing';
  const isThinking = status === 'thinking';
  const isActing = status === 'acting';
  const isSpeaking = status === 'speaking';
  const isComplete = status === 'complete';
  const isError = status === 'error';

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return recordingSeconds > 0 ? `Listening (${recordingSeconds}s) • Tap to send` : 'Listening... Speak now';
      case 'transcribing':
        return 'Transcribing citizen voice...';
      case 'thinking':
        return 'BharatPulse is analyzing...';
      case 'acting':
        return 'Coordinating city response...';
      case 'speaking':
        return 'BharatPulse speaking...';
      case 'complete':
        return 'Incident coordinated.';
      case 'error':
        return 'Tap to retry microphone';
      default:
        return 'TALK TO BHARATPULSE';
    }
  };

  const getGlowColor = () => {
    if (isListening) return 'rgba(249, 115, 22, 0.5)'; // Saffron pulse
    if (isTranscribing) return 'rgba(59, 130, 246, 0.55)'; // Blue transcribe
    if (isThinking) return 'rgba(6, 182, 212, 0.55)'; // Cyan intelligence
    if (isActing) return 'rgba(16, 185, 129, 0.5)'; // Green execution
    if (isSpeaking) return 'rgba(168, 85, 247, 0.5)'; // Purple voice
    if (isComplete) return 'rgba(16, 185, 129, 0.6)';
    if (isError) return 'rgba(239, 68, 68, 0.5)';
    return 'rgba(245, 158, 11, 0.25)';
  };

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative flex items-center justify-center p-4">
        {/* Background Ripple Waves when Active */}
        {(isListening || isSpeaking || isThinking || isActing) && (
          <>
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-25"
              style={{
                backgroundColor: getGlowColor(),
                animationDuration: isListening ? '1.4s' : '2.2s',
              }}
            />
            <div
              className="absolute -inset-4 rounded-full opacity-20 blur-xl animate-pulse"
              style={{
                backgroundColor: getGlowColor(),
                transform: `scale(${1 + audioLevel * 0.4})`,
              }}
            />
          </>
        )}

        {/* Outer Ring */}
        <div
          className={`relative rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${
            sizeClasses[size]
          } ${
            isListening
              ? 'ring-4 ring-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.5)]'
              : isTranscribing
              ? 'ring-4 ring-blue-500/60 shadow-[0_0_50px_rgba(59,130,246,0.5)] animate-pulse'
              : isThinking
              ? 'ring-4 ring-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.5)] animate-spin-slow'
              : isActing
              ? 'ring-4 ring-emerald-400/60 shadow-[0_0_50px_rgba(16,185,129,0.5)]'
              : isSpeaking
              ? 'ring-4 ring-purple-400/60 shadow-[0_0_50px_rgba(168,85,247,0.5)]'
              : isError
              ? 'ring-4 ring-rose-500/60 shadow-[0_0_40px_rgba(239,68,68,0.4)]'
              : 'hover:ring-2 hover:ring-amber-500/40 shadow-[0_0_30px_rgba(15,23,42,0.8)]'
          }`}
          onClick={onClick}
          role="button"
          tabIndex={0}
          aria-label={getStatusText()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClick?.();
            }
          }}
        >
          {/* Sphere Gradient Core */}
          <div
            className="w-full h-full rounded-full flex flex-col items-center justify-center overflow-hidden relative border border-slate-700/60"
            style={{
              background: isListening
                ? 'radial-gradient(circle, #ea580c 0%, #7c2d12 55%, #0f172a 100%)'
                : isTranscribing
                ? 'radial-gradient(circle, #2563eb 0%, #1e3a8a 55%, #0f172a 100%)'
                : isThinking
                ? 'radial-gradient(circle, #0891b2 0%, #164e63 55%, #0f172a 100%)'
                : isActing
                ? 'radial-gradient(circle, #059669 0%, #064e3b 55%, #0f172a 100%)'
                : isSpeaking
                ? 'radial-gradient(circle, #9333ea 0%, #581c87 55%, #0f172a 100%)'
                : isError
                ? 'radial-gradient(circle, #dc2626 0%, #7f1d1d 55%, #0f172a 100%)'
                : 'radial-gradient(circle, #1e293b 0%, #0f172a 70%, #030712 100%)',
            }}
          >
            {/* Center Dynamic Icon */}
            {isComplete ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-300 transition-transform scale-110" />
            ) : isTranscribing ? (
              <Activity className="w-12 h-12 text-blue-300 animate-pulse" />
            ) : isThinking ? (
              <Activity className="w-12 h-12 text-cyan-300 animate-pulse" />
            ) : isActing ? (
              <ShieldAlert className="w-12 h-12 text-emerald-300 animate-bounce" />
            ) : (
              <Mic
                className={`w-12 h-12 transition-all duration-200 ${
                  isListening
                    ? 'text-amber-200 scale-125'
                    : isSpeaking
                    ? 'text-purple-200 scale-115'
                    : isError
                    ? 'text-rose-300'
                    : 'text-slate-300 hover:text-amber-400'
                }`}
              />
            )}

            {/* Audio Waveform Bars (Simulation) */}
            {(isListening || isSpeaking) && (
              <div className="absolute bottom-6 flex items-center gap-1">
                {[0.4, 0.8, 0.5, 0.9, 0.6, 0.7, 0.3].map((val, idx) => (
                  <div
                    key={idx}
                    className="w-1 bg-white/80 rounded-full transition-all duration-100"
                    style={{
                      height: `${Math.max(4, val * audioLevel * 28)}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Label */}
      <div className="mt-4 text-center">
        <p
          className={`text-sm sm:text-base font-semibold tracking-wide uppercase transition-colors ${
            isListening
              ? 'text-amber-400'
              : isTranscribing
              ? 'text-blue-400'
              : isThinking
              ? 'text-cyan-400'
              : isActing
              ? 'text-emerald-400'
              : isSpeaking
              ? 'text-purple-400'
              : isComplete
              ? 'text-emerald-400'
              : isError
              ? 'text-rose-400'
              : 'text-slate-300'
          }`}
        >
          {getStatusText()}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {status === 'idle'
            ? 'Tap orb to speak or select a quick civic report below'
            : isListening
            ? 'Tap again when finished speaking'
            : isError
            ? 'Microphone issue detected • Try typing or select quick voice reports'
            : 'Gemini reasoning & ElevenLabs conversational agent active'}
        </p>
      </div>
    </div>
  );
};
