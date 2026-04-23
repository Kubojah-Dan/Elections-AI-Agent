// src/components/chat/TypingIndicator.jsx
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 mb-3"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-india-navy flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">MM</span>
      </div>

      {/* Bubble with dots */}
      <div className="bubble-assistant px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot" style={{ animationDelay: '0ms' }} />
        <span className="typing-dot" style={{ animationDelay: '200ms' }} />
        <span className="typing-dot" style={{ animationDelay: '400ms' }} />
        <span className="text-xs text-mid-gray ml-1">Matdata Mitra is typing…</span>
      </div>
    </motion.div>
  );
}
