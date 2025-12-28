
import React, { useState, useEffect } from 'react';
import { Language, CropStage, SprayRecommendation, DiseaseResult, CROP_PHOTOS } from '../types';
import { getSprayRecommendation } from '../services/gemini';

interface SprayAdvisoryViewProps {
  lang: Language;
  onBack: () => void;
  diseaseResult: DiseaseResult | null;
  triggerVoice: (text: string, type?: 'system' | 'ai') => void;
  activeCrop?: string;
  onCropSelect: (crop: string) => void;
}

const SprayAdvisoryView: React.FC<SprayAdvisoryViewProps> = ({ lang, onBack, diseaseResult, triggerVoice, activeCrop, onCropSelect }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>(activeCrop || '');
  const [stage, setStage] = useState<CropStage>('Initial');
  const [recommendation, setRecommendation] = useState<SprayRecommendation | null>(null);
  const [loading, setLoading] = useState(false);

  const t = {
    English: {
      title: "Crop Spray Advisory",
      subtitle: "AI Recommendation for Your Crop",
      selectCrop: "Select Crop",
      selectStage: "Select Crop Stage",
      btnGet: "Get Recommendation",
      initial: "Initial/Small",
      growth: "Growth Stage",
      flowering: "Flowering/Fruiting",
      detected: "Detected Disease",
      name: "Spray Name",
      useFor: "Used For",
      dosage: "Dosage",
      tip: "Farmer Tip",
      loading: "Analyzing for best spray...",
      back: "Back",
      crops: Object.keys(CROP_PHOTOS),
      voiceIntro: "Smart spray recommendations for your crop are shown below.",
      refPhoto: "Reference Photo",
      currentLabel: "Current Crop"
    },
    Hindi: {
      title: "फसल स्प्रे सलाह",
      subtitle: "आपकी फसल के लिए AI अनुशंसा",
      selectCrop: "फसल चुनें",
      selectStage: "फसल का चरण चुनें",
      btnGet: "अनुशंसा प्राप्त करें",
      initial: "छोटा पौधा (प्रारंभिक)",
      growth: "वृद्धि का चरण",
      flowering: "फूल/फल आने का चरण",
      detected: "पहचाना गया रोग",
      name: "स्प्रे का नाम",
      useFor: "इसके लिए उपयोगी",
      dosage: "मात्रा",
      tip: "किसान सुझाव",
      loading: "सर्वोत्तम स्प्रे की तलाश...",
      back: "पीछे",
      crops: Object.keys(CROP_PHOTOS),
      voiceIntro: "आपकी फसल के लिए उपयुक्त स्प्रे नीचे दिखाए गए हैं।",
      refPhoto: "संदर्भ फोटो",
      currentLabel: "वर्तमान फसल"
    },
    Marathi: {
      title: "पीक फवारणी सल्ला",
      subtitle: "तुमच्या पिकासाठी AI शिफारस",
      selectCrop: "पीक निवडा",
      selectStage: "पिकाचा टप्पा निवडा",
      btnGet: "शिफारस मिळवा",
      initial: "लहान रोप (सुरुवात)",
      growth: "वाढीचा टप्पा",
      flowering: "फुलोरा / फळधारणा",
      detected: "आढळलेला रोग",
      name: "स्प्रेचे नाव",
      useFor: "कशासाठी वापरायचे",
      dosage: "मात्रा",
      tip: "शेतकरी सल्ला",
      loading: "योग्य स्प्रे शोधत आहोत...",
      back: "मागे",
      crops: Object.keys(CROP_PHOTOS),
      voiceIntro: "तुमच्या पिकासाठी योग्य स्प्रे खाली दाखवले आहेत.",
      refPhoto: "संदर्भ फोटो",
      currentLabel: "सध्याचे पीक"
    }
  }[lang];

  useEffect(() => {
    triggerVoice(t.voiceIntro, 'system');
  }, []);

  const handleFetch = async () => {
    if (!selectedCrop) return;
    onCropSelect(selectedCrop);
    setLoading(true);
    try {
      const res = await getSprayRecommendation(selectedCrop, stage, lang, diseaseResult?.diseaseName);
      setRecommendation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-24">
      {/* CROP HEADER - MUST BE CROP SPECIFIC PHOTO */}
      {selectedCrop && CROP_PHOTOS[selectedCrop] && (
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 animate-slideDown">
          <div className="relative h-48 w-full">
            <img 
              src={CROP_PHOTOS[selectedCrop]} 
              className="w-full h-full object-cover" 
              alt={selectedCrop} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">{t.currentLabel}</span>
              <h3 className="text-2xl font-black text-white">{selectedCrop}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-emerald-600 to-green-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <SprayIcon size={120} />
        </div>
        <h2 className="text-2xl font-black mb-1">{t.title}</h2>
        <p className="text-[10px] font-black opacity-60 uppercase tracking-widest leading-tight">{t.subtitle}</p>
      </div>

      {diseaseResult && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="bg-amber-500 text-white p-2 rounded-xl">
            <AlertIcon size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">{t.detected}</p>
            <p className="text-sm font-bold text-amber-900">{diseaseResult.diseaseName} ({diseaseResult.cropName})</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-green-50 space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.selectCrop}</label>
          <select 
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-green-600 transition-all"
          >
            <option value="">-- {t.selectCrop} --</option>
            {t.crops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.selectStage}</label>
          <div className="flex gap-2">
            {(['Initial', 'Growth', 'Flowering'] as CropStage[]).map(s => (
              <button 
                key={s}
                onClick={() => setStage(s)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-tight border-2 transition-all ${
                  stage === s ? 'bg-green-600 border-green-600 text-white shadow-lg' : 'bg-white border-gray-50 text-gray-400'
                }`}
              >
                {t[s.toLowerCase() as keyof typeof t]}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleFetch}
          disabled={!selectedCrop || loading}
          className="w-full bg-green-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-100 active:scale-95 disabled:bg-gray-300 transition-all text-sm uppercase tracking-widest mt-2"
        >
          {loading ? t.loading : t.btnGet}
        </button>
      </div>

      {recommendation && (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-green-50 animate-slideUp">
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative w-full aspect-square bg-gray-100 rounded-[2rem] overflow-hidden shadow-inner group">
               <img src={recommendation.imageUrl} alt={recommendation.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/20">
                 {t.refPhoto}
               </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">{t.name}</p>
              <h3 className="text-2xl font-black text-gray-800 leading-tight">{recommendation.name}</h3>
              <div className="flex gap-2 mt-3">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
                  {recommendation.dosage}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{t.useFor}</p>
               <p className="text-sm font-bold text-gray-700 leading-relaxed">{recommendation.useFor}</p>
            </div>
            <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 shadow-inner">
               <div className="flex items-center gap-2 mb-2">
                 <div className="bg-green-600 text-white p-1 rounded-md">
                   <ZapIcon size={12} />
                 </div>
                 <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">{t.tip}</p>
               </div>
               <p className="text-sm font-bold text-green-800 italic leading-relaxed">"{recommendation.tip}"</p>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={onBack}
        className="w-full bg-gray-100 text-gray-500 font-black py-4 rounded-2xl active:scale-95 transition-all text-[11px] uppercase tracking-widest"
      >
        {t.back}
      </button>
    </div>
  );
};

const SprayIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V7a5 5 0 0 1 10 0v4"/><path d="M5 11h14v10H5z"/><path d="M12 11v10"/><path d="M9 11v10"/><path d="M15 11v10"/></svg>
);
const AlertIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const ZapIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></svg>
);

export default SprayAdvisoryView;
