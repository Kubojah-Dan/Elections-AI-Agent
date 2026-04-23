// src/services/translationService.js

const LANG_MAP = {
  hi: 'hi', bn: 'bn', te: 'te', mr: 'mr', ta: 'ta',
  gu: 'gu', kn: 'kn', ml: 'ml', or: 'or', pa: 'pa',
  as: 'as', ur: 'ur', ne: 'ne', sa: 'sa', en: 'en',
  mai: 'hi', kok: 'mr', sd: 'sd', ks: 'ks', // approximate
  mni: 'bn', doi: 'hi', brx: 'hi', sat: 'en', // fallback maps
};

const cache = new Map();

/**
 * Translate text using MyMemory API (free, no key required for basic use)
 */
export async function translateText(text, targetLang = 'en') {
  if (!text || targetLang === 'en') return text;

  const apiLang = LANG_MAP[targetLang] || 'en';
  if (apiLang === 'en') return text;

  const cacheKey = `${apiLang}:${text.slice(0, 50)}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const encoded = encodeURIComponent(text.slice(0, 500)); // MyMemory limit
    const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|${apiLang}`;
    
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('Translation request failed');
    
    const data = await res.json();
    if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      cache.set(cacheKey, translated);
      return translated;
    }
    return text; // Return original if translation fails
  } catch {
    return text; // Graceful fallback
  }
}

/**
 * Get UI label in current language
 */
export const UI_LABELS = {
  en: {
    chat: 'Chat',
    learn: 'Learn',
    tools: 'Tools',
    settings: 'Settings',
    typeMessage: 'Ask me anything about elections...',
    send: 'Send',
    listening: 'Listening...',
    thinking: 'Matdata Mitra is thinking...',
    clearChat: 'Clear Chat',
    copyMessage: 'Copy',
    readAloud: 'Read aloud',
    helpful: 'Helpful',
    notHelpful: 'Not helpful',
    welcomeTitle: 'Matdata Mitra',
    welcomeSub: 'Your trusted guide to India\'s elections',
    selectLanguage: 'Choose your language',
    continueEnglish: 'Continue in English',
    whoAreYou: 'Who are you?',
    whatHelp: 'What do you need help with?',
    getStarted: 'Get Started',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    official: 'Official ECI source',
  },
  hi: {
    chat: 'चैट',
    learn: 'सीखें',
    tools: 'उपकरण',
    settings: 'सेटिंग',
    typeMessage: 'चुनाव के बारे में कुछ भी पूछें...',
    send: 'भेजें',
    listening: 'सुन रहे हैं...',
    thinking: 'मतदाता मित्र सोच रहे हैं...',
    clearChat: 'चैट साफ़ करें',
    copyMessage: 'कॉपी',
    readAloud: 'ज़ोर से पढ़ें',
    helpful: 'उपयोगी',
    notHelpful: 'उपयोगी नहीं',
    welcomeTitle: 'मतदाता मित्र',
    welcomeSub: 'भारत के चुनाव के लिए आपका विश्वसनीय मार्गदर्शक',
    selectLanguage: 'अपनी भाषा चुनें',
    continueEnglish: 'अंग्रेज़ी में जारी रखें',
    whoAreYou: 'आप कौन हैं?',
    whatHelp: 'आपको किस चीज़ में मदद चाहिए?',
    getStarted: 'शुरू करें',
    back: 'वापस',
    next: 'अगला',
    skip: 'छोड़ें',
    official: 'ECI आधिकारिक स्रोत',
  },
};

export function getLabel(key, lang = 'en') {
  return UI_LABELS[lang]?.[key] || UI_LABELS['en'][key] || key;
}
