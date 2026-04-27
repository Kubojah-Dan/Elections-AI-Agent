// src/pages/ChatPage.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, QUICK_REPLIES_DEFAULT } from '../context/AppContext';
import { getAgentResponse, extractQuickReplies, extractSource, cleanResponseText } from '../services/aiService';
import { AlertTriangle } from 'lucide-react';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import VoiceInput from '../components/chat/VoiceInput';

const QUICK_REPLY_SETS = {
  first_time:  ['qr_first_time_1', 'qr_first_time_2', 'qr_first_time_3', 'qr_first_time_4'],
  existing:    ['qr_existing_1', 'qr_existing_2', 'qr_existing_3', 'qr_existing_4'],
  elderly:     ['qr_elderly_1', 'qr_elderly_2', 'qr_elderly_3', 'qr_elderly_4'],
  nri:         ['qr_nri_1', 'qr_nri_2', 'qr_nri_3', 'qr_nri_4'],
  official:    ['qr_official_1', 'qr_official_2', 'qr_official_3', 'qr_official_4'],
  learner:     ['qr_learner_1', 'qr_learner_2', 'qr_learner_3', 'qr_learner_4'],
};

export default function ChatPage() {
  const { state, dispatch, t } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const personaQuickReplies = QUICK_REPLY_SETS[state.persona] || QUICK_REPLY_SETS.learner;
  const translatedQuickReplies = personaQuickReplies.map(qr => t(qr));

  const quickReplies = state.quickReplies?.length > 0
    ? state.quickReplies
    : translatedQuickReplies;

  useEffect(() => {
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isLoading]);


  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || state.isLoading) return;

    setInput('');

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_QUICK_REPLIES', payload: [] });

    try {
      const allMessages = [...state.messages, userMsg];
      const responseText = await getAgentResponse(
        allMessages,
        state.persona,
        state.language
      );

      const quickRepliesFromResponse = extractQuickReplies(responseText);
      const source = extractSource(responseText);
      const cleanText = cleanResponseText(responseText);

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: cleanText,
        source: source,
        timestamp: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMsg });
      dispatch({
        type: 'SET_QUICK_REPLIES',
        payload: quickRepliesFromResponse.length > 0
          ? quickRepliesFromResponse
          : QUICK_REPLY_SETS[state.persona] || QUICK_REPLIES_DEFAULT,
      });

      // Auto read-aloud if enabled
      if (state.accessibilitySettings.readAloud) {
        const { speak, speakPremium } = await import('../services/speechService');
        if (state.accessibilitySettings.premiumVoice) {
          speakPremium(cleanText, state.language);
        } else {
          speak(cleanText, state.language);
        }
      }

    } catch (err) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now() + 1,
          role: 'assistant',
          content: t('chat_error'),
          timestamp: new Date().toISOString(),
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [input, state.messages, state.persona, state.language, state.isLoading, state.accessibilitySettings.readAloud, dispatch]);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleVoiceTranscript(transcript) {
    setInput(transcript);
    setTimeout(() => sendMessage(transcript), 100);
  }

  function clearChat() {
    if (window.confirm(t('clear_confirm'))) {
      dispatch({ type: 'CLEAR_MESSAGES' });
    }
  }

  return (
    <div className="flex flex-col" style={{ height: '100dvh', background: 'var(--bg-primary)' }}>

      {/* Offline banner — only when browser is actually offline */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden text-xs text-center px-4"
            style={{
              marginTop: 'var(--topbar-height)',
              background: 'rgba(245,158,11,0.12)',
              borderBottom: '1px solid rgba(245,158,11,0.3)',
              color: '#92400E',
              paddingTop: 6,
              paddingBottom: 6,
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle size={14} />
              <span>{t('offline_banner')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: `calc(var(--topbar-height) + ${isOnline ? 16 : 0}px)`,
          paddingBottom: 160,
          paddingLeft: 16,
          paddingRight: 16,
        }}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        {/* Desktop: constrain chat to readable width */}
        <div className="max-w-3xl mx-auto">
          {/* Welcome banner */}
          {state.messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 rounded-xl border"
              style={{
                background: 'rgba(13,44,107,0.06)',
                borderColor: 'rgba(13,44,107,0.15)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--navy)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <span className="text-xs font-semibold" style={{ color: 'var(--navy)' }}>{t('official_only')}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {t('official_note')}
              </p>
            </motion.div>
          )}

          {state.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          <AnimatePresence>
            {state.isLoading && <TypingIndicator />}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div
        className="flex-shrink-0 border-t"
        style={{
          background: 'var(--bg-nav)',
          borderColor: 'var(--border)',
          paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Quick reply chips */}
          <AnimatePresence>
            {quickReplies.length > 0 && !state.isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto"
                style={{ scrollbarWidth: 'none' }}
                role="list"
                aria-label="Quick reply suggestions"
              >
                {quickReplies.slice(0, 4).map((reply, i) => (
                  <motion.button
                    key={reply}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="quick-reply-chip flex-shrink-0"
                    onClick={() => sendMessage(reply)}
                    role="listitem"
                  >
                    {reply}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text input row */}
          <div className="flex items-end gap-2 px-4 pb-3 pt-2">
            <VoiceInput onTranscript={handleVoiceTranscript} disabled={state.isLoading} />

            <div className="flex-1">
              <textarea
                ref={inputRef}
                className="w-full resize-none rounded-2xl text-sm focus:outline-none transition-colors"
                style={{
                  minHeight: 48,
                  maxHeight: 120,
                  padding: '12px 16px',
                  background: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                placeholder={t('ask_placeholder')}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--navy)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                onKeyDown={handleKeyDown}
                disabled={state.isLoading}
                aria-label="Message input"
                rows={1}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all"
              style={{
                background: input.trim() && !state.isLoading ? 'var(--navy)' : 'var(--border)',
                color: input.trim() && !state.isLoading ? 'white' : 'var(--text-muted)',
                boxShadow: input.trim() && !state.isLoading ? '0 2px 12px rgba(13,44,107,0.3)' : 'none',
              }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || state.isLoading}
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </motion.button>
          </div>

          {/* Clear button */}
          <div className="flex justify-center pb-1">
            <button
              className="text-xs px-3 py-1 rounded-md transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.target.style.color = '#EF4444'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              onClick={clearChat}
            >
              {t('clear_conversation')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

