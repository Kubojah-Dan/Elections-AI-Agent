import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, FileText, Smartphone, Phone, AlertTriangle,
  Check, ArrowRight, Download, Lock, ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getContent } from '../data/electionContent';
import ToolCard from '../components/ui/ToolCard';
import DocumentChecklist from '../components/ui/DocumentChecklist';
import PollingStationSimulator from '../components/ui/PollingStationSimulator';
import PollingMap from '../components/tools/PollingMap';

// ─── Form Decision Tree ────────────────────────────
function FormFinder() {
  const { t } = useApp();
  const content = getContent(t);
  const FORM_TREE = content.FORM_TREE;

  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const currentIdx = answers.length;
  const currentQ = currentIdx === 0
    ? FORM_TREE[0]
    : FORM_TREE.find(q => q.id === answers[answers.length - 1]?.next);

  function answer(yes) {
    const q = currentIdx === 0 ? FORM_TREE[0] : currentQ;
    if (!q) return;

    const dest = yes ? q.yes : q.no;
    if (typeof dest === 'object') {
      setResult(dest);
    } else if (dest === 'none') {
      setResult({ form: null });
    } else {
      setAnswers(prev => [...prev, { qId: q.id || 'q0', next: dest }]);
    }
  }

  function resetTree() {
    setAnswers([]);
    setResult(null);
  }

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        {result.form ? (
          <>
            <div className="p-4 bg-green-50 border-2 border-india-green rounded-card">
              <div className="text-xs font-bold text-india-green mb-1">{t('recommended_form')}</div>
              <div className="text-2xl font-serif font-bold text-india-navy mb-1">{result.form}</div>
              <p className="text-sm text-mid-gray">{result.desc}</p>
            </div>
            <a href={result.link} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center no-underline">
              {t('Fill %s Now').replace('%s', result.form)} ↗
            </a>
          </>
        ) : (
          <div className="p-4 bg-off-white border border-light-gray rounded-card text-sm text-mid-gray">
            {t('Please contact your local Electoral Registration Officer (ERO) or call 1950 for guidance.')}
          </div>
        )}
        <button onClick={resetTree} className="btn-secondary w-full">
          ↩ {t('start_over')}
        </button>
      </motion.div>
    );
  }

  const qToShow = currentIdx === 0 ? FORM_TREE[0] : currentQ;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < currentIdx ? 'bg-india-green' : i === currentIdx ? 'bg-india-navy' : 'bg-light-gray'}`} />
        ))}
      </div>

      {qToShow && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-semibold text-sm text-near-black mb-4">{qToShow.question}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => answer(true)} className="btn-primary py-3 justify-center flex items-center gap-1.5">{t('yes')} <Check size={16} /></button>
              <button onClick={() => answer(false)} className="btn-secondary py-3 justify-center flex items-center gap-1.5">{t('no')} <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {currentIdx > 0 && (
        <button onClick={resetTree} className="text-xs text-mid-gray underline">{t('start_over')}</button>
      )}
    </div>
  );
}

// ─── Main ToolsPage ────────────────────────────────
export default function ToolsPage() {
  const { t, state } = useApp();
  const [showFormFinder, setShowFormFinder] = useState(false);
  const [selectedState, setSelectedState] = useState('Delhi');

  return (
    <div className="content-area">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="mb-4">
          <h1 className="section-header">Quick Tools</h1>
          {state.language !== 'en' && (
            <p className="text-xs font-bold text-india-saffron -mt-1 mb-1">
              {t('quick_tools')}
            </p>
          )}
          <p className="section-sub">{t('tagline_tools')}</p>
        </div>

        {/* ECI disclaimer */}
        <div className="mb-4 flex items-center gap-2 bg-off-white border border-light-gray rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-india-green flex-shrink-0" />
          <span className="text-xs text-mid-gray">{t('All links go directly to official Government of India / ECI websites')}</span>
        </div>

        <div className="space-y-4">
          {/* Check Voter Status */}
          <ToolCard
            icon={<Search size={22} className="text-india-navy" />}
            title={t('Check Voter Status')}
            subtitle="electoralsearch.eci.gov.in"
            description={t("Find out if you're registered to vote. Enter your name and state to see your registration status and polling station details.")}
            action={() => window.open('https://electoralsearch.eci.gov.in', '_blank', 'noopener,noreferrer')}
            actionLabel={t('Check My Status')}
          />

          {/* NEW: Interactive Booth Locator (Moved up for visibility) */}
          <div className="card p-5 border-2 border-india-navy/10 bg-white/50">
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-india-navy/10 flex items-center justify-center text-india-navy">
                  <MapPin size={18} />
                </div>
                <h4 className="text-sm font-bold text-india-navy uppercase tracking-wide">
                  {t('Interactive Booth Locator')}
                </h4>
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="state-select" className="text-[10px] font-bold text-mid-gray uppercase tracking-wider ml-1">
                  {t('Select Your State')}:
                </label>
                <select 
                  id="state-select"
                  className="w-full bg-white text-black border-2 border-light-gray rounded-xl px-4 py-3 text-sm font-bold shadow-sm focus:border-india-navy outline-none cursor-pointer transition-all hover:bg-off-white"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>
            </div>
            
            <PollingMap selectedState={selectedState} />
            <p className="text-[10px] text-mid-gray mt-3 italic text-center">
              * {t('Map markers are for demonstration. Always refer to official ECI documents for your assigned booth.')}
            </p>
          </div>

          {/* Polling Day Simulator */}
          <div className="mb-6">
            <PollingStationSimulator />
          </div>

          {/* Find Polling Station (Link) */}
          <ToolCard
            icon={<MapPin size={22} className="text-india-navy" />}
            title={t('Find Polling Station')}
            subtitle={t('ECI Official Locator')}
            description={t("Your polling station is usually within 2km of your registered address. Use ECI's tool to find exact location and booth number.")}
            action={() => window.open('https://electoralsearch.eci.gov.in', '_blank', 'noopener,noreferrer')}
            actionLabel={t('Find My Booth')}
          />

          {/* Form Finder */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-off-white flex items-center justify-center text-india-navy">
                <FileText size={22} />
              </div>
              <div>
                <div className="font-semibold text-near-black text-sm">{t('form_finder_title')}</div>
                <div className="text-xs text-mid-gray">{t('form_finder_sub')}</div>
              </div>
            </div>
            {!showFormFinder ? (
              <button
                className="btn-primary w-full justify-center"
                onClick={() => setShowFormFinder(true)}
              >
                {t('form_finder_btn')}
              </button>
            ) : (
              <FormFinder />
            )}
          </div>

          {/* Document Checklist */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-off-white flex items-center justify-center text-india-navy">
                <FileText size={22} />
              </div>
              <div>
                <div className="font-semibold text-near-black text-sm">{t('doc_checklist_title')}</div>
                <div className="text-xs text-mid-gray">{t('doc_checklist_sub')}</div>
              </div>
            </div>
            <DocumentChecklist />
          </div>

          {/* E-EPIC */}
          <ToolCard
            icon={<Smartphone size={22} className="text-india-navy" />}
            title={t('download_eepic')}
            subtitle={t('Digital Voter ID Card')}
            description={t('Download your Electronic Electoral Photo Identity Card (E-EPIC) as a PDF from the official voter portal. Accepted at polling stations as valid ID.')}
            action={() => window.open('https://voters.eci.gov.in', '_blank', 'noopener,noreferrer')}
            actionLabel={t('download_eepic')}
          />

          {/* Helpline */}
          <motion.div whileHover={{ y: -2 }} className="card p-5 border-2 border-saffron">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <div className="font-semibold text-near-black text-sm">{t('voter_helpline_tool')}</div>
                <div className="text-xs text-mid-gray">{t('free_multilingual', 'Free in multiple Indian languages')}</div>
              </div>
            </div>

            <div className="text-center bg-off-white rounded-xl p-4 mb-3">
              <div className="text-4xl font-serif font-bold text-india-navy">1950</div>
              <div className="text-sm text-mid-gray mt-1">{t('helpline_subtitle_long', 'Toll-Free • Available in all Indian languages')}</div>
            </div>

            <div className="space-y-2 text-sm text-mid-gray">
              {[
                { k: 'voter_reg_queries', v: 'Voter registration queries' },
                { k: 'correction_help', v: 'Name/address correction help' },
                { k: 'station_inquiries', v: 'Polling station inquiries' },
                { k: 'election_complaints', v: 'Election day complaints' }
              ].map(item => (
                <div key={item.k} className="flex items-center gap-2">
                  <Check size={16} className="text-india-green flex-shrink-0" />
                  <span>{t(item.k, item.v)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* cVIGIL */}
          <motion.div whileHover={{ y: -2 }} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                <AlertTriangle size={22} />
              </div>
              <div>
                <div className="font-semibold text-near-black text-sm">{t('report_violation')}</div>
                <div className="text-xs text-mid-gray">cVIGIL App — Official ECI App</div>
              </div>
            </div>

            <p className="text-sm text-mid-gray mb-3">
              {t('cvigil_desc')}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-mid-gray mb-4">
              {[
                t('violation_1', 'Voter bribery (money for votes)'),
                t('violation_2', 'Booth capture or intimidation'),
                t('violation_3', 'Illegal campaigning'),
                t('violation_4', 'Distribution of freebies')
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-red-400 flex-shrink-0">!</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://play.google.com/store/apps/details?id=in.nic.eci.cvigil"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2.5 justify-center flex items-center gap-2"
              >
                <Download size={16} /> Google Play
              </a>
              <a
                href="https://apps.apple.com/in/app/cvigil/id1447761833"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm py-2.5 justify-center flex items-center gap-2"
              >
                <Download size={16} /> App Store
              </a>
            </div>
          </motion.div>

          {/* Quick Support / Report Rumor */}
          <div className="p-5 bg-india-navy rounded-2xl text-white shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <ShieldAlert className="text-india-saffron" size={24} />
              <h3 className="font-bold">{t('Report Misinformation')}</h3>
            </div>
            <p className="text-xs text-white/70 mb-4">
              {t('Found a viral message or news about elections that seems suspicious? Help us track rumors.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="rumor-input"
                type="text"
                placeholder={t('Paste suspicious text here...')}
                className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-india-saffron transition-all"
              />
              <button
                onClick={() => {
                  const val = document.getElementById('rumor-input').value;
                  if (val) {
                    window.dispatchEvent(new CustomEvent('log-rumor', { detail: val }));
                    document.getElementById('rumor-input').value = '';
                    alert(t('Thank you! This has been logged for admin review.'));
                  }
                }}
                className="bg-[#FF9933] text-[#000000] font-bold px-6 py-3 rounded-lg text-sm hover:bg-[#FFB366] transition-all whitespace-nowrap shadow-lg flex items-center justify-center gap-2"
              >
                {t('Send Report')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Official disclaimer */}
        <div className="mt-6 mb-2 text-center">
          <p className="text-xs text-mid-gray flex items-start justify-center gap-1.5 px-4">
            <Lock size={14} className="flex-shrink-0 mt-0.5" />
            <span>{t('All tool links lead exclusively to official eci.gov.in government portals. If in doubt, always type the URL directly into your browser.')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
