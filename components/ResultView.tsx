
import React, { useEffect, useRef } from 'react';
import { DiseaseResult, AppState, Medicine, Language, UserProfile, CROP_PHOTOS } from '../types';

interface ResultViewProps {
  result: DiseaseResult;
  navigateTo: (p: AppState) => void;
  onMedicineFound: (m: Medicine) => void;
  lang: Language;
  user: UserProfile | null;
  triggerVoice: (text: string, type?: 'system' | 'ai') => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, navigateTo, onMedicineFound, lang, user, triggerVoice }) => {
  const hasAutoPlayed = useRef(false);

  const t = {
    English: {
      title: "AI Analysis Result",
      crop: "Crop Name",
      disease: "Disease Name",
      accuracy: "Accuracy",
      severity: "Severity",
      info: "Disease Information",
      why: "Why it happens?",
      symptoms: "Symptoms",
      btn: "Treatment Advice",
      listen: "🔊 Listen Analysis",
      currentLabel: "Detected Crop"
    },
    Hindi: {
      title: "AI विश्लेषण परिणाम",
      crop: "फसल का नाम",
      disease: "रोग का नाम",
      accuracy: "सटीकता",
      severity: "गंभीरता",
      info: "रोग की जानकारी",
      why: "यह क्यों होता है?",
      symptoms: "लक्षण",
      btn: "उपचार सलाह",
      listen: "🔊 आवाज सुनें",
      currentLabel: "पहचाना गया फसल"
    },
    Marathi: {
      title: "AI विश्लेषण निकाल",
      crop: "पिकाचे नाव",
      disease: "रोगाचे नाव",
      accuracy: "अचूकता",
      severity: "गंभीरता",
      info: "रोगाची माहिती",
      why: "हे का होते?",
      symptoms: "लक्षणे",
      btn: "उपचार सल्ला मिळवा",
      listen: "🔊 आवाज ऐका",
      currentLabel: "ओळखलेले पीक"
    }
  }[lang];

  const handleVoice = () => {
    if (!user) return;
    const text = lang === 'English' 
      ? `Analysis complete. For your ${result.cropName}, we found ${result.diseaseName} with ${Math.round(result.accuracy * 100)} percent accuracy. The severity is ${result.severity}.`
      : lang === 'Hindi'
      ? `विश्लेषण पूरा हुआ। आपकी ${result.cropName} में ${result.diseaseName} पाया गया है। सटीकता ${Math.round(result.accuracy * 100)} प्रतिशत है।`
      : `तपासणी पूर्ण झाली. तुमच्या ${result.cropName} पिकावर ${result.diseaseName} रोग आढळला आहे. अचूकता ${Math.round(result.accuracy * 100)} टक्के आहे.`;
    
    triggerVoice(text, 'ai');
  };

  useEffect(() => {
    if (!hasAutoPlayed.current) {
      const timer = setTimeout(() => {
        handleVoice();
        hasAutoPlayed.current = true;
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = () => {
    if (result.recommendedMedicine) onMedicineFound(result.recommendedMedicine);
    navigateTo('CHAT');
  };

  const getSeverityColor = (sev: string) => {
    if (sev === 'High') return 'text-red-600 bg-red-50 ring-red-100';
    if (sev === 'Medium') return 'text-amber-600 bg-amber-50 ring-amber-100';
    return 'text-green-600 bg-green-50 ring-green-100';
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      {/* CROP HEADER PHOTO */}
      {CROP_PHOTOS[result.cropName] && (
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 animate-slideDown">
          <div className="relative h-40 w-full">
            <img 
              src={CROP_PHOTOS[result.cropName]} 
              className="w-full h-full object-cover" 
              alt={result.cropName} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">{t.currentLabel}</span>
              <h3 className="text-xl font-black text-white">{result.cropName}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-lg border border-green-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
          <button onClick={handleVoice} className="bg-green-50 text-green-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-green-100 active:scale-95">
            {t.listen}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100">
            <p className="text-[10px] font-bold text-green-600 mb-1">🌿 {t.crop}</p>
            <p className="font-bold text-gray-800 text-sm leading-tight">{result.cropName}</p>
          </div>
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-600 mb-1">🦠 {t.disease}</p>
            <p className="font-bold text-gray-800 text-sm leading-tight">{result.diseaseName}</p>
          </div>
          <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 mb-1">📊 {t.accuracy}</p>
            <p className="font-bold text-gray-800 text-lg">{Math.round(result.accuracy * 100)}%</p>
          </div>
          <div className={`p-4 rounded-2xl border ring-1 ${getSeverityColor(result.severity)}`}>
            <p className="text-[10px] font-bold opacity-70 mb-1">⚠ {t.severity}</p>
            <p className="font-bold text-lg">{result.severity}</p>
          </div>
        </div>

        <div className="space-y-5 bg-gray-50/30 p-5 rounded-3xl">
          <h3 className="font-bold text-gray-800 text-[10px] uppercase tracking-widest">{t.info}</h3>
          <div className="space-y-4 text-xs text-gray-600">
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <p className="font-bold text-gray-700 text-[11px] mb-1">{t.why}</p>
              <p>{result.description.cause}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <p className="font-bold text-gray-700 text-[11px] mb-1">{t.symptoms}</p>
              <p>{result.description.symptoms}</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleAction} className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 sticky bottom-4">
        <BotIcon /> {t.btn}
      </button>
    </div>
  );
};

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v2"/><path d="M18 9h2"/></svg>
);

export default ResultView;
