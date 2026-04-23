import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, UserCheck, Smartphone, Landmark, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function GuidedJourneys() {
  const { t } = useApp();
  const [activeJourney, setActiveJourney] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const journeys = [
    {
      id: 'who',
      title: t('journey_who_can'),
      icon: <UserCheck size={24} />,
      color: '#0D2C6B',
      steps: [
        { title: 'Citizenship', text: 'You must be a citizen of India to register as a voter.', icon: <Landmark /> },
        { title: 'Age Requirement', text: 'You must be 18 years or older on the qualifying date (Jan 1st, April 1st, July 1st, or Oct 1st).', icon: <CheckCircle2 /> },
        { title: 'Residency', text: 'You should be an ordinary resident of the polling area where you want to register.', icon: <Info /> },
      ]
    },
    {
      id: 'id',
      title: t('journey_voter_id'),
      icon: <Smartphone size={24} />,
      color: '#138808',
      steps: [
        { title: 'Apply Online', text: 'Visit voters.eci.gov.in and fill Form 6. It is 100% free.', icon: <Smartphone /> },
        { title: 'Verification', text: 'A Booth Level Officer (BLO) will visit your home to verify your details.', icon: <UserCheck /> },
        { title: 'Approval', text: 'Once approved, your name enters the roll and EPIC is generated.', icon: <CheckCircle2 /> },
      ]
    },
    {
      id: 'booth',
      title: t('journey_polling_day'),
      icon: <Landmark size={24} />,
      color: '#FF9933',
      steps: [
        { title: 'Identity Check', text: 'Show your EPIC or approved ID to the first polling officer.', icon: <UserCheck /> },
        { title: 'Ink & Register', text: 'The second officer inks your finger and takes your signature.', icon: <Info /> },
        { title: 'Cast Vote', text: 'The third officer enables the EVM. Go to the cabinet and press your choice.', icon: <CheckCircle2 /> },
      ]
    }
  ];

  const currentJourney = journeys.find(j => j.id === activeJourney);

  function nextStep() {
    if (stepIndex < currentJourney.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setActiveJourney(null);
      setStepIndex(0);
    }
  }

  function prevStep() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      setActiveJourney(null);
    }
  }

  if (!activeJourney) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {journeys.map((j) => (
          <motion.button
            key={j.id}
            whileHover={{ y: -2 }}
            onClick={() => { setActiveJourney(j.id); setStepIndex(0); }}
            className="flex items-center gap-4 p-4 bg-white border-2 border-india-navy/10 rounded-2xl text-left shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg"
                 style={{ background: j.color }}>
              {j.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-near-black text-sm">{j.title}</h3>
              <p className="text-xs text-mid-gray mt-0.5">{j.steps.length} {t('steps', 'Steps')}</p>
            </div>
            <ChevronRight size={20} className="text-india-navy/30" />
          </motion.button>
        ))}
      </div>
    );
  }

  const currentStep = currentJourney.steps[stepIndex];

  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-6 min-h-[16rem] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: currentJourney.color }}>
             {currentJourney.icon}
           </div>
           <span className="text-xs font-bold text-india-navy uppercase tracking-widest">{currentJourney.title}</span>
        </div>
        <div className="text-[10px] font-bold text-mid-gray bg-off-white px-2 py-1 rounded-full">
          {t('journey_step').replace('%s', stepIndex + 1).replace('%s', currentJourney.steps.length)}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <motion.div 
          key={stepIndex}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center text-india-navy mx-auto border-2 border-india-navy/5">
            {currentStep.icon}
          </div>
          <div>
            <h4 className="font-serif font-bold text-xl text-near-black mb-2">{currentStep.title}</h4>
            <p className="text-sm text-mid-gray leading-relaxed max-w-xs">{currentStep.text}</p>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-3 mt-8 pt-4 border-t border-light-gray">
        <button onClick={prevStep} className="btn-secondary flex-1 justify-center py-3">
          <ChevronLeft size={18} /> {stepIndex === 0 ? t('cancel', 'Cancel') : t('back')}
        </button>
        <button onClick={nextStep} className="btn-primary flex-1 justify-center py-3">
          {stepIndex === currentJourney.steps.length - 1 ? t('finish', 'Finish') : t('next')} <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
