import axios from 'axios';

let currentUtterance = null;
let currentAudio = null;
let recognition = null;

// ─── Language code mapping for Web Speech API ──────
const SPEECH_LANG_MAP = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN',
  mr: 'mr-IN', ta: 'ta-IN', gu: 'gu-IN', kn: 'kn-IN',
  ml: 'ml-IN', or: 'or-IN', pa: 'pa-IN', ur: 'ur-IN',
  as: 'as-IN', ne: 'ne-IN', sa: 'sa-IN',
};

// ─── Google Cloud TTS Voice Mapping ──────
const GOOGLE_TTS_VOICES = {
  en: { name: 'en-IN-Wavenet-D', languageCode: 'en-IN' },
  hi: { name: 'hi-IN-Wavenet-B', languageCode: 'hi-IN' },
  bn: { name: 'bn-IN-Wavenet-B', languageCode: 'bn-IN' },
  ta: { name: 'ta-IN-Wavenet-B', languageCode: 'ta-IN' },
  te: { name: 'te-IN-Standard-B', languageCode: 'te-IN' },
  gu: { name: 'gu-IN-Standard-B', languageCode: 'gu-IN' },
  kn: { name: 'kn-IN-Standard-B', languageCode: 'kn-IN' },
  ml: { name: 'ml-IN-Standard-B', languageCode: 'ml-IN' },
};

function getSpeechLang(lang) {
  return SPEECH_LANG_MAP[lang] || 'en-IN';
}

// ─── Text to Speech (Browser Fallback) ──────────────
export function speak(text, lang = 'en') {
  if (!('speechSynthesis' in window)) return;

  // Stop any existing speech
  window.speechSynthesis.cancel();

  // Strip markdown formatting for cleaner speech
  const cleanText = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, '. ')
    .replace(/\[Quick:[^\]]*\]/g, '')
    .trim();

  currentUtterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance.lang = getSpeechLang(lang);
  currentUtterance.rate = 0.9;
  currentUtterance.pitch = 1;
  currentUtterance.volume = 1;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find(v => v.lang.startsWith(currentUtterance.lang.slice(0, 2)));
  if (matchingVoice) currentUtterance.voice = matchingVoice;

  window.speechSynthesis.speak(currentUtterance);
}

// ─── Google Cloud TTS (Premium) ────────────────────
export async function speakPremium(text, lang = 'en') {
  try {
    stopSpeaking();

    const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY || import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_')) {
      console.warn('No Google Cloud API Key for TTS. Falling back to browser speech.');
      return speak(text, lang);
    }

    const voice = GOOGLE_TTS_VOICES[lang] || GOOGLE_TTS_VOICES['en'];
    
    // Strip markdown
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, '. ')
      .replace(/\[Quick:[^\]]*\]/g, '')
      .trim();

    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        input: { text: cleanText },
        voice: { 
          languageCode: voice.languageCode, 
          name: voice.name,
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: { audioEncoding: 'MP3' }
      }
    );

    const audioContent = response.data.audioContent;
    const audioBlob = new Blob([Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);

    currentAudio = new Audio(audioUrl);
    currentAudio.play();
  } catch (err) {
    console.error('Premium TTS failed:', err);
    speak(text, lang); // Fallback
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function isSpeaking() {
  const isBrowserSpeaking = 'speechSynthesis' in window && window.speechSynthesis.speaking;
  const isPremiumSpeaking = !!(currentAudio && !currentAudio.paused);
  return isBrowserSpeaking || isPremiumSpeaking;
}

// ─── Speech Recognition ────────────────────────────
export function startRecognition({ lang = 'en', onResult, onError, onEnd }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError?.('Speech recognition not supported in this browser');
    return null;
  }

  stopRecognition();

  recognition = new SpeechRecognition();
  recognition.lang = getSpeechLang(lang);
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult?.(transcript);
  };

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    const errorMessages = {
      'no-speech': 'No speech detected. Please try again.',
      'audio-capture': 'Microphone access denied.',
      'not-allowed': 'Microphone permission not granted.',
      'network': 'Network error during speech recognition.',
    };
    onError?.(errorMessages[event.error] || 'Speech recognition error. Please try again.');
  };

  recognition.onend = () => {
    onEnd?.();
  };

  try {
    recognition.start();
    return recognition;
  } catch (e) {
    onError?.('Could not start voice recognition. Please try again.');
    return null;
  }
}

export function stopRecognition() {
  if (recognition) {
    try { recognition.stop(); } catch (_) {}
    recognition = null;
  }
}

export function isSpeechRecognitionSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isTTSSupported() {
  return 'speechSynthesis' in window;
}
