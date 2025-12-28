
import React, { useState, useEffect, useRef } from 'react';
import { AppState, DiseaseResult, Medicine, FarmerInfo, Order, Language, UserProfile, LocationData } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Scanner from './components/Scanner';
import ResultView from './components/ResultView';
import ChatInterface from './components/ChatInterface';
import Checkout from './components/Checkout';
import InvoiceView from './components/InvoiceView';
import DeliveryTracking from './components/DeliveryTracking';
import Footer from './components/Footer';
import AboutView from './components/AboutView';
import ProfileView from './components/ProfileView';
import LanguageSelectView from './components/LanguageSelectView';
import ClimateView from './components/ClimateView';
import VillageMapView from './components/VillageMapView';
import SprayAdvisoryView from './components/SprayAdvisoryView';
import { aiSpeak, nativeSpeak, stopVoice, initAudioContext, isQuotaLimited, triggerHaptic } from './services/gemini';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('LANGUAGE_SELECT');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [farmer, setFarmer] = useState<FarmerInfo | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [lang, setLang] = useState<Language>('Marathi');
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [quotaActive, setQuotaActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const [topAlert, setTopAlert] = useState<string | null>(null);
  const alertTimer = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuotaActive(isQuotaLimited());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('agroai_lang') as Language;
    const savedUser = localStorage.getItem('agroai_user_profile');
    const savedMute = localStorage.getItem('agroai_muted') === 'true';

    setIsMuted(savedMute);
    if (savedLang) {
      setLang(savedLang);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setCurrentPage('HOME');
      }
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      const msg = {
        Marathi: "तुमच्या ब्राउझर मेनूमधून 'Add to Home Screen' निवडा.",
        Hindi: "अपने ब्राउज़र मेनू से 'Add to Home Screen' चुनें।",
        English: "Select 'Add to Home Screen' from your browser menu."
      }[lang];
      alert(msg);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    localStorage.setItem('agroai_muted', String(next));
    if (next) stopVoice();
  };

  const triggerVoice = (text: string, type: 'system' | 'ai' = 'system') => {
    setTopAlert(text);
    if (isMuted) return;

    if (type === 'system') {
      nativeSpeak(text, lang);
    } else {
      aiSpeak(text, lang, user?.gender || 'Male');
    }

    if (alertTimer.current) window.clearTimeout(alertTimer.current);
    alertTimer.current = window.setTimeout(() => setTopAlert(null), 5000);
  };

  useEffect(() => {
    if (user && !hasWelcomed && currentPage === 'HOME') {
      const locationText = user.savedLocation ? 
        (lang === 'Marathi' ? ` - आजचं हवामान - ${user.savedLocation.name}` : 
         lang === 'Hindi' ? ` - आज का मौसम - ${user.savedLocation.name}` : 
         ` - Today's Weather - ${user.savedLocation.name}`) : '';

      const texts = {
        Marathi: `नमस्कार ${user.name}! AgroAI Pro मध्ये आपले स्वागत आहे. ${locationText}`,
        Hindi: `नमस्ते ${user.name}! AgroAI Pro में आपका स्वागत है। ${locationText}`,
        English: `Hello ${user.name}! Welcome to AgroAI Pro. ${locationText}`
      };
      const timer = setTimeout(() => {
        triggerVoice(texts[lang], 'system');
        setHasWelcomed(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasWelcomed, lang, user, currentPage]);

  const navigateTo = (page: AppState) => {
    stopVoice();
    setTopAlert(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    localStorage.setItem('agroai_lang', selectedLang);
    const msg = selectedLang === 'English' ? "Language changed." : selectedLang === 'Hindi' ? "भाषा बदल गई।" : "भाषा बदलली.";
    triggerVoice(msg, 'system');
    if (user) navigateTo('HOME');
    else navigateTo('PROFILE');
  };

  const handleProfileSave = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('agroai_user_profile', JSON.stringify(profile));
    navigateTo('HOME');
  };

  const handleLocationSave = (location: LocationData) => {
    if (!user) return;
    const updatedUser: UserProfile = { ...user, savedLocation: location };
    setUser(updatedUser);
    localStorage.setItem('agroai_user_profile', JSON.stringify(updatedUser));
    
    const msg = {
      English: "Village successfully added to Home!",
      Hindi: "गाँव सफलतापूर्वक होम पेज में जोड़ा गया!",
      Marathi: "तुमचं गाव यशस्वीरित्या जोडण्यात आलं आहे!"
    }[lang];
    triggerVoice(msg, 'system');
    navigateTo('HOME');
  };

  const handleCropSelect = (crop: string) => {
    if (!user) return;
    const updatedUser: UserProfile = { ...user, activeCrop: crop };
    setUser(updatedUser);
    localStorage.setItem('agroai_user_profile', JSON.stringify(updatedUser));
    
    const msg = {
      English: `You are now viewing information for ${crop}.`,
      Hindi: `अब आप ${crop} की जानकारी देख रहे हैं।`,
      Marathi: `तुम्ही सध्या ${crop} पिकाची माहिती पाहत आहात.`
    }[lang];
    triggerVoice(msg, 'system');
  };

  const handleScanComplete = (result: DiseaseResult) => {
    setDiseaseResult(result);
    if (user) {
      const updatedUser: UserProfile = { ...user, activeCrop: result.cropName };
      setUser(updatedUser);
      localStorage.setItem('agroai_user_profile', JSON.stringify(updatedUser));
    }
    navigateTo('RESULT');
  };

  const isSetupPhase = currentPage === 'LANGUAGE_SELECT' || currentPage === 'PROFILE';

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-2xl relative flex flex-col font-sans border-x border-gray-100">
      {/* Top Alert Overlay - Refined Transparency and Color */}
      <div className={`fixed top-[75px] left-1/2 -translate-x-1/2 z-[600] w-[90%] max-w-[380px] transition-all duration-500 ease-out pointer-events-none ${topAlert ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95'}`}>
        <div className={`${quotaActive ? 'bg-amber-600/80' : 'bg-green-900/75'} backdrop-blur-2xl text-white px-5 py-4 rounded-[2rem] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-white/30`}>
          <div className="bg-white/20 p-2.5 rounded-2xl shrink-0 shadow-inner">
            {quotaActive ? <AlertIcon /> : <VolumeIcon size={16} />}
          </div>
          <p className="text-[11px] font-black leading-tight drop-shadow-md tracking-tight">{topAlert}</p>
        </div>
      </div>

      {!isSetupPhase && (
        <Header 
          currentPage={currentPage} 
          navigateTo={navigateTo} 
          lang={lang} 
          setLang={(l) => {
            setLang(l);
            localStorage.setItem('agroai_lang', l);
            triggerVoice(l === 'English' ? "Language changed." : "भाषा बदलली.", 'system');
          }}
          isMuted={isMuted}
          toggleMute={toggleMute}
          onInstall={handleInstall}
        />
      )}
      
      <main className="flex-grow px-4 py-6">
        {currentPage === 'LANGUAGE_SELECT' && <LanguageSelectView onSelect={handleLanguageSelect} />}
        {currentPage === 'PROFILE' && <ProfileView onSave={handleProfileSave} lang={lang} onBack={() => navigateTo('LANGUAGE_SELECT')} />}
        {currentPage === 'HOME' && <Hero navigateTo={navigateTo} lang={lang} user={user} onCropSelect={handleCropSelect} />}
        {currentPage === 'CLIMATE' && <ClimateView lang={lang} onBack={() => navigateTo('HOME')} />}
        {currentPage === 'VILLAGE_MAP' && <VillageMapView lang={lang} onBack={() => navigateTo('HOME')} onSave={handleLocationSave} />}
        {currentPage === 'SPRAY_ADVISORY' && (
          <SprayAdvisoryView 
            lang={lang} 
            onBack={() => navigateTo('HOME')} 
            diseaseResult={diseaseResult} 
            triggerVoice={triggerVoice}
            activeCrop={user?.activeCrop}
            onCropSelect={handleCropSelect}
          />
        )}
        {currentPage === 'SCAN' && <Scanner onComplete={handleScanComplete} onBack={() => navigateTo('HOME')} lang={lang} user={user} triggerVoice={triggerVoice} />}
        {currentPage === 'RESULT' && diseaseResult && (
          <ResultView 
            result={diseaseResult} 
            navigateTo={navigateTo} 
            onMedicineFound={setMedicine}
            lang={lang}
            user={user}
            triggerVoice={triggerVoice}
          />
        )}
        {currentPage === 'CHAT' && (
          <ChatInterface 
            disease={diseaseResult} 
            medicine={medicine} 
            navigateTo={navigateTo}
            lang={lang}
            user={user}
            triggerVoice={triggerVoice}
          />
        )}
        {currentPage === 'CHECKOUT' && medicine && (
          <Checkout 
            medicine={medicine} 
            onConfirm={(info) => {
              setFarmer(info);
              setOrder({
                id: `AGRO-${Math.floor(Math.random()*90000)+10000}`,
                disease: diseaseResult?.diseaseName || '',
                medicine: medicine,
                farmer: info,
                amount: medicine.price + 50,
                status: 'Processing'
              });
              navigateTo('INVOICE');
              triggerVoice(lang === 'English' ? "Order placed successfully!" : "ऑर्डर यशस्वी झाली!", 'system');
            }} 
            onBack={() => navigateTo('CHAT')}
            lang={lang}
          />
        )}
        {currentPage === 'INVOICE' && order && (
          <InvoiceView 
            order={order} 
            onTrack={() => navigateTo('DELIVERY')} 
            lang={lang}
            user={user}
            triggerVoice={triggerVoice}
          />
        )}
        {currentPage === 'DELIVERY' && order && (
          <DeliveryTracking order={order} onHome={() => navigateTo('HOME')} lang={lang} />
        )}
        {currentPage === 'ABOUT' && (
          <AboutView 
            lang={lang} 
            onBack={() => navigateTo('HOME')} 
            user={user}
            triggerVoice={triggerVoice}
          />
        )}
      </main>

      {!isSetupPhase && <Footer lang={lang} navigateTo={navigateTo} />}

      {currentPage === 'HOME' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[calc(448px-2rem)] px-4 z-[200]">
          <button 
            disabled={quotaActive}
            onClick={() => { 
              triggerHaptic(25);
              initAudioContext(); 
              navigateTo('SCAN'); 
            }}
            className={`w-full ${quotaActive ? 'bg-gray-400' : 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-700'} text-white font-black py-5 rounded-3xl shadow-[0_10px_30px_-5px_rgba(34,197,94,0.5)] flex items-center justify-center gap-3 active:scale-95 hover:scale-[1.02] transition-all ring-4 ring-white cursor-pointer uppercase tracking-widest text-sm`}
          >
            {quotaActive ? 'Server Cooling Down...' : <><CameraIcon /> {lang === 'Marathi' ? 'आता स्कॅन करा' : lang === 'Hindi' ? 'अभी स्कैन करें' : 'Scan Plant Now'}</>}
          </button>
        </div>
      )}
    </div>
  );
};

const VolumeIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
);
const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);

export default App;
