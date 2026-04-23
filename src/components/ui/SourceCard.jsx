import { ExternalLink, ShieldCheck } from 'lucide-react';

export default function SourceCard({ title, url, label }) {
  return (
    <div className="mt-2 bg-india-navy/5 border border-india-navy/10 rounded-xl p-3 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-india-navy shadow-sm flex-shrink-0">
        <ShieldCheck size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-india-navy uppercase tracking-wider mb-0.5">
          {label || 'Official Source'}
        </div>
        <div className="text-xs font-semibold text-near-black truncate mb-1">
          {title}
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-1 text-[10px] text-india-navy hover:underline font-bold"
        >
          View on eci.gov.in <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}
