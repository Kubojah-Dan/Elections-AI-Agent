import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, User, Fingerprint, Box, ArrowRight, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const STEPS = [
  {
    id: 'id_check',
    title: '1. Identity Verification',
    desc: 'The Polling Officer checks your name in the electoral roll and verifies your ID (EPIC, Aadhaar, etc.).',
    icon: <User size={24} />,
    action: 'Verify ID'
  },
  {
    id: 'ink',
    title: '2. Indelible Ink',
    desc: 'A second officer marks your left forefinger with indelible ink and gives you a voter slip.',
    icon: <Fingerprint size={24} />,
    action: 'Get Ink'
  },
  {
    id: 'vote',
    title: '3. Casting Your Vote',
    desc: 'Enter the voting compartment. Press the blue button on the EVM next to the candidate of your choice.',
    icon: <Box size={24} />,
    action: 'Press EVM Button'
  },
  {
    id: 'vvpat',
    title: '4. VVPAT Verification',
    desc: 'A slip is visible in the VVPAT window for 7 seconds. Ensure it shows the correct candidate and symbol.',
    icon: <Info size={24} />,
    action: 'Confirm Slip'
  }
];

export default function PollingStationSimulator() {
  const { t } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setCompleted(false);
  };

  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="bg-[#0D2C6B] p-4 text-white">
        <h3 className="font-bold text-sm uppercase tracking-wider">Polling Day Simulator</h3>
        <p className="text-xs text-white/70">Experience the 4 steps of voting at the booth</p>
      </div>

      <div className="p-5">
        {!completed ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-india-green' : 'bg-light-gray'}`} 
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-off-white flex items-center justify-center text-india-navy mx-auto mb-4 shadow-inner">
                  {STEPS[currentStep].icon}
                </div>
                <h4 className="font-bold text-near-black mb-2">{STEPS[currentStep].title}</h4>
                <p className="text-sm text-mid-gray leading-relaxed mb-6">
                  {STEPS[currentStep].desc}
                </p>
                <button 
                  onClick={next}
                  className="btn-primary w-full justify-center py-3"
                >
                  {STEPS[currentStep].action} <ArrowRight size={18} className="ml-2" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="text-center py-8"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-india-green mx-auto mb-4">
              <Check size={40} strokeWidth={3} />
            </div>
            <h4 className="font-bold text-2xl text-near-black mb-2">Vote Cast Successfully!</h4>
            <p className="text-sm text-mid-gray mb-6">
              You have successfully completed the voting process. Your vote is secret and safe.
            </p>
            <button onClick={reset} className="btn-secondary w-full justify-center">
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
