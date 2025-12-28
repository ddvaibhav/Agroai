
import React, { useState, useEffect } from 'react';
import { AppState, Language } from '../types';

interface HeaderProps {
  currentPage: AppState;
  navigateTo: (page: AppState) => void;
  lang: Language;
  setLang: (l: Language) => void;
  isMuted: boolean;
  toggleMute: () => void;
  onInstall: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, navigateTo, lang, setLang, isMuted, toggleMute, onInstall }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    English: "Install",
    Marathi: "इन्स्टॉल",
    Hindi: "इंस्टॉल"
  }[lang];

  return (
    <header 
      className={`sticky top-0 z-[500] w-full transition-all duration-300 ${
        isScrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-green-100 shadow-[0_4px_20px_-5px_rgba(34,197,94,0.15)] py-2' 
        : 'bg-white border-b border-transparent py-4'
      } px-4 flex items-center justify-between`}
    >
      <div 
        className="flex items-center gap-2.5 cursor-pointer active:scale-95 hover:scale-[1.02] transition-all group" 
        onClick={() => navigateTo('HOME')} 
        role="button"
        aria-label="AgroAI Pro Home"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full group-hover:bg-green-500/30 transition-all"></div>
          <div className="relative bg-gradient-to-br from-green-400 via-green-600 to-emerald-800 p-2 rounded-xl shadow-lg shadow-green-200/50 animate-logo-leaf">
            <RealisticLeafIcon />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-green-900 to-emerald-700 leading-none tracking-tight">AgroAI Pro</h1>
          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.15em]">Smart Farmer Hub</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onInstall}
          className="flex items-center gap-1.5 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-[10px] font-black shadow-lg shadow-green-100 hover:shadow-green-200 active:scale-90 transition-all cursor-pointer"
        >
          <DownloadIcon size={12} />
          <span className="hidden xs:inline">{t}</span>
        </button>

        <button 
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
          className={`p-2.5 rounded-xl border transition-all active:scale-90 cursor-pointer ${
            isMuted 
            ? 'bg-gray-50 text-gray-400 border-gray-200 shadow-inner' 
            : 'bg-green-50 text-green-600 border-green-100 shadow-sm hover:border-green-300'
          }`}
        >
          {isMuted ? <MuteIcon size={16} /> : <VolumeIcon size={16} />}
        </button>

        <div className="relative group">
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            className="appearance-none bg-gray-50 text-gray-800 text-[10px] font-black pl-3 pr-7 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 cursor-pointer shadow-sm transition-all hover:bg-white hover:border-green-200"
          >
            <option value="Marathi">मराठी</option>
            <option value="Hindi">हिंदी</option>
            <option value="English">EN</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-green-600 transition-colors">
            <ChevronDown size={10} />
          </div>
        </div>
      </div>
    </header>
  );
};

const RealisticLeafIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="white" />
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="url(#leafGrad)" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const VolumeIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
);
const MuteIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v6h2l5 4V5l-5 4H9z"/></svg>
);
const DownloadIcon = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const ChevronDown = ({ size = 10 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

export default Header;
