import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { getTranslation } from '../utils/translations';
import { translateText } from '../services/translationService';

// ─── Constants ────────────────────────────────────
export const LANGUAGES = [
  { code: 'hi', name: 'Hindi',      native: 'हिंदी',      script: 'devanagari' },
  { code: 'bn', name: 'Bengali',    native: 'বাংলা',      script: 'bengali'    },
  { code: 'te', name: 'Telugu',     native: 'తెలుగు',     script: 'telugu'     },
  { code: 'mr', name: 'Marathi',    native: 'मराठी',      script: 'devanagari' },
  { code: 'ta', name: 'Tamil',      native: 'தமிழ்',      script: 'tamil'      },
  { code: 'gu', name: 'Gujarati',   native: 'ગુજ઼ĴĬĢरती',   script: 'gujarati'   },
  { code: 'kn', name: 'Kannada',    native: 'ಕನ್ನಡ',      script: 'kannada'    },
  { code: 'ml', name: 'Malayalam',  native: 'മലയാളം',     script: 'malayalam'  },
  { code: 'or', name: 'Odia',       native: 'ଓଡ଼ିଆ',       script: 'odia'       },
  { code: 'pa', name: 'Punjabi',    native: 'ਪੰਜਾਬੀ',     script: 'gurmukhi'   },
  { code: 'as', name: 'Assamese',   native: 'অসমীয়া',    script: 'bengali'    },
  { code: 'mai',name: 'Maithili',   native: 'मैथिली',     script: 'devanagari' },
  { code: 'ur', name: 'Urdu',       native: 'اردو',       script: 'arabic'     },
  { code: 'sa', name: 'Sanskrit',   native: 'संस्कृत',     script: 'devanagari' },
  { code: 'ne', name: 'Nepali',     native: 'नेपाली',     script: 'devanagari' },
  { code: 'kok',name: 'Konkani',    native: 'कोंकणी',     script: 'devanagari' },
  { code: 'sd', name: 'Sindhi',     native: 'سنڌي',       script: 'arabic'     },
  { code: 'ks', name: 'Kashmiri',   native: 'کٲشرٕ',      script: 'arabic'     },
  { code: 'mni',name: 'Manipuri',   native: 'মৈতৈলোন্',  script: 'bengali'    },
  { code: 'doi',name: 'Dogri',      native: 'डोगरी',      script: 'devanagari' },
  { code: 'brx',name: 'Bodo',       native: 'बड়',        script: 'devanagari' },
  { code: 'sat',name: 'Santali',    native: 'ᱥᱟᱱᱛᱟᱲᱤ',   script: 'ol-chiki'   },
  { code: 'en', name: 'English',    native: 'English',    script: 'latin'      },
];

export const PERSONAS = [
  { id: 'first_time', label: 'First-Time Voter', labelHi: 'पहली बार मतदाता', icon: 'Star', desc: "I'm turning 18 or recently eligible" },
  { id: 'existing',   label: 'Registered Voter', labelHi: 'पंजीकृत मतदाता',  icon: 'CheckCircle', desc: "I'm already registered, need voting help" },
  { id: 'elderly',    label: 'Elderly Voter',     labelHi: 'वरिष्ठ मतदाता',  icon: 'HeartHandshake', desc: 'I need simple, clear guidance' },
  { id: 'nri',        label: 'NRI Voter',          labelHi: 'अनिवासी भारतीय', icon: 'Plane', desc: 'I live outside India' },
  { id: 'official',   label: 'Polling Official',   labelHi: 'मतदान अधिकारी',  icon: 'Landmark', desc: 'I work at an election booth' },
  { id: 'learner',    label: 'Curious Learner',    labelHi: 'जिज्ञासु शिक्षार्थी', icon: 'Lightbulb', desc: 'I want to understand elections' },
];

export const QUICK_REPLIES_DEFAULT = [
  'How do I register to vote?',
  'Am I eligible to vote?',
  'How do I vote on polling day?',
  'Types of elections in India',
];

// ─── Initial State ─────────────────────────────────
const INITIAL_STATE = {
  language: 'en',
  persona: null,
  onboardingComplete: false,
  messages: [
    {
      id: 1,
      role: 'assistant',
      content: 'Namaste! I am **Matdata Mitra** — your trusted guide to India\'s elections.\n\nI can help you with voter registration, understanding the voting process, finding your polling station, and much more.\n\nHow can I help you today?',
      timestamp: new Date().toISOString(),
    }
  ],
  isLoading: false,
  quickReplies: QUICK_REPLIES_DEFAULT,
  accessibilitySettings: {
    textSize: 'normal',   // 'normal' | 'large' | 'xlarge'
    darkMode: false,
    highContrast: false,
    readAloud: false,
    elderlyMode: false,
    simpleLanguage: false,
  },
};

// ─── Reducer ───────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'SET_PERSONA':
      return { 
        ...state, 
        persona: action.payload,
        messages: [
          {
            id: Date.now(),
            role: 'assistant',
            content: getTranslation(state.language, `greet_${action.payload}`),
            timestamp: new Date().toISOString(),
          }
        ]
      };

    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_QUICK_REPLIES':
      return { ...state, quickReplies: action.payload };

    case 'UPDATE_ACCESSIBILITY':
      return {
        ...state,
        accessibilitySettings: { ...state.accessibilitySettings, ...action.payload }
      };

    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [{
          id: Date.now(),
          role: 'assistant',
          content: 'Chat cleared. Namaste! How can I help you today?',
          timestamp: new Date().toISOString(),
        }]
      };

    case 'HYDRATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('matdata-mitra-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({
          type: 'HYDRATE',
          payload: {
            language: parsed.language || 'en',
            persona: parsed.persona || null,
            onboardingComplete: parsed.onboardingComplete || false,
            messages: parsed.messages || INITIAL_STATE.messages,
            accessibilitySettings: {
              ...INITIAL_STATE.accessibilitySettings,
              ...(parsed.accessibilitySettings || {}),
            },
          }
        });
      }
    } catch (e) {
      console.warn('Could not hydrate from localStorage', e);
    }
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      const toSave = {
        language: state.language,
        persona: state.persona,
        onboardingComplete: state.onboardingComplete,
        messages: state.messages.slice(-50), // keep last 50 messages
        accessibilitySettings: state.accessibilitySettings,
      };
      localStorage.setItem('matdata-mitra-state', JSON.stringify(toSave));
    } catch (e) {
      console.warn('Could not persist to localStorage', e);
    }
  }, [state.language, state.persona, state.onboardingComplete, state.messages, state.accessibilitySettings]);

  // Apply accessibility classes
  useEffect(() => {
    const { textSize, highContrast, elderlyMode, darkMode } = state.accessibilitySettings;
    const body = document.body;
    const html = document.documentElement;

    body.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    body.classList.add(`text-size-${elderlyMode ? 'xlarge' : textSize}`);
    body.classList.toggle('high-contrast', highContrast);

    // Dark mode on html element for Tailwind dark: variants
    html.classList.toggle('dark', darkMode);
  }, [state.accessibilitySettings]);

  // Dynamic UI Translation Cache (Persisted)
  const [dynamicCache, setDynamicCache] = useState(() => {
    try {
      const saved = localStorage.getItem('matdata-mitra-translations');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save cache to localStorage
  useEffect(() => {
    localStorage.setItem('matdata-mitra-translations', JSON.stringify(dynamicCache));
  }, [dynamicCache]);

  // Helper to translate
  const t = (key, fallback = '') => {
    // 1. Check static translations first
    const staticVal = getTranslation(state.language, key);
    
    // 2. If it's English (fallback) but the user language is regional
    const isEnFallback = staticVal === getTranslation('en', key);
    const isRegional = state.language !== 'en';

    if (isRegional && isEnFallback) {
      const cacheKey = `${state.language}:${key}`;
      if (dynamicCache[cacheKey]) return dynamicCache[cacheKey];

      // 3. Trigger background translation
      const enText = fallback || getTranslation('en', key);
      if (enText && typeof enText === 'string') {
        translateText(enText, state.language).then(translated => {
          if (translated && translated !== enText) {
            setDynamicCache(prev => ({ ...prev, [cacheKey]: translated }));
          }
        });
      }
    }

    return staticVal || fallback || key;
  };

  return (
    <AppContext.Provider value={{ state, dispatch, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
