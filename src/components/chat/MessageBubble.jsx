// src/components/chat/MessageBubble.jsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { speak } from '../../services/speechService';
import SourceCard from '../ui/SourceCard';
import { RichParser } from './RichResponse';

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function MessageBubble({ message }) {
  const { state } = useApp();
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null
  const [showActions, setShowActions] = useState(false);
  const isAssistant = message.role === 'assistant';

  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = message.content;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleSpeak() {
    if (speaking) {
      window.speechSynthesis?.cancel();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speak(message.content, state.language);
      const check = setInterval(() => {
        if (!window.speechSynthesis?.speaking) {
          setSpeaking(false);
          clearInterval(check);
        }
      }, 500);
    }
  }

  const cleanContent = message.content
    .replace(/\[Quick:[^\]]*\]/g, '')
    .replace(/\[Source:[^\]]*\]/g, '')
    .replace(/\[Warning:[^\]]*\]/g, '')
    .replace(/\[Success:[^\]]*\]/g, '')
    .replace(/\[Info:[^\]]*\]/g, '')
    .replace(/\[Action:[^\]]*\]/g, '')
    .replace(/\[Step:[^\]]*\]/g, '')
    .replace(/\[Form:[^\]]*\]/g, '')
    .trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-3`}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-india-navy flex items-center justify-center flex-shrink-0 mr-2 mt-1">
          <span className="text-white text-xs font-bold">MM</span>
        </div>
      )}

      <div
        className={`group relative flex flex-col gap-1 ${isAssistant ? 'items-start' : 'items-end'} max-w-[85%]`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onFocus={() => setShowActions(true)}
        onBlur={() => setShowActions(false)}
      >
        {/* Bubble */}
        <div
          className={`px-4 py-3 leading-relaxed text-sm ${isAssistant ? 'bubble-assistant' : 'bubble-user'}`}
        >
          {isAssistant ? (
            <div className="prose-sm">
              <RichParser text={parseMarkdown(message.content)} />
            </div>
          ) : (
            <span>{cleanContent}</span>
          )}
        </div>

        {/* Source Card */}
        {isAssistant && message.source && (
          <div className="w-full">
            <SourceCard 
              title={message.source.title} 
              url={message.source.url} 
              label={state.language === 'hi' ? 'आधिकारिक स्रोत' : 'Official Source'}
            />
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-mid-gray px-1">{time}</span>

        {/* Action buttons — assistant only */}
        {isAssistant && (
          <AnimatePresence>
            {(showActions || speaking) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1 bg-white border border-light-gray rounded-full px-2 py-1 shadow-card"
              >
                {/* Read aloud */}
                <button
                  className={`btn-ghost w-7 h-7 min-h-0 min-w-0 ${speaking ? 'text-saffron' : ''}`}
                  onClick={handleSpeak}
                  aria-label={speaking ? 'Stop reading' : 'Read aloud'}
                  title={speaking ? 'Stop' : 'Read aloud'}
                >
                  {speaking ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="5" width="4" height="14" rx="1"/>
                      <rect x="14" y="5" width="4" height="14" rx="1"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  )}
                </button>

                {/* Copy */}
                <button
                  className="btn-ghost w-7 h-7 min-h-0 min-w-0"
                  onClick={handleCopy}
                  aria-label={copied ? 'Copied!' : 'Copy message'}
                  title={copied ? 'Copied!' : 'Copy'}
                >
                  {copied ? (
                    <svg className="w-4 h-4 text-india-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  )}
                </button>

                {/* Divider */}
                <span className="w-px h-4 bg-light-gray mx-0.5"/>

                {/* Thumbs up */}
                <button
                  className={`btn-ghost w-7 h-7 min-h-0 min-w-0 ${feedback === 'up' ? 'text-india-green' : ''}`}
                  onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                  aria-label="Helpful"
                  aria-pressed={feedback === 'up'}
                  title="Helpful"
                >
                  <svg className="w-4 h-4" fill={feedback === 'up' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </button>

                {/* Thumbs down */}
                <button
                  className={`btn-ghost w-7 h-7 min-h-0 min-w-0 ${feedback === 'down' ? 'text-red-500' : ''}`}
                  onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                  aria-label="Not helpful"
                  aria-pressed={feedback === 'down'}
                  title="Not helpful"
                >
                  <svg className="w-4 h-4" fill={feedback === 'down' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
