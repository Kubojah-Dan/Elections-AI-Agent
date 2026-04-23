import { Check, Info, AlertTriangle, CheckCircle2, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const WarningBox = ({ children }) => (
  <div className="my-3 p-3 rounded-lg bg-red-50 border-l-4 border-red-500 flex gap-3">
    <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
    <p className="text-xs text-red-900 font-medium leading-relaxed m-0">{children}</p>
  </div>
);

export const SuccessBox = ({ children }) => (
  <div className="my-3 p-3 rounded-lg bg-green-50 border-l-4 border-green-500 flex gap-3">
    <CheckCircle2 className="text-india-green flex-shrink-0" size={20} />
    <p className="text-xs text-green-900 font-medium leading-relaxed m-0">{children}</p>
  </div>
);

export const InfoCard = ({ children }) => (
  <div className="my-3 p-3 rounded-lg bg-blue-50 border-l-4 border-india-navy flex gap-3">
    <Info className="text-india-navy flex-shrink-0" size={20} />
    <p className="text-xs text-india-navy font-medium leading-relaxed m-0">{children}</p>
  </div>
);

export const ActionCard = ({ label, url }) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="my-3 flex items-center justify-between p-3 rounded-xl bg-india-navy text-white no-underline shadow-md hover:shadow-lg transition-all"
    style={{ background: 'var(--gradient-navy)' }}
  >
    <span className="text-sm font-bold">{label}</span>
    <ExternalLink size={16} className="text-india-saffron" />
  </motion.a>
);

export const StepList = ({ steps }) => (
  <div className="my-3 space-y-2">
    {steps.map((step, idx) => (
      <div key={idx} className="flex gap-3">
        <div className="w-6 h-6 rounded-full bg-india-navy text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
          {idx + 1}
        </div>
        <p className="text-sm text-near-black m-0 pt-0.5">{step}</p>
      </div>
    ))}
  </div>
);

export const FormGuideCard = ({ name, desc }) => (
  <div className="my-3 p-4 rounded-xl border-2 border-dashed border-light-gray bg-white">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 rounded-lg bg-india-saffron/10 flex items-center justify-center">
        <Check size={18} className="text-india-saffron" />
      </div>
      <span className="font-bold text-india-navy">{name}</span>
    </div>
    <p className="text-xs text-mid-gray m-0 leading-relaxed">{desc}</p>
  </div>
);

export const CheckBoxList = ({ items }) => (
  <div className="my-3 p-4 rounded-xl bg-off-white border border-light-gray">
    <div className="text-[10px] font-bold text-mid-gray uppercase mb-3 tracking-wider">Required Documents</div>
    <div className="space-y-2.5">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="mt-0.5 w-4 h-4 rounded border border-india-navy/30 flex items-center justify-center bg-white">
            <Check size={12} className="text-india-green" />
          </div>
          <span className="text-sm text-near-black">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

export const RichParser = ({ text }) => {
  if (!text) return null;

  // Split text by rich tags
  const parts = text.split(/(\[Warning:[^\]]+\]|\[Success:[^\]]+\]|\[Info:[^\]]+\]|\[Action:[^\]]+\]|\[Step:[^\]]+\]|\[Form:[^\]]+\]|\[Check:[^\]]+\])/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[Warning:')) {
          return <WarningBox key={i}>{part.slice(9, -1)}</WarningBox>;
        }
        if (part.startsWith('[Success:')) {
          return <SuccessBox key={i}>{part.slice(9, -1)}</SuccessBox>;
        }
        if (part.startsWith('[Info:')) {
          return <InfoCard key={i}>{part.slice(6, -1)}</InfoCard>;
        }
        if (part.startsWith('[Action:')) {
          const [label, url] = part.slice(8, -1).split('|').map(s => s.trim());
          return <ActionCard key={i} label={label} url={url} />;
        }
        if (part.startsWith('[Step:')) {
          const steps = part.slice(6, -1).split('|').map(s => s.trim());
          return <StepList key={i} steps={steps} />;
        }
        if (part.startsWith('[Form:')) {
          const [name, desc] = part.slice(6, -1).split('|').map(s => s.trim());
          return <FormGuideCard key={i} name={name} desc={desc} />;
        }
        if (part.startsWith('[Check:')) {
          const items = part.slice(7, -1).split('|').map(s => s.trim());
          return <CheckBoxList key={i} items={items} />;
        }
        return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </>
  );
};
