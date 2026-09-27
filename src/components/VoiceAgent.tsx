import React, { useState } from 'react';
import { VoiceOrb } from './VoiceOrb';
import { LanguageSelector } from './LanguageSelector';
import { useVoiceAgent } from '../hooks/useVoiceAgent';
import { Camera, Send, Sparkles, Volume2, ArrowRight, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { SupportedLanguage } from '../../shared/types';

interface VoiceAgentProps {
  onIncidentCreated?: (incidentId: string) => void;
  onOpenDashboard?: () => void;
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({
  onIncidentCreated,
  onOpenDashboard,
}) => {
  const {
    status,
    transcript,
    setTranscript,
    responseMessage,
    selectedLanguage,
    setSelectedLanguage,
    incidentId,
    audioLevel,
    errorMessage,
    recordingSeconds,
    startListening,
    stopListeningAndProcess,
    simulateVoiceInput,
    resetVoice,
  } = useVoiceAgent();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState('');

  // Sample quick civic reports for judges and citizens
  const samplePrompts = [
    {
      title: 'Water Leak & School Flood (Demo Case)',
      text: 'There is a major water leak outside a school and the road is flooding.',
      lang: 'en' as SupportedLanguage,
    },
    {
      title: 'Hindi: स्कूल के बाहर पाइप लाइन लीकेज',
      text: 'स्कूल के बाहर पानी की बड़ी पाइपलाइन फट गई है और सड़क पर पानी भर रहा है।',
      lang: 'hi' as SupportedLanguage,
    },
    {
      title: 'Kannada: ಶಾಲೆಯ ಬಳಿ ರಸ್ತೆ ಜಲಾವೃತ',
      text: 'ಶಾಲೆಯ ಮುಂದೆ ನೀರಿನ ಪೈಪ್ ಒಡೆದು ರಸ್ತೆಯಲ್ಲಿ ನೀರು ನಿಂತಿದೆ.',
      lang: 'kn' as SupportedLanguage,
    },
    {
      title: 'Sparking Transformer on Bus Stop',
      text: 'A high voltage transformer is sparking and dripping oil near the bus station.',
      lang: 'en' as SupportedLanguage,
    },
  ];

  const handleOrbClick = () => {
    if (status === 'idle' || status === 'error') {
      startListening();
    } else if (status === 'listening') {
      stopListeningAndProcess(transcript, uploadedImage || undefined);
    } else if (status === 'complete') {
      resetVoice();
    }
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() && !transcript.trim()) return;
    const textToSubmit = typedMessage.trim() || transcript.trim();
    setTypedMessage('');
    stopListeningAndProcess(textToSubmit, uploadedImage || undefined);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Decorative Grid & Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Controls: Language & Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white">BHARATPULSE AI</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                VOICE LAYER
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1">
              "How can we help your city?"
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Speak or type in your native language. Autonomous civic agent coordinates response.
            </p>
          </div>

          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelect={(lang) => setSelectedLanguage(lang)}
          />
        </div>

        {/* Center Animated Voice Orb */}
        <div className="py-8 sm:py-12 flex flex-col items-center justify-center">
          <VoiceOrb
            status={status}
            audioLevel={audioLevel}
            recordingSeconds={recordingSeconds}
            onClick={handleOrbClick}
            size="lg"
          />

          {/* Quick Action under Orb when Listening */}
          {status === 'listening' && (
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => stopListeningAndProcess(transcript, uploadedImage || undefined)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all"
              >
                <span>Finished Speaking — Send Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={resetVoice}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Error / Fallback Notification Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={startListening}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-100 font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry Mic</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  simulateVoiceInput(
                    'There is a major water leak outside a school and the road is flooding.',
                    selectedLanguage,
                    uploadedImage || undefined
                  )
                }
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                <span>Demo Voice Input</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Transcript & Processing Status Box */}
        {(transcript || status === 'listening' || status === 'transcribing' || status === 'thinking' || status === 'acting') && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm mb-6 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1.5">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                Live Citizen Input
              </span>
              <span className="uppercase text-cyan-400 font-bold">{status}</span>
            </div>
            <p className="text-slate-100 font-medium leading-relaxed min-h-[1.5rem]">
              {transcript ||
                (status === 'listening'
                  ? 'Listening to speech... Speak into your microphone.'
                  : status === 'transcribing'
                  ? 'Transcribing recorded audio with Gemini...'
                  : 'Processing civic report...')}
            </p>
          </div>
        )}

        {/* Confirmed Voice Reply Display */}
        {responseMessage && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-950/90 border border-cyan-500/40 text-sm mb-6 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between text-xs text-cyan-300 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                BharatPulse Confirmed Voice Response
              </span>
              {incidentId && (
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/40">
                  {incidentId}
                </span>
              )}
            </div>
            <p className="text-slate-100 font-semibold text-base leading-relaxed">
              "{responseMessage}"
            </p>
            {incidentId && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Incident registered on Bengaluru Municipal Grid
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onIncidentCreated?.(incidentId);
                    onOpenDashboard?.();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-1 hover:brightness-110 shadow-md shadow-cyan-500/20"
                >
                  <span>Track in Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Input Bar with Mic / Type / Image Upload */}
        <form onSubmit={handleSubmitText} className="flex items-center gap-2 mb-6">
          <label
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer border border-slate-700 flex items-center justify-center transition-colors"
            title="Upload Incident Photo"
          >
            <Camera className="w-5 h-5 text-slate-300" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <input
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder={
              status === 'listening'
                ? 'Listening to microphone...'
                : 'Or type the civic hazard / emergency here...'
            }
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/70"
          />

          <button
            type="submit"
            disabled={status === 'thinking' || status === 'acting' || status === 'transcribing'}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        {/* Uploaded Image Preview Tag */}
        {uploadedImage && (
          <div className="mb-4 flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800 max-w-sm">
            <img
              src={uploadedImage}
              alt="Hazard upload"
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1 text-xs">
              <span className="font-semibold text-slate-200">Incident Photo Attached</span>
              <p className="text-[10px] text-slate-500 truncate">Multimodal Gemini evidence</p>
            </div>
            <button
              type="button"
              onClick={() => setUploadedImage(null)}
              className="text-xs text-rose-400 hover:underline px-2"
            >
              Remove
            </button>
          </div>
        )}

        {/* Quick Sample Prompts Section */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Instant One-Click Voice & Report Presets:
            </span>
            <span className="text-[10px] text-slate-500">
              Click to simulate voice input directly
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  simulateVoiceInput(p.text, p.lang, uploadedImage || undefined);
                }}
                className="text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-xs transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 group-hover:text-amber-300">
                    {p.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {p.lang}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  "{p.text}"
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
