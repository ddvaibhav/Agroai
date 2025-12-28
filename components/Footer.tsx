
import React from 'react';
import { AppState, Language } from '../types';

interface FooterProps {
  lang: Language;
  navigateTo: (p: AppState) => void;
}

const Footer: React.FC<FooterProps> = ({ lang, navigateTo }) => {
  const t = {
    English: {
      quickLinks: "Quick Links",
      contact: "Contact Us",
      trust: "Trust & Safety",
      note: "Expert suggestions are based on crop data and experience. Always follow instructions. AgroAI Pro provides AI-based advisory support.",
      emailSupport: "For support, queries, or assistance:",
      about: "About Us & Privacy",
      rights: "© 2025 AgroAI Pro – Smart AI Platform",
      designedBy: "Designed by Vaibhav Daspute",
      follow: "Follow Developer"
    },
    Hindi: {
      quickLinks: "त्वरित लिंक",
      contact: "संपर्क करें",
      trust: "ट्रस्ट और सुरक्षा",
      note: "विशेषज्ञों के सुझाव फसल डेटा और अनुभव पर आधारित हैं। हमेशा निर्देशों का पालन करें।",
      emailSupport: "सहायता या पूछताछ के लिए संपर्क करें:",
      about: "हमारे बारे में और गोपनीयता",
      rights: "© 2025 AgroAI Pro – स्मार्ट प्लेटफॉर्म",
      designedBy: "वैभव दासपुते द्वारा डिज़ाइन किया गया",
      follow: "डेवलपर को फॉलो करें"
    },
    Marathi: {
      quickLinks: "महत्वाच्या लिंक्स",
      contact: "संपर्क साधा",
      trust: "विश्वास आणि सुरक्षितता",
      note: "तज्ञांचे सल्ले पीक डेटा आणि अनुभवावर आधारित आहेत. नेहमी सूचनांचे पालन करा.",
      emailSupport: "मदत किंवा चौकशीसाठी संपर्क साधा:",
      about: "आमच्याबद्दल आणि गोपनीयता",
      rights: "© 2025 AgroAI Pro – स्मार्ट प्लॅटफॉर्म",
      designedBy: "वैभव दासपुते यांनी डिझाइन केलेले",
      follow: "डेव्हलपरला फॉलो करा"
    }
  }[lang];

  const socialLinks = [
    { name: 'WhatsApp', icon: <WhatsAppIcon />, url: 'https://wa.me/91XXXXXXXXXX', color: 'hover:bg-green-500' },
    { name: 'Instagram', icon: <InstagramIcon />, url: '#', color: 'hover:bg-pink-500' },
    { name: 'Facebook', icon: <FacebookIcon />, url: '#', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: <TwitterIcon />, url: '#', color: 'hover:bg-sky-500' }
  ];

  return (
    <footer className="bg-white border-t border-green-100 mt-12 px-6 py-10 pb-32 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative group cursor-pointer" onClick={() => navigateTo('HOME')}>
            <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-800 p-4 rounded-3xl mb-4 shadow-xl shadow-green-100 rotate-2 animate-logo-leaf">
              <RealisticLeafIcon size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-green-900 tracking-tight">AgroAI Pro</h2>
          <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.3em]">Smart Farmer Hub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-black text-gray-800 border-b-2 border-green-500 w-fit pb-1 text-xs uppercase tracking-widest">{t.quickLinks}</h3>
            <ul className="grid grid-cols-2 gap-y-3 text-[11px] font-black text-gray-500">
              <li className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition-colors" onClick={() => navigateTo('HOME')}><ChevronRight size={14} /> Home</li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition-colors" onClick={() => navigateTo('SCAN')}><ChevronRight size={14} /> Scan Plant</li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition-colors" onClick={() => navigateTo('CHAT')}><ChevronRight size={14} /> Expert Chat</li>
              <li className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition-colors" onClick={() => navigateTo('ABOUT')}><ChevronRight size={14} /> {t.about}</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-gray-800 border-b-2 border-green-500 w-fit pb-1 text-xs uppercase tracking-widest">{t.contact}</h3>
            <div className="space-y-3 text-[11px] text-gray-600">
              <p className="font-bold text-gray-400">{t.emailSupport}</p>
              <a href="mailto:support@agroaipro.com" className="flex items-center gap-3 bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all active:scale-95 group cursor-pointer">
                <span className="text-green-600 shrink-0 group-hover:scale-110 transition-transform"><Mail size={20} /></span>
                <span className="font-black text-gray-800">support@agroaipro.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* SOCIAL LINKS SECTION */}
        <div className="flex flex-col items-center gap-4 py-6 border-y border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.follow}</p>
           <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`bg-gray-100 p-3.5 rounded-2xl text-gray-600 transition-all duration-300 hover:text-white hover:-translate-y-2 hover:shadow-xl cursor-pointer ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
           </div>
        </div>

        <div className="text-center space-y-6">
          <p className="text-[10px] text-gray-400 leading-relaxed italic px-6">
            {t.note}
          </p>
          
          <div className="space-y-1">
            <h4 className="text-sm font-black text-gray-900">{t.designedBy}</h4>
            <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">{t.rights}</p>
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pt-2">© 2025 Vaibhav Daspute</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const RealisticLeafIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="white" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const ChevronRight = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const Mail = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3l-1.5 5.5L21 11.5z"/></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

export default Footer;
