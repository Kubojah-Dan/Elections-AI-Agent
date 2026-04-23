import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MythCard({ myth, fact, index }) {
  const { t } = useApp();
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card cursor-pointer w-full ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setFlipped(!flipped)}
      tabIndex={0}
      role="button"
      aria-label={`${t('myth_label')} ${index + 1}. ${t('tap_reveal')}`}
      style={{ perspective: '1000px' }}
    >
      <div
        className="grid w-full"
        style={{
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front — Myth */}
        <div
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', gridArea: '1 / 1' }}
          className="rounded-card bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-900/50 flex flex-col items-center justify-center p-5 text-center gap-3 min-h-[12rem] h-full"
        >
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
            <X size={20} className="text-red-500 stroke-[3px]" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wide mb-1">{t('myth_label')}</div>
            <p className="text-sm font-medium text-near-black leading-snug">{myth}</p>
          </div>
          <div className="text-xs text-mid-gray mt-1">{t('tap_reveal')}</div>
        </div>

        {/* Back — Fact */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            gridArea: '1 / 1'
          }}
          className="rounded-card bg-green-50 dark:bg-green-950/40 border-2 border-green-200 dark:border-green-900/50 flex flex-col items-center justify-center p-5 text-center gap-3 min-h-[12rem] h-full"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
            <Check size={20} className="text-india-green dark:text-green-500 stroke-[3px]" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-xs font-bold text-india-green dark:text-green-400 uppercase tracking-wide mb-1">{t('fact_label')}</div>
            <p className="text-sm font-medium text-near-black leading-snug">{fact}</p>
          </div>
          <div className="text-xs text-mid-gray mt-1">{t('tap_flip')}</div>
        </div>
      </div>
    </div>
  );
}
