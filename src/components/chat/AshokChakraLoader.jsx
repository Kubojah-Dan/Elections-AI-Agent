// src/components/chat/AshokChakraLoader.jsx
import { motion } from 'framer-motion';

export default function AshokChakraLoader({ message = 'Matdata Mitra is thinking…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <motion.svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        aria-label="Loading"
      >
        {/* Outer ring */}
        <circle cx="28" cy="28" r="26" stroke="#0D2C6B" strokeWidth="2" opacity="0.2"/>
        {/* Inner ring */}
        <circle cx="28" cy="28" r="8" fill="none" stroke="#0D2C6B" strokeWidth="2"/>
        {/* Center dot */}
        <circle cx="28" cy="28" r="3" fill="#FF9933"/>
        {/* 24 spokes */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = 28 + 9 * Math.cos(angle);
          const y1 = 28 + 9 * Math.sin(angle);
          const x2 = 28 + 22 * Math.cos(angle);
          const y2 = 28 + 22 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke="#0D2C6B"
              strokeWidth="1.2"
              opacity={i % 2 === 0 ? 0.8 : 0.3}
            />
          );
        })}
      </motion.svg>
      <p className="text-sm text-mid-gray font-medium text-center">{message}</p>
    </div>
  );
}
