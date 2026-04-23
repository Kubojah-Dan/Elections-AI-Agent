import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, FileText, Camera, MapPin, ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DocumentChecklist() {
  const { t } = useApp();
  const [task, setTask] = useState(null);

  const tasks = [
    { id: 'new', label: t('task_new_reg'), icon: <FileText size={20} /> },
    { id: 'update', label: t('task_update'), icon: <RotateCcw size={20} /> },
    { id: 'overseas', label: t('task_overseas'), icon: <MapPin size={20} /> },
  ];

  const getDocs = (taskId) => {
    switch (taskId) {
      case 'new':
        return [
          { category: t('identity_proof'), docs: t('id_docs_list'), icon: <Check size={16} /> },
          { category: t('address_proof'), docs: t('addr_docs_list'), icon: <MapPin size={16} /> },
          { category: t('photo_req'), docs: t('photo_desc'), icon: <Camera size={16} /> },
        ];
      case 'update':
        return [
          { category: t('identity_proof'), docs: t('id_docs_list'), icon: <Check size={16} /> },
          { category: 'Proof of Correction', docs: 'Document supporting the change (e.g., Marriage Certificate for name change, New Utility Bill for address)', icon: <Info size={16} /> },
        ];
      case 'overseas':
        return [
          { category: 'Valid Indian Passport', docs: 'Relevant pages showing photo, address in India, and visa details', icon: <FileText size={16} /> },
          { category: t('photo_req'), docs: t('photo_desc'), icon: <Camera size={16} /> },
        ];
      default:
        return [];
    }
  };

  if (!task) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-near-black">{t('select_task')}</p>
        <div className="grid gap-2">
          {tasks.map((tk) => (
            <button
              key={tk.id}
              onClick={() => setTask(tk.id)}
              className="flex items-center gap-3 p-4 bg-off-white hover:bg-light-gray border border-light-gray rounded-xl transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-india-navy shadow-sm">
                {tk.icon}
              </div>
              <span className="text-sm font-medium text-near-black flex-1">{tk.label}</span>
              <ArrowRight size={16} className="text-mid-gray" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-india-navy uppercase tracking-wider">
          {tasks.find(tk => tk.id === task)?.label}
        </h3>
        <button onClick={() => setTask(null)} className="text-xs text-mid-gray underline">
          {t('back')}
        </button>
      </div>

      <div className="space-y-3">
        {getDocs(task).map((doc, i) => (
          <div key={i} className="p-3 bg-white border border-light-gray rounded-xl flex gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-india-navy/5 text-india-navy flex items-center justify-center flex-shrink-0">
              {doc.icon}
            </div>
            <div>
              <div className="text-xs font-bold text-near-black mb-0.5">{doc.category}</div>
              <p className="text-xs text-mid-gray leading-relaxed">{doc.docs}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 items-start">
        <Info size={16} className="text-india-navy mt-0.5 flex-shrink-0" />
        <p className="text-xs text-india-navy/80 leading-snug">
          {t('official_voters_url_disclaimer')}
        </p>
      </div>
    </motion.div>
  );
}
