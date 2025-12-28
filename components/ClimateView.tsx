
import React from 'react';
import { Language } from '../types';

interface ClimateViewProps {
  lang: Language;
  onBack: () => void;
}

const ClimateView: React.FC<ClimateViewProps> = ({ lang, onBack }) => {
  const t = {
    English: {
      title: "Climate Intelligence",
      subtitle: "Smart Weather Insights for Your Crops",
      temp: "Temperature",
      hum: "Humidity",
      wind: "Wind Speed",
      rain: "Rain Chance",
      aiInsightTitle: "AI Agri-Climate Advice",
      aiInsight: "High humidity (85%) detected. Risk of Tomato Late Blight is high. Ensure proper spacing between crops to improve airflow.",
      sprayingTitle: "Spraying Conditions",
      sprayingSafe: "SAFE TO SPRAY",
      sprayingWarning: "Wind speed is optimal for droplet retention.",
      forecastTitle: "3-Day Forecast",
      back: "Back to Home",
      days: ["Tomorrow", "Wednesday", "Thursday"],
      designBy: "Designed by Vaibhav Daspute",
      role: "Full Stack AI Developer",
      contactText: "Contact for any business queries or project work",
      emailBtn: "Get in Touch"
    },
    Hindi: {
      title: "जलवायु खुफिया",
      subtitle: "आपकी फसलों के लिए स्मार्ट मौसम जानकारी",
      temp: "तापमान",
      hum: "नमी",
      wind: "हवा की गति",
      rain: "बारिश की संभावना",
      aiInsightTitle: "AI कृषि-जलवायु सलाह",
      aiInsight: "अधिक नमी (85%) का पता चला है। टमाटर के लेट ब्लाइट का जोखिम अधिक है। वायु प्रवाह में सुधार के लिए फसलों के बीच उचित दूरी सुनिश्चित करें।",
      sprayingTitle: "छिड़काव की स्थिति",
      sprayingSafe: "छिड़काव के लिए सुरक्षित",
      sprayingWarning: "हवा की गति छिड़काव के लिए उपयुक्त है।",
      forecastTitle: "3-दिन का पूर्वानुमान",
      back: "होम पर वापस जाएं",
      days: ["कल", "बुधवार", "गुरुवार"],
      designBy: "वैभव दासपुते द्वारा डिज़ाइन किया गया",
      role: "फुल स्टैक एआई डेवलपर",
      contactText: "किसी भी व्यावसायिक पूछताछ या प्रोजेक्ट कार्य के लिए संपर्क करें",
      emailBtn: "संपर्क करें"
    },
    Marathi: {
      title: "हवामान बुद्धिमत्ता",
      subtitle: "तुमच्या पिकांसाठी स्मार्ट हवामान माहिती",
      temp: "तापमान",
      hum: "आद्रता",
      wind: "वाऱ्याचा वेग",
      rain: "पावसाची शक्यता",
      aiInsightTitle: "AI कृषी-हवामान सल्ला",
      aiInsight: "उच्च आद्रता (८५%) आढळली आहे. टोमॅटो करपा रोगाचा धोका जास्त आहे. हवा खेळती राहण्यासाठी पिकांमध्ये योग्य अंतर ठेवा.",
      sprayingTitle: "फवारणीची स्थिती",
      sprayingSafe: "फवारणीसाठी सुरक्षित",
      sprayingWarning: "फवारणीसाठी वाऱ्याचा वेग उत्तम आहे.",
      forecastTitle: "३-दिवसांचा अंदाज",
      back: "होमवर जा",
      days: ["उद्या", "बुधवार", "गुरुवार"],
      designBy: "वैभव दासपुते यांनी डिझाइन केलेले",
      role: "फुल स्टॅक एआय डेव्हलपर",
      contactText: "कोणत्याही व्यावसायिक चौकशीसाठी किंवा कामासाठी संपर्क साधा",
      emailBtn: "संपर्क साधा"
    }
  }[lang];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-24">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CloudSunIcon size={120} />
        </div>
        <h2 className="text-2xl font-black mb-1">{t.title}</h2>
        <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{t.subtitle}</p>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <ThermometerIcon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black opacity-70 uppercase">{t.temp}</p>
              <p className="text-xl font-black">28°C</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <DropletsIcon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black opacity-70 uppercase">{t.hum}</p>
              <p className="text-xl font-black">85%</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <WindIcon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black opacity-70 uppercase">{t.wind}</p>
              <p className="text-xl font-black">12 km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <CloudRainIcon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black opacity-70 uppercase">{t.rain}</p>
              <p className="text-xl font-black">10%</p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-amber-500 text-white p-2 rounded-xl shadow-md">
            <ZapIcon size={16} />
          </div>
          <h3 className="text-[11px] font-black text-amber-800 uppercase tracking-widest">{t.aiInsightTitle}</h3>
        </div>
        <p className="text-sm font-bold text-amber-900 leading-relaxed italic">
          "{t.aiInsight}"
        </p>
      </section>

      <section className="bg-green-50 border border-green-100 rounded-[2rem] p-6 shadow-sm">
        <h3 className="text-[11px] font-black text-green-800 uppercase tracking-widest mb-4">{t.sprayingTitle}</h3>
        <div className="flex items-center gap-4">
          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg shadow-green-100 ring-4 ring-green-100">
            {t.sprayingSafe}
          </div>
          <p className="text-xs font-bold text-green-700">{t.sprayingWarning}</p>
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">{t.forecastTitle}</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {t.days.map((day, i) => (
            <div key={i} className="min-w-[100px] flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase">{day}</p>
              <CloudSunIcon size={24} color="#4b5563" />
              <p className="text-sm font-black text-gray-800">27° / 21°</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW DESIGNER CREDIT SECTION */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 border border-white rounded-[2.5rem] p-8 shadow-inner flex flex-col items-center text-center gap-5 mt-4">
        <div className="bg-white p-4 rounded-full shadow-lg border border-green-100 animate-bounce">
          <BriefcaseIcon size={28} color="#059669" />
        </div>
        <div>
          <h4 className="text-lg font-black text-gray-800 mb-1">{t.designBy}</h4>
          <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-4">{t.role}</p>
          <p className="text-xs font-bold text-gray-500 leading-relaxed max-w-[200px] mx-auto">
            {t.contactText}
          </p>
        </div>
        <a 
          href="mailto:support@agroaipro.com" 
          className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-black flex items-center gap-2"
        >
          <MailIcon size={14} />
          {t.emailBtn}
        </a>
      </section>

      <button 
        onClick={onBack}
        className="w-full bg-gray-100 text-gray-600 font-black py-4 rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest"
      >
        {t.back}
      </button>
    </div>
  );
};

const CloudSunIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>
);
const ThermometerIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>
);
const DropletsIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-6.3-4-6.3S3 9 3 12.3c0 2.2 1.8 4 4 4Z"/><path d="M17 16.3c2.2 0 4-1.8 4-4 0-3.3-4-6.3-4-6.3S13 9 13 12.3c0 2.2 1.8 4 4 4Z"/></svg>
);
const WindIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
);
const CloudRainIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 2.5-8.242 4 4 0 0 0-7.555-3.126A5.503 5.503 0 0 0 7 15h10.5"/><path d="m8 22 2-2"/><path d="m14 22 2-2"/></svg>
);
const ZapIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></svg>
);
const BriefcaseIcon = ({ size = 24, color = "currentColor" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
const MailIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

export default ClimateView;
