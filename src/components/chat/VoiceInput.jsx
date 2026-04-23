// src/components/chat/VoiceInput.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { startRecognition, stopRecognition, isSpeechRecognitionSupported } from '../../services/speechService';
import { useApp } from '../../context/AppContext';

export default function VoiceInput({ onTranscript, disabled }) {
  const { state } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    return () => stopRecognition();
  }, []);

  if (!supported) return null;

  function toggle() {
    if (isListening) {
      stopRecognition();
      setIsListening(false);
    } else {
      setError(null);
      setIsListening(true);
      startRecognition({
        lang: state.language,
        onResult: (transcript) => {
          setIsListening(false);
          onTranscript(transcript);
        },
        onError: (msg) => {
          setError(msg);
          setIsListening(false);
        },
        onEnd: () => setIsListening(false),
      });
    }
  }

  return (
    <div className="relative flex items-center">
      {/* Error tooltip */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-200 ${
          isListening
            ? 'bg-red-500 border-red-500 text-white shadow-lg'
            : disabled
            ? 'bg-light-gray border-light-gray text-mid-gray cursor-not-allowed'
            : 'bg-white border-border-gray text-mid-gray hover:border-india-navy hover:text-india-navy'
        }`}
        onClick={toggle}
        disabled={disabled}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        title={isListening ? 'Stop recording' : 'Voice input'}
        animate={isListening ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
      >
        {isListening ? (
          /* Waveform when listening */
          <div className="flex items-center gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="waveform-bar"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
        )}
      </motion.button>

      {/* Listening badge */}
      <AnimatePresence>
        {isListening && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-red-500 font-medium whitespace-nowrap"
          >
            Listening…
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
