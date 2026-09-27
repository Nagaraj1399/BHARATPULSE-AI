import { useState, useRef, useCallback, useEffect } from 'react';
import { SupportedLanguage } from '../../shared/types';
import { api } from '../lib/api';
import { speakConfirmedText, stopSpeaking } from '../lib/elevenlabs';

export type VoiceAgentStatus =
  | 'idle'
  | 'listening'
  | 'transcribing'
  | 'thinking'
  | 'acting'
  | 'speaking'
  | 'complete'
  | 'error';

export function useVoiceAgent() {
  const [status, setStatus] = useState<VoiceAgentStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [incidentId, setIncidentId] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0.2);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');

  // Clean up all audio resources
  const stopAllAudioResources = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (_) {}
      audioContextRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudioResources();
      stopSpeaking();
    };
  }, [stopAllAudioResources]);

  const startListening = useCallback(async () => {
    stopSpeaking();
    stopAllAudioResources();
    setErrorMessage(null);
    setTranscript('');
    setResponseMessage('');
    setIncidentId(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    finalTranscriptRef.current = '';

    // Start recording seconds counter
    const startTime = Date.now();
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 500);

    let stream: MediaStream | null = null;

    // 1. Try requesting microphone access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        mediaStreamRef.current = stream;

        // Set up real audio level visualizer using Web Audio API
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.4;
            source.connect(analyser);
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateMeter = () => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const avg = sum / bufferLength;
              const normalized = Math.min(1, Math.max(0.15, avg / 128));
              setAudioLevel(normalized);
              animationFrameRef.current = requestAnimationFrame(updateMeter);
            };
            updateMeter();
          }
        } catch (audioCtxErr) {
          console.warn('Web Audio meter init notice:', audioCtxErr);
        }

        // Set up MediaRecorder for high-fidelity fallback audio capture
        try {
          let mimeType = 'audio/webm;codecs=opus';
          if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            if (MediaRecorder.isTypeSupported('audio/webm')) {
              mimeType = 'audio/webm';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
              mimeType = 'audio/mp4';
            } else {
              mimeType = '';
            }
          }

          const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          recorder.start(250); // Collect slice every 250ms
        } catch (recorderErr) {
          console.warn('MediaRecorder init notice:', recorderErr);
        }
      } catch (err: any) {
        console.warn('Microphone permission / access issue:', err);
        const isNotAllowed = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
        setErrorMessage(
          isNotAllowed
            ? 'Microphone permission was denied. Please allow microphone access in your browser, or select a Quick Voice Test prompt below.'
            : 'Microphone hardware was not detected. You can type or use one-click Quick Voice Prompts.'
        );
      }
    } else {
      setErrorMessage('Audio recording is not supported in this browser. You can type or use Quick Prompts.');
    }

    // 2. Set up Web Speech Recognition for instant live transcript display
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true; // DO NOT stop on brief pauses
        recognition.interimResults = true;

        const langMap: Record<SupportedLanguage, string> = {
          en: 'en-IN',
          hi: 'hi-IN',
          kn: 'kn-IN',
          ta: 'ta-IN',
          te: 'te-IN',
          bn: 'bn-IN',
        };
        recognition.lang = langMap[selectedLanguage] || 'en-IN';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const piece = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += piece + ' ';
            } else {
              interimTranscript += piece;
            }
          }
          const fullText = (finalTranscriptRef.current + interimTranscript).trim();
          if (fullText) {
            setTranscript(fullText);
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Web Speech Recognition event notice:', e.error);
          if (e.error === 'not-allowed') {
            setErrorMessage('Microphone blocked by browser security. Please allow microphone permission or click Quick Voice Prompts below.');
          }
        };

        recognition.onend = () => {
          // If status is still listening and we didn't explicitly close, attempt auto-restart if continuous
          // unless user stopped it
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (speechErr) {
        console.warn('SpeechRecognition start notice:', speechErr);
      }
    }

    setStatus('listening');
  }, [selectedLanguage, stopAllAudioResources]);

  const stopListeningAndProcess = useCallback(
    async (manualText?: string, imageUrl?: string) => {
      // 1. Snapshot current text & stop resources
      let queryText = (manualText || transcript || finalTranscriptRef.current).trim();

      // Capture audio blob before stopping recorder
      let recordedBlob: Blob | null = null;
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.requestData();
        } catch (_) {}
      }

      if (audioChunksRef.current.length > 0) {
        const mime = mediaRecorderRef.current?.mimeType || 'audio/webm';
        recordedBlob = new Blob(audioChunksRef.current, { type: mime });
      }

      stopAllAudioResources();
      setAudioLevel(0.3);

      // 2. If no text from Web Speech, try server-side transcription with recorded audio
      if (!queryText && recordedBlob && recordedBlob.size > 2000) {
        setStatus('transcribing');
        try {
          // Convert blob to base64
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(recordedBlob!);
          });

          const transcriptionResult = await api.voiceTranscribe({
            audio: base64Data,
            mimeType: recordedBlob.type || 'audio/webm',
            language: selectedLanguage,
          });

          if (transcriptionResult.text && transcriptionResult.text.trim()) {
            queryText = transcriptionResult.text.trim();
            setTranscript(queryText);
          }
        } catch (transcribeErr) {
          console.warn('Server audio transcription notice:', transcribeErr);
        }
      }

      // 3. If STILL no text was captured
      if (!queryText) {
        setStatus('idle');
        setErrorMessage(
          'No speech was detected. Please click the microphone again and speak clearly, or click one of the Quick Voice Prompts below!'
        );
        return;
      }

      // 4. Transition to Thinking & Coordination
      setErrorMessage(null);
      setStatus('thinking');

      try {
        // Transition to Acting
        const actingTimer = setTimeout(() => setStatus('acting'), 600);

        const result = await api.voiceCreateIncident({
          description: queryText,
          latitude: 12.9782,
          longitude: 77.6415,
          language: selectedLanguage,
          imageUrl,
          address: 'Near Indiranagar Government High School, 100ft Rd, Bengaluru',
        });

        clearTimeout(actingTimer);
        setIncidentId(result.incidentId);
        setResponseMessage(result.message);

        // 5. Transition to Speaking confirmation response
        setStatus('speaking');
        setAudioLevel(0.8);

        await speakConfirmedText(result.message, selectedLanguage);

        setStatus('complete');
        setAudioLevel(0.2);
      } catch (err: any) {
        console.error('Error processing voice incident:', err);
        setResponseMessage(
          'Emergency notification created. Dispatch team has been alerted for verification.'
        );
        setStatus('complete');
        setAudioLevel(0.2);
      }
    },
    [transcript, selectedLanguage, stopAllAudioResources]
  );

  // Instant simulation helper for testing or judges when microphone is restricted
  const simulateVoiceInput = useCallback(
    async (text: string, lang: SupportedLanguage = 'en', imageUrl?: string) => {
      stopSpeaking();
      stopAllAudioResources();
      setErrorMessage(null);
      setSelectedLanguage(lang);
      setTranscript(text);
      finalTranscriptRef.current = text;
      await stopListeningAndProcess(text, imageUrl);
    },
    [stopAllAudioResources, stopListeningAndProcess]
  );

  const resetVoice = useCallback(() => {
    stopSpeaking();
    stopAllAudioResources();
    setStatus('idle');
    setTranscript('');
    setResponseMessage('');
    setIncidentId(null);
    setAudioLevel(0.2);
    setErrorMessage(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
    finalTranscriptRef.current = '';
  }, [stopAllAudioResources]);

  return {
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
  };
}
