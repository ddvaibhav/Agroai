
import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Language, UserProfile, CROP_PHOTOS } from '../types';
import { triggerHaptic } from '../services/gemini';

interface HeroProps {
  navigateTo: (p: AppState) => void;
  lang: Language;
  user: UserProfile | null;
  onCropSelect: (crop: string) => void;
}

interface GalleryImage {
  id: string;
  label: string;
  url: string;
  cat: 'AI Vision' | 'AI Analysis' | 'AI Decision' | 'AI Chat' | 'AI Voice' | 'AI Delivery' | 'AI Climate';
  sub: string;
  crop?: string;
}

const Hero: React.FC<HeroProps> = ({ navigateTo, lang, user, onCropSelect }) => {
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);
  const [selectedImg, setSelectedImg] = useState<GalleryImage | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    setTipIndex(day % 5);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {
        setWeather({ temp: 28, condition: "Sunny" });
      }, () => {
        setWeather({ temp: 26, condition: "Clear" });
      });
    }
  }, []);

  const t = {
    English: {
      welcome: user ? `Hello, ${user.name}` : "Welcome",
      weatherTitle: "Today's Weather",
      weatherAdvice: "Good day for spraying.",
      weatherClick: "Tap for details",
      villageCardTitle: "📍 Find Your Village",
      villageCardSub: "Search village / taluka / district",
      villageCardBtn: "View on Map",
      sprayCardTitle: "🌱 Today's Crop Spray",
      sprayCardSub: "Get AI recommendation for your crop",
      sprayCardBtn: "Select Crop",
      activeCropTitle: "🌾 Current Crop",
      changeCrop: "Change Crop",
      savedVillage: "⭐ Saved Village",
      changeVillage: "Change Village",
      tipTitle: "Tip of the Day",
      tips: [
        "Use drip irrigation to save 40% water and reach the roots directly.",
        "Rotate crops every season to prevent soil depletion and break pest cycles.",
        "Apply Neem oil spray in the evening to control aphids without harming bees.",
        "Test your soil every 2 years to apply the exact amount of fertilizer needed.",
        "Mulch your soil with organic waste to retain moisture and suppress weeds."
      ],
      scan: "Scan Plant",
      scanSub: "AI Disease Detection",
      doctor: "Expert Advice",
      doctorSub: "Chat with Specialist",
      featuresTitle: "AgroAI Pro Features",
      featuresSub: "Explore how AI is changing farming",
      sprayGalleryTitle: "🧴 Daily Spray Highlights",
      sprayGallerySub: `AI suggested sprays for ${user?.activeCrop || 'popular crops'} today`,
      medicineAvailable: "AI Recommended Medicine"
    },
    Hindi: {
      welcome: user ? `नमस्ते, ${user.name}` : "स्वागत है",
      weatherTitle: "आज का मौसम",
      weatherAdvice: "छिड़काव के लिए अच्छा दिन।",
      weatherClick: "विवरण के लिए टैप करें",
      villageCardTitle: "📍 अपना गाँव खोजें",
      villageCardSub: "गाँव / तालुका / जिला खोजें",
      villageCardBtn: "नक्शे पर देखें",
      sprayCardTitle: "🌱 आज की फसल का स्प्रे",
      sprayCardSub: "अपनी फसल के लिए AI अनुशंसा प्राप्त करें",
      sprayCardBtn: "फसल चुनें",
      activeCropTitle: "🌾 वर्तमान फसल",
      changeCrop: "फसल बदलें",
      savedVillage: "⭐ सहेजा गया गाँव",
      changeVillage: "गाँव बदलें",
      tipTitle: "आज का सुझाव",
      tips: [
        "मिट्टी की नमी बनाए रखने के लिए ड्रिप सिंचाई का उपयोग करें।",
        "मिट्टी की उर्वरता बनाए रखने के लिए हर मौसम में फसल बदलें।",
        "मधुमक्खियों को नुकसान पहुंचाए बिना कीटों को नियंत्रित करने के लिए शाम को नीम के तेल का छिड़काव करें।",
        "उर्वरक की सही मात्रा जानने के लिए हर 2 साल में अपनी मिट्टी का परीक्षण कराएं।",
        "नमी बनाए रखने और खरपतवार को रोकने के लिए जैविक कचरे से मल्चिंग करें।"
      ],
      scan: "पौधा स्कैन करें",
      scanSub: "AI रोग पहचान",
      doctor: "विशेषज्ञ सलाह",
      doctorSub: "विशेषज्ञ से चैट करें",
      featuresTitle: "AgroAI प्रो विशेषताएं",
      featuresSub: "देखें कि कैसे AI खेती बदल रहा है",
      sprayGalleryTitle: "🧴 दैनिक स्प्रे मुख्य आकर्षण",
      sprayGallerySub: `${user?.activeCrop || 'लोकप्रिय फसलों'} के लिए आज के AI सुझाव`,
      medicineAvailable: "AI द्वारा सुझाई गई दवा"
    },
    Marathi: {
      welcome: user ? `नमस्कार, ${user.name}!` : "स्वागत आहे",
      weatherTitle: "आजचे हवामान",
      weatherAdvice: "फवारणीसाठी योग्य दिवस.",
      weatherClick: "माहितीसाठी क्लिक करा",
      villageCardTitle: "📍 तुमचं गाव शोधा",
      villageCardSub: "Search village / taluka / district",
      villageCardBtn: "नकाशावर पहा",
      sprayCardTitle: "🌱 आजच्या पिकासाठी योग्य स्प्रे",
      sprayCardSub: "तुमच्या पिकासाठी AI शिफारस मिळवा",
      sprayCardBtn: "पीक निवडा",
      activeCropTitle: "🌾 सध्याचे पीक",
      changeCrop: "पीक बदला",
      savedVillage: "⭐ जोडलेले गाव",
      changeVillage: "गाव बदला",
      tipTitle: "आजचा सल्ला",
      tips: [
        "४०% पाणी वाचवण्यासाठी आणि मुळांपर्यंत पाणी पोहोचवण्यासाठी ठिबक सिंचनाचा वापर करा.",
        "जमिनानीचा पोत सुधारण्यासाठी दर हंगामात पिकांची फेरपालट करा.",
        "मावा आणि तुडतुड्यांच्या नियंत्रणासाठी संध्याकाळी कडुनिंबाच्या तेलाची फवारणी करा.",
        "खतांचा योग्य वापर करण्यासाठी दर २ वर्षांनी माती परीक्षण करून घ्या.",
        "ओलावा टिकवून ठेवण्यासाठी आणि तण रोखण्यासाठी आच्छादनाचा (Mulching) वापर करा."
      ],
      scan: "रोप स्कॅन करा",
      scanSub: "AI रोग ओळख",
      doctor: "तज्ञांचा सल्ला",
      doctorSub: "तज्ञांशी चॅट करा",
      featuresTitle: "AgroAI Pro ची वैशिष्ट्ये",
      featuresSub: "AI मुळे शेती कशी बदलत आहे ते पहा",
      sprayGalleryTitle: "🧴 दैनिक फवारणी शिफारसी",
      sprayGallerySub: `आजच्या दिवसासाठी ${user?.activeCrop || 'लोकप्रिय पिकां'}नुसार AI शिफारसी`,
      medicineAvailable: "AI शिफारस केलेले औषध"
    }
  }[lang];

  const galleryItems: GalleryImage[] = [
    { 
      id: "f1", 
      label: "AI Disease Detection", 
      url: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=400", 
      cat: "AI Vision", 
      sub: "Instantly detect pests and fungal diseases using your mobile camera." 
    },
    { 
      id: "f2", 
      label: "Healthy vs Diseased", 
      url: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=400", 
      cat: "AI Analysis", 
      sub: "Smart comparison logic identifies even the smallest signs of infection." 
    },
    { 
      id: "f3", 
      label: "Medicine Recommendation", 
      url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400", 
      cat: "AI Decision", 
      sub: "Get precise chemical and organic medicine names with exact dosages." 
    },
    { 
      id: "f4", 
      label: "24/7 Farmer Chatbot", 
      url: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=400", 
      cat: "AI Chat", 
      sub: "Chat in Marathi, Hindi, or English to solve any agricultural query instantly." 
    },
    { 
      id: "f5", 
      label: "Hands-Free Voice Assistant", 
      url: "https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80&w=400", 
      cat: "AI Voice", 
      sub: "Listen to disease analysis and spray advice while working in the field." 
    },
    { 
      id: "f6", 
      label: "Home Delivery Service", 
      url: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&q=80&w=400", 
      cat: "AI Delivery", 
      sub: "Order recommended medicines with one tap and get doorstep delivery." 
    }
  ];

  const allSprayItems: GalleryImage[] = [
    { id: "s1", crop: "Cotton", label: "Cotton Pest Shield", url: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=400", cat: "AI Decision", sub: "Recommended for Cotton bollworm." },
    { id: "s2", crop: "Tomato", label: "Tomato Blight Cure", url: "https://images.unsplash.com/photo-1585252329244-93430588147d?auto=format&fit=crop&q=80&w=400", cat: "AI Decision", sub: "Bio-spray for early blight." },
    { id: "s3", crop: "Wheat", label: "Wheat Rust Guard", url: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&q=80&w=400", cat: "AI Analysis", sub: "Fungal protection for Wheat rust." },
    { id: "s4", crop: "Onion", label: "Onion Thrip Guard", url: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=400", cat: "AI Analysis", sub: "Insecticide for healthy onion bulbs." },
    { id: "s5", crop: "Soybean", label: "Soybean Leaf Shield", url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400", cat: "AI Decision", sub: "Systemic fungicide for leaf spots." },
    { id: "s6", crop: "Grapes", label: "Grape Mildew Cure", url: "https://images.unsplash.com/photo-1533604131587-32c2ed869bb0?auto=format&fit=crop&q=80&w=400", cat: "AI Vision", sub: "Effective against Downy Mildew." }
  ];

  // Logic to rotate "Daily Highlights" based on current date
  const dailySprayGallery = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const startIndex = dayOfYear % allSprayItems.length;
    
    // Create a rotated array
    const rotated = [...allSprayItems.slice(startIndex), ...allSprayItems.slice(0, startIndex)];
    
    // If user has an active crop, prioritize it at the start
    if (user?.activeCrop) {
      const activeCropItem = allSprayItems.find(item => item.crop === user.activeCrop);
      if (activeCropItem) {
        return [activeCropItem, ...rotated.filter(i => i.id !== activeCropItem.id)];
      }
    }
    return rotated;
  }, [user?.activeCrop]);

  return (
    <div className="flex flex-col gap-8 py-2 animate-fadeIn pb-24">
      {/* WELCOME & WEATHER */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-800 rounded-3xl p-5 text-white shadow-xl flex flex-col justify-between h-40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <RealisticLeafIcon size={120} />
          </div>
          <h2 className="text-xl font-black leading-tight tracking-tight relative z-10">{t.welcome}</h2>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-2.5 relative z-10 border border-white/20">
            <p className="text-[10px] uppercase font-black tracking-widest opacity-80">Status</p>
            <p className="text-xs font-black drop-shadow-sm">Pro Member 🌟</p>
          </div>
        </div>

        <button 
          onClick={() => { triggerHaptic(10); navigateTo('CLIMATE'); }}
          className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all active:scale-95 flex flex-col justify-between h-40 text-left cursor-pointer group"
        >
          <div>
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{t.weatherTitle}</p>
              <span className="text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-black">{t.weatherClick}</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-gray-800 tracking-tighter group-hover:text-blue-600 transition-colors">{weather?.temp || '--'}°</span>
              <span className="text-xs font-bold text-gray-400 mb-1">C</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 mt-1">{user?.savedLocation?.name || "Pune, MH"}</p>
          </div>
          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl text-[9px] font-black flex items-center gap-1.5 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <CloudIcon size={12} /> {t.weatherAdvice}
          </div>
        </button>
      </div>

      {/* ACTIVE CROP CARD */}
      {user?.activeCrop && (
        <div className="bg-white border-2 border-green-500 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden relative group animate-slideUp">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">{t.activeCropTitle}</h3>
              <p className="text-2xl font-black text-gray-800 leading-tight">{user.activeCrop}</p>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-700 text-white p-3.5 rounded-2xl shadow-xl group-hover:rotate-6 transition-transform">
              <RealisticSproutIcon size={24} />
            </div>
          </div>
          <div className="rounded-[1.5rem] h-36 w-full overflow-hidden mb-4 shadow-inner ring-1 ring-black/5">
            <img 
              src={CROP_PHOTOS[user.activeCrop] || "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600"} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt={user.activeCrop} 
            />
          </div>
          <button 
            onClick={() => { triggerHaptic(10); navigateTo('SPRAY_ADVISORY'); }}
            className="w-full bg-green-50 text-green-700 font-black py-3 rounded-xl text-xs uppercase tracking-widest border border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all cursor-pointer"
          >
            {t.changeCrop}
          </button>
        </div>
      )}

      {/* SMART SPRAY ADVISORY CARD */}
      <button 
        onClick={() => { triggerHaptic(15); navigateTo('SPRAY_ADVISORY'); }}
        className="bg-white border border-green-100 rounded-[2.5rem] p-6 shadow-lg overflow-hidden relative group transition-all hover:shadow-2xl hover:border-green-300 text-left cursor-pointer"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">
              {t.sprayCardTitle}
            </h3>
            <p className="text-base font-black text-gray-800 leading-tight">
              {t.sprayCardSub}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white p-3.5 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all">
            <FlaskIcon size={20} />
          </div>
        </div>
        <div className="w-full bg-gradient-to-r from-green-600 to-emerald-800 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest">
          {t.sprayCardBtn}
        </div>
      </button>

      {/* CORE ACTIONS */}
      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => { triggerHaptic(20); navigateTo('SCAN'); }}
          className="group flex items-center gap-5 bg-white border border-green-100 p-5 rounded-3xl shadow-md hover:shadow-2xl hover:border-green-300 transition-all active:scale-95 text-left cursor-pointer"
        >
          <div className="bg-green-50 p-4 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
            <RealisticScanIcon size={32} />
          </div>
          <div>
            <h4 className="font-black text-gray-800 text-lg leading-tight group-hover:text-green-700 transition-colors">{t.scan}</h4>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t.scanSub}</p>
          </div>
        </button>

        <button 
          onClick={() => { triggerHaptic(20); navigateTo('CHAT'); }}
          className="group flex items-center gap-5 bg-white border border-amber-100 p-5 rounded-3xl shadow-md hover:shadow-2xl hover:border-amber-300 transition-all active:scale-95 text-left cursor-pointer"
        >
          <div className="bg-amber-50 p-4 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
            <RealisticBotIcon size={32} />
          </div>
          <div>
            <h4 className="font-black text-gray-800 text-lg leading-tight group-hover:text-amber-700 transition-colors">{t.doctor}</h4>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t.doctorSub}</p>
          </div>
        </button>
      </div>

      {/* PRO FEATURE HIGHLIGHTS GALLERY */}
      <section className="bg-white rounded-[2.5rem] p-7 shadow-lg border border-gray-50 overflow-hidden">
        <div className="mb-6">
          <h3 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">{t.featuresTitle}</h3>
          <p className="text-base font-black text-gray-800 leading-tight">{t.featuresSub}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {galleryItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => { triggerHaptic(5); setSelectedImg(item); }}
              className="group min-w-[240px] relative bg-gray-50 rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-md cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 snap-center"
            >
              <img src={item.url} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-6">
                <span className="bg-green-600/90 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit mb-2 border border-white/20">{item.cat}</span>
                <p className="text-white text-base font-black leading-tight drop-shadow-md mb-1">{item.label}</p>
                <p className="text-gray-300 text-[10px] font-bold leading-tight opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC SPRAY ADVISORY GALLERY (CHANGES EVERY DAY) */}
      <section className="bg-white rounded-[2.5rem] p-7 shadow-lg border border-gray-50 overflow-hidden">
        <div className="mb-6">
          <h3 className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">{t.sprayGalleryTitle}</h3>
          <p className="text-base font-black text-gray-800 leading-tight">{t.sprayGallerySub}</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {dailySprayGallery.map((item) => (
            <div 
              key={item.id} 
              onClick={() => { triggerHaptic(5); setSelectedImg(item as any); }}
              className="group min-w-[180px] relative bg-gray-50 rounded-[2rem] overflow-hidden aspect-[4/5] shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 snap-center"
            >
              <img src={item.url} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className="bg-blue-600/90 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest w-fit mb-1.5 border border-white/20">{item.cat}</span>
                <p className="text-white text-[11px] font-black leading-tight drop-shadow-md mb-1">{item.label}</p>
                <p className="text-gray-300 text-[9px] font-bold leading-tight opacity-0 group-hover:opacity-100 transition-opacity">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SMART VILLAGE CARD */}
      <div className="bg-white border border-indigo-100 rounded-[2.5rem] p-6 shadow-lg overflow-hidden relative group transition-all hover:shadow-2xl hover:border-indigo-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">
              {user?.savedLocation ? t.savedVillage : t.villageCardTitle}
            </h3>
            <p className="text-base font-black text-gray-800 leading-tight">
              {user?.savedLocation ? user.savedLocation.name : t.villageCardSub}
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-blue-700 text-white p-3.5 rounded-2xl shadow-xl group-hover:scale-110 transition-all">
            <MapPinIcon size={20} />
          </div>
        </div>
        
        {user?.savedLocation ? (
          <div className="flex flex-col gap-3">
             <div className="bg-indigo-50/50 rounded-2xl h-24 w-full flex items-center justify-center overflow-hidden border border-indigo-100 relative">
                <img 
                  src={`https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=60&w=400`} 
                  className="w-full h-full object-cover opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                  alt="Farm View"
                />
                <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-transparent transition-colors"></div>
             </div>
             <button 
              onClick={() => { triggerHaptic(10); navigateTo('VILLAGE_MAP'); }}
              className="text-xs font-black text-indigo-600 uppercase tracking-widest text-center hover:text-indigo-800 transition-colors cursor-pointer"
             >
              {t.changeVillage}
             </button>
          </div>
        ) : (
          <button 
            onClick={() => { triggerHaptic(15); navigateTo('VILLAGE_MAP'); }}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-800 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest cursor-pointer"
          >
            {t.villageCardBtn}
          </button>
        )}
      </div>

      {/* TIP SECTION */}
      <div className="bg-emerald-50 border-2 border-emerald-200 border-dashed rounded-[2.5rem] p-7 shadow-inner relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all group-hover:rotate-12">
          <SparkleIcon size={120} />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-xl ring-4 ring-emerald-100">
            <SparkleIcon size={20} />
          </div>
          <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.3em]">{t.tipTitle}</h4>
        </div>
        <p className="text-sm text-emerald-900 font-bold leading-relaxed italic relative z-10 drop-shadow-sm">
          "{t.tips[tipIndex]}"
        </p>
      </div>

      {/* MODAL - Enhanced Transparency and Blur */}
      {selectedImg && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-3xl flex items-center justify-center p-6 animate-fadeIn" onClick={() => setSelectedImg(null)}>
          <div className="w-full max-w-sm bg-white/95 rounded-[3.5rem] overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.5)] animate-scaleUp border border-white/20" onClick={e => e.stopPropagation()}>
            <div className="relative aspect-square">
              <img src={selectedImg.url} className="w-full h-full object-cover" alt={selectedImg.label} />
              <button onClick={() => setSelectedImg(null)} className="absolute top-6 right-6 bg-black/40 text-white p-3.5 rounded-full backdrop-blur-2xl border border-white/30 hover:bg-black/60 transition-colors cursor-pointer"><CloseIcon /></button>
            </div>
            <div className="p-10">
              <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-200">{selectedImg.cat}</span>
              <h3 className="text-2xl font-black text-gray-800 my-5 leading-tight tracking-tight">{selectedImg.label}</h3>
              <p className="text-sm text-gray-500 font-bold leading-relaxed tracking-tight">{selectedImg.sub}</p>
              <button onClick={() => { triggerHaptic(20); setSelectedImg(null); navigateTo('SCAN'); }} className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-black py-5 rounded-[1.8rem] shadow-xl mt-8 active:scale-95 transition-all text-sm uppercase tracking-widest cursor-pointer">Try AI Scan Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Realistic / Premium Icons
const RealisticLeafIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="currentColor" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const RealisticSproutIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 20h10M10 20c5.5-2.5 8-6.4 8-10 0-4.4-3.6-8-8-8s-8 3.6-8 8c0 3.6 2.5 7.5 8 10Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 10c0-2.2 1.8-4 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const RealisticScanIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2.5" />
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

const RealisticBotIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="18" height="10" x="3" y="11" rx="2" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="2.5" />
    <path d="M12 7v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M8 15h0.01M16 15h0.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const CloudIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 2.5-8.242 4 4 0 0 0-7.555-3.126A5.503 5.503 0 0 0 7 15h10.5"/><path d="M12 15v4"/><path d="M12 15h4"/></svg>
);
const MapPinIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const FlaskIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6"/><path d="M10 3v4.11a2 2 0 0 1-.59 1.42L5 13"/><path d="M14 3v4.11a2 2 0 0 0 .59 1.42L19 13"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/><path d="M8.5 10h7"/></svg>
);
const SparkleIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813L4.275 10.725 10.088 12.637 12 18.45l1.913-5.813 5.812-1.912-5.812-1.913L12 3Z"/></svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export default Hero;
