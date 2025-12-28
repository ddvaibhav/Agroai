
import React, { useState, useRef, useEffect } from 'react';
import { analyzePlantImage, isQuotaLimited, getRemainingCooldown, getSampleResult } from '../services/gemini';
import { DiseaseResult, Language, UserProfile } from '../types';

interface ScannerProps {
  onComplete: (result: DiseaseResult) => void;
  onBack: () => void;
  lang: Language;
  user: UserProfile | null;
  triggerVoice: (text: string, type?: 'system' | 'ai') => void;
}

const Scanner: React.FC<ScannerProps> = ({ onComplete, onBack, lang, user, triggerVoice }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldown(getRemainingCooldown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const t = {
    English: {
      title: "Scan Your Plant Leaf",
      instr: ["Keep the leaf clear", "Single leaf in frame", "Ensure good lighting"],
      loading: "Analyzing photo...",
      err: "Photo unclear. Try again.",
      quotaErr: "Server busy. Try Sample?",
      camera: "Camera",
      upload: "Upload Image",
      cancel: "Cancel",
      sample: "View Sample Analysis"
    },
    Hindi: {
      title: "पत्ती स्कैन करें",
      instr: ["पत्ते को साफ रखें", "एक बार में एक ही पत्ता", "अच्छी रोशनी"],
      loading: "विश्लेषण हो रहा है...",
      err: "फोटो साफ नहीं है।",
      quotaErr: "सर्वर व्यस्त। सैंपल देखें?",
      camera: "कैमरा",
      upload: "अपलोड करें",
      cancel: "रद्द करें",
      sample: "सैंपल रिपोर्ट देखें"
    },
    Marathi: {
      title: "पान स्कॅन करा",
      instr: ["पान स्पष्ट ठेवा", "एका वेळी एकच पान", "प्रकाश चांगला ठेवा"],
      loading: "तपासणी सुरू आहे...",
      err: "फोटो स्पष्ट नाहीये.",
      quotaErr: "सर्व्हर व्यस्त आहे. नमुना पहा?",
      camera: "कॅमेरा",
      upload: "अपलोड करा",
      cancel: "रद्द करा",
      sample: "नमुना रिपोर्ट पहा"
    }
  }[lang];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // CRITICAL: Block any new call if one is in progress or quota is hit
    if (!file || loading || isQuotaLimited()) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await analyzePlantImage(base64);
        if (result) onComplete(result);
        else {
          setError(t.err);
          triggerVoice(t.err, 'system');
          setLoading(false);
        }
      } catch (err: any) {
        const isQuota = err.message.includes("QUOTA");
        setError(isQuota ? t.quotaErr : t.err);
        triggerVoice(isQuota ? t.quotaErr : t.err, 'system');
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 p-4 animate-slideUp">
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.title}</h2>
        <div className="flex flex-col gap-2 bg-green-50 p-4 rounded-2xl border border-green-100">
          {t.instr.map((ins, i) => (
            <p key={i} className="text-xs text-green-700 font-medium flex items-center justify-center gap-2">
              <span className="text-[10px]">✅</span> {ins}
            </p>
          ))}
        </div>
      </div>

      <div className={`w-64 h-64 border-4 border-dashed ${cooldown > 0 ? 'border-amber-400' : 'border-green-200'} rounded-3xl flex items-center justify-center bg-green-50/50 relative overflow-hidden shadow-inner transition-colors`}>
        {loading ? (
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            <p className="text-green-700 text-xs font-bold animate-pulse">{t.loading}</p>
          </div>
        ) : cooldown > 0 ? (
          <div className="flex flex-col items-center gap-2 text-amber-600">
            <ClockIcon size={48} />
            <p className="text-xl font-black">{Math.ceil(cooldown/1000)}s</p>
          </div>
        ) : (
          <div className="text-green-300"><CameraIcon size={80} /></div>
        )}
      </div>

      {error && (
        <div className="w-full flex flex-col gap-3 animate-shake">
          <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-xl border border-amber-200 text-xs font-bold text-center">
            ⚠️ {error}
          </div>
          {(error.includes("busy") || error.includes("व्यस्त")) && (
            <button onClick={() => onComplete(getSampleResult(lang))} className="bg-blue-600 text-white font-bold py-3 rounded-xl text-xs shadow-md">
              🚀 {t.sample}
            </button>
          )}
        </div>
      )}

      <div className="w-full space-y-3">
        <button 
          onClick={() => cameraInputRef.current?.click()}
          className={`w-full ${cooldown > 0 || loading ? 'bg-gray-400' : 'bg-green-600'} text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all`}
          disabled={loading || cooldown > 0}
        >
          <CameraIcon size={20} /> {t.camera}
        </button>
        <button 
          onClick={() => galleryInputRef.current?.click()}
          className="w-full bg-white border-2 border-green-600 text-green-600 font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          disabled={loading || cooldown > 0}
        >
          <UploadIcon size={20} /> {t.upload}
        </button>
        <button onClick={onBack} disabled={loading} className="w-full text-gray-400 font-bold py-2 text-sm disabled:opacity-30">
          {t.cancel}
        </button>
      </div>

      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
      <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
    </div>
  );
};

const ClockIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const CameraIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const UploadIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

export default Scanner;
