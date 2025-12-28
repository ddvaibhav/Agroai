
import React, { useState, useEffect, useRef } from 'react';
import { Language, UserProfile } from '../types';
import { stopVoice } from '../services/gemini';

interface AboutViewProps {
  lang: Language;
  onBack: () => void;
  user: UserProfile | null;
  triggerVoice: (text: string, type?: 'system' | 'ai') => void;
}

type Tab = 'ABOUT' | 'PRIVACY';

const AboutView: React.FC<AboutViewProps> = ({ lang, onBack, user, triggerVoice }) => {
  const [activeTab, setActiveTab] = useState<Tab>('ABOUT');
  const [profilePhoto, setProfilePhoto] = useState<string>("https://api.dicebear.com/7.x/avataaars/svg?seed=Vaibhav&backgroundColor=b6e3f4");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    English: {
      aboutTab: "About Us",
      privacyTab: "Privacy Policy",
      founderTitle: "Founder & Full Stack Web Developer",
      missionTitle: "Our Mission",
      missionContent: "AgroAI Pro is a smart AI-based agriculture platform designed to help farmers identify diseases and get expert guidance. Our mission is to make farming technology-driven for all.",
      contactTitle: "Contact / Email",
      back: "Back to Home",
      policyTitle: "Privacy Policy",
      voiceContent: "Hello! I am Vaibhav Daspute. AgroAI Pro is an AI platform to help you care for your crops.",
      sections: [
        { h: "1. Privacy", p: "We value your privacy and only collect data required for analysis." },
        { h: "2. Contact", p: "support@agroaipro.com" }
      ]
    },
    Hindi: {
      aboutTab: "हमारे बारे में",
      privacyTab: "गोपनीयता नीति",
      founderTitle: "संस्थापक और वेब डेवलपर",
      missionTitle: "हमारा मिशन",
      missionContent: "AgroAI Pro एक AI प्लेटफॉर्म है जो किसानों को रोगों की पहचान करने और ऑनलाइन दवाएं ऑर्डर करने में मदद करता है।",
      contactTitle: "संपर्क / ईमेल",
      back: "होम पर वापस जाएं",
      policyTitle: "गोपनीयता नीति",
      voiceContent: "नमस्ते! मैं वैभव दासपुते हूं। AgroAI Pro किसानों के लिए एक स्मार्ट मंच है जो आपकी फसलों की देखभाल करता है।",
      sections: [
        { h: "1. गोपनीयता", p: "हम आपकी गोपनीयता का सम्मान करते हैं।" }
      ]
    },
    Marathi: {
      aboutTab: "आमच्याबद्दल",
      privacyTab: "गोपनीयता धोरण",
      founderTitle: "संस्थापक आणि वेब डेव्हलपर",
      missionTitle: "आमचे ध्येय",
      missionContent: "AgroAI Pro हे शेतकऱ्यांसाठी एक AI प्लॅटफॉर्म आहे जे पिकांवरील रोग ओळखण्यासाठी आणि औषध सुचवण्यासाठी डिझाइन केलेले आहे.",
      contactTitle: "संपर्क / ईमेल",
      back: "होमवर जा",
      policyTitle: "गोपनीयता धोरण",
      voiceContent: "नमस्कार! मी वैभव दासपुते. AgroAI Pro हे तुमच्या पिकाची योग्य काळजी करण्यासाठी एक स्मार्ट प्लॅटफॉर्म आहे.",
      sections: [
        { h: "१. गोपनीयता", p: "आम्ही तुमच्या डेटाच्या सुरक्षिततेचा आदर करतो." }
      ]
    }
  }[lang];

  useEffect(() => {
    const savedPhoto = localStorage.getItem('agroai_founder_photo');
    if (savedPhoto) setProfilePhoto(savedPhoto);
    
    // NATIVE VOICE ONLY (0 Quota)
    if (activeTab === 'ABOUT' && user) {
      const timer = setTimeout(() => {
        triggerVoice(t.voiceContent, 'system');
      }, 300);
      return () => { clearTimeout(timer); stopVoice(); };
    } else {
      stopVoice();
    }
  }, [activeTab, lang, user]);

  const handlePhotoEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        localStorage.setItem('agroai_founder_photo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fadeIn pb-10">
      <div className="flex bg-white rounded-2xl p-1 mb-6 shadow-sm border border-gray-100">
        {['ABOUT', 'PRIVACY'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as Tab)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === tab ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            {tab === 'ABOUT' ? t.aboutTab : t.privacyTab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 overflow-hidden">
        {activeTab === 'ABOUT' ? (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-green-100 overflow-hidden shadow-xl">
                <img src={profilePhoto} className="w-full h-full object-cover" />
                <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PencilIcon size={20} color="white" />
                </button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoEdit} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Vaibhav Daspute</h2>
              <p className="text-xs font-bold text-green-600 uppercase">{t.founderTitle}</p>
            </div>
            <div className="text-left bg-green-50/50 p-4 rounded-2xl border border-green-100">
              <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">🌿 {t.missionTitle}</h3>
              <p className="text-sm text-gray-600 italic">"{t.missionContent}"</p>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">© 2025 AgroAI Pro – Smart AI Platform</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">🛡️ {t.policyTitle}</h2>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {t.sections.map((sec, i) => (
                <section key={i} className="space-y-1">
                  <h3 className="font-bold text-sm text-gray-800">{sec.h}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{sec.p}</p>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
      <button onClick={onBack} className="mt-6 w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all">
        {t.back}
      </button>
    </div>
  );
};

const PencilIcon = ({ size = 20, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

export default AboutView;
