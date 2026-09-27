export const ELEVENLABS_AGENT_ID =
  import.meta.env.VITE_ELEVENLABS_AGENT_ID || 'bharatpulse-agent-bengaluru';

function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    const current = window.speechSynthesis.getVoices();
    if (current.length > 0) {
      resolve(current);
      return;
    }
    const timer = setTimeout(() => resolve([]), 500);
    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timer);
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

// Speaks confirmed text aloud using browser Web Speech Synthesis
export async function speakConfirmedText(text: string, language = 'en'): Promise<void> {
  if (!('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const voices = await getAvailableVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const langCode = (language || 'en').toLowerCase();
    const langPrefix =
      langCode === 'hi'
        ? 'hi'
        : langCode === 'kn'
        ? 'kn'
        : langCode === 'ta'
        ? 'ta'
        : langCode === 'te'
        ? 'te'
        : langCode === 'bn'
        ? 'bn'
        : 'en';

    let selectedVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith(langPrefix) &&
        (v.name.includes('India') || v.name.includes('Google') || v.name.includes('Natural'))
    );

    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
    }
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en-in') || v.lang.toLowerCase().startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    return new Promise((resolve) => {
      // Safety timeout so speaking promise never hangs permanently
      const maxTimeout = setTimeout(() => {
        resolve();
      }, 12000);

      utterance.onend = () => {
        clearTimeout(maxTimeout);
        resolve();
      };
      utterance.onerror = () => {
        clearTimeout(maxTimeout);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  } catch (err) {
    console.warn('Speech synthesis playback exception:', err);
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}
