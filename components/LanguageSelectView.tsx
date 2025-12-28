
import React from 'react';
import { Language } from '../types';

interface LanguageSelectViewProps {
  onSelect: (lang: Language) => void;
}

const LanguageSelectView: React.FC<LanguageSelectViewProps> = ({ onSelect }) => {
  const languages: { code: Language; label: string; sub: string; native: string }[] = [
    { code: 'Marathi', label: 'Marathi', native: 'मराठी', sub: 'महाराष्ट्रातील शेतकऱ्यांसाठी' },
    { code: 'Hindi', label: 'Hindi', native: 'हिंदी', sub: 'भारतीय किसानों के लिए' },
    { code: 'English', label: 'English', native: 'English', sub: 'For Global Farmers' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 animate-fadeIn">
      <div className="text-center mb-10">
        <div className="bg-green-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100 rotate-3">
          <GlobeIcon size={40} color="white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AgroAI Pro</h1>
        <p className="text-gray-500 font-medium">Select your preferred language</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className="w-full group bg-white border-2 border-transparent hover:border-green-600 p-6 rounded-3xl shadow-md hover:shadow-xl transition-all active:scale-95 flex items-center justify-between text-left"
          >
            <div>
              <p className="text-2xl font-bold text-gray-800 mb-0.5">{lang.native}</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{lang.sub}</p>
            </div>
            <div className="bg-green-50 text-green-600 p-3 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
              <ChevronRight size={20} />
            </div>
          </button>
        ))}
      </div>

      <p className="mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
        Empowering Indian Agriculture
      </p>
    </div>
  );
};

const GlobeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

const ChevronRight = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default LanguageSelectView;
