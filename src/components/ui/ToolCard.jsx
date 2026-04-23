// src/components/ui/ToolCard.jsx
import { motion } from 'framer-motion';

export default function ToolCard({ icon, title, subtitle, description, action, actionLabel, badge }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card p-5 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-off-white flex items-center justify-center text-2xl flex-shrink-0">
            {icon}
          </div>
          <div>
            <div className="font-semibold text-near-black text-sm leading-snug">{title}</div>
            {subtitle && <div className="text-xs text-mid-gray">{subtitle}</div>}
          </div>
        </div>
        {badge && (
          <span className="text-xs font-bold bg-india-green text-white px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-mid-gray leading-relaxed">{description}</p>
      )}

      {/* Action */}
      {action && (
        <button
          onClick={action}
          className="btn-primary w-full justify-center text-sm py-2.5"
        >
          {actionLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}
