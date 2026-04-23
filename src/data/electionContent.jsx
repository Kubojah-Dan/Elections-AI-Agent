// src/data/electionContent.js
import { 
  Building, Building2, Scale, Wheat, Zap, 
  CheckCircle2, MapPin, BadgeInfo, Droplets, 
  MousePointerClick, Receipt, ShieldCheck, 
  Banknote, ShieldAlert, AlertTriangle, 
  Accessibility, CircleOff, ScrollText, Home 
} from 'lucide-react';
import React from 'react';

export const getContent = (t) => ({
  ELECTION_TYPES: [
    { 
      id: 'lok_sabha',
      name: t('lok_sabha'), 
      nameHi: 'लोक सभा', 
      freq: t('freq_5'), 
      seats: t('seats_543'), 
      desc: t('lok_sabha_desc'), 
      icon: <Building size={24} />, 
      color: '#0D2C6B' 
    },
    { 
      id: 'vidhan_sabha',
      name: t('vidhan_sabha'), 
      nameHi: 'विधान सभा', 
      freq: t('freq_5'), 
      seats: t('seats_varies'), 
      desc: t('vidhan_sabha_desc'), 
      icon: <Building2 size={24} />, 
      color: '#1a4099' 
    },
    { 
      id: 'rajya_sabha',
      name: t('rajya_sabha'), 
      nameHi: 'राज्य सभा', 
      freq: t('freq_6'), 
      seats: t('seats_245'), 
      desc: t('rajya_sabha_desc'), 
      icon: <Scale size={24} />, 
      color: '#2a5ab0' 
    },
    { 
      id: 'panchayat',
      name: t('panchayat'), 
      nameHi: 'पंचायत', 
      freq: t('freq_5'), 
      seats: t('seats_village'), 
      desc: t('panchayat_desc'), 
      icon: <Wheat size={24} />, 
      color: '#138808' 
    },
    { 
      id: 'municipal',
      name: t('municipal'), 
      nameHi: 'नगर पालिका', 
      freq: t('freq_5'), 
      seats: t('seats_urban'), 
      desc: t('municipal_desc'), 
      icon: <Building2 size={24} />, 
      color: '#FF9933' 
    },
    { 
      id: 'by_election',
      name: t('by_election'), 
      nameHi: 'उपचुनाव', 
      freq: t('freq_vacant'), 
      seats: t('seats_single'), 
      desc: t('by_election_desc'), 
      icon: <Zap size={24} />, 
      color: '#8B5CF6' 
    },
  ],

  VOTING_STEPS: [
    { step: 1, icon: <CheckCircle2 size={20} />, title: t('step1_title'), desc: t('step1_desc') },
    { step: 2, icon: <MapPin size={20} />, title: t('step2_title'), desc: t('step2_desc') },
    { step: 3, icon: <BadgeInfo size={20} />, title: t('step3_title'), desc: t('step3_desc') },
    { step: 4, icon: <Droplets size={20} />, title: t('step4_title'), desc: t('step4_desc') },
    { step: 5, icon: <MousePointerClick size={20} />, title: t('step5_title'), desc: t('step5_desc') },
    { step: 6, icon: <Receipt size={20} />, title: t('step6_title'), desc: t('step6_desc') },
  ],

  RIGHTS: [
    { icon: <ShieldCheck size={24} className="text-india-navy" />, title: t('right1_title'), desc: t('right1_desc') },
    { icon: <Banknote size={24} className="text-india-green" />, title: t('right2_title'), desc: t('right2_desc') },
    { icon: <ShieldAlert size={24} className="text-red-500" />, title: t('right3_title'), desc: t('right3_desc') },
    { icon: <AlertTriangle size={24} className="text-amber-500" />, title: t('right4_title'), desc: t('right4_desc') },
    { icon: <Accessibility size={24} className="text-india-navy" />, title: t('right5_title'), desc: t('right5_desc') },
    { icon: <CircleOff size={24} className="text-gray-500" />, title: t('right6_title'), desc: t('right6_desc') },
    { icon: <ScrollText size={24} className="text-indigo-500" />, title: t('right7_title'), desc: t('right7_desc') },
    { icon: <Home size={24} className="text-emerald-600" />, title: t('right8_title'), desc: t('right8_desc') },
  ],

  MYTHS: [
    { myth: t('myth1_q'), fact: t('myth1_a') },
    { myth: t('myth2_q'), fact: t('myth2_a') },
    { myth: t('myth3_q'), fact: t('myth3_a') },
    { myth: t('myth4_q'), fact: t('myth4_a') },
    { myth: t('myth5_q'), fact: t('myth5_a') },
    { myth: t('myth6_q'), fact: t('myth6_a') },
  ],

  FORM_TREE: [
    {
      id: 'q1',
      question: t('form_q1'),
      yes: { form: t('form_6'), desc: t('form_6_desc'), link: 'https://voters.eci.gov.in' },
      no: 'q2',
    },
    {
      id: 'q2',
      question: t('form_q2'),
      yes: { form: t('form_6a'), desc: t('form_6a_desc'), link: 'https://voters.eci.gov.in' },
      no: 'q3',
    },
    {
      id: 'q3',
      question: t('form_q3'),
      yes: { form: t('form_7'), desc: t('form_7_desc', 'Deletion of name from electoral roll (e.g., deceased person, shifted constituency)'), link: 'https://voters.eci.gov.in' },
      no: 'q4',
    },
    {
      id: 'q4',
      question: t('form_q4'),
      yes: { form: t('form_8'), desc: t('form_8_desc'), link: 'https://voters.eci.gov.in' },
      no: 'none',
    },
  ]
});
