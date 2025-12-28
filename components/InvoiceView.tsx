
import React from 'react';
import { Order, Language, UserProfile } from '../types';

interface InvoiceViewProps {
  order: Order;
  onTrack: () => void;
  lang: Language;
  user: UserProfile | null;
  // Added triggerVoice to props to fix assignment error in App.tsx
  triggerVoice: (text: string) => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ order, onTrack, lang, user, triggerVoice }) => {
  // Use localized voice feedback with centralized triggerVoice for consistent UI feedback
  const handleVoice = () => {
    const text = lang === 'English'
      ? `Invoice generated. Farmer name ${order.farmer.name}. Total amount ${order.amount} rupees. Order ID ${order.id}.`
      : lang === 'Hindi'
      ? `बीजक तैयार है। किसान का नाम ${order.farmer.name} है। कुल राशि ${order.amount} रुपये है। ऑर्डर आईडी ${order.id} है।`
      : `बीजक तयार आहे. शेतकऱ्याचे नाव ${order.farmer.name} आहे. एकूण रक्कम ${order.amount} रुपये आहे. ऑर्डर आयडी ${order.id} आहे.`;
    
    triggerVoice(text);
  };

  const t = {
    English: {
      title: "Invoice Ready!",
      no: "Invoice No",
      name: "Farmer Name",
      disease: "Disease",
      medicine: "Medicine",
      total: "Total Amount",
      download: "Download Invoice (PDF)",
      track: "Track My Order",
      note: "Your order will reach you in 2–3 days."
    },
    Hindi: {
      title: "बीजक तैयार है!",
      no: "बीजक संख्या",
      name: "किसान का नाम",
      disease: "रोग",
      medicine: "दवा",
      total: "कुल राशि",
      download: "बीजक डाउनलोड करें (PDF)",
      track: "मेरा ऑर्डर ट्रैक करें",
      note: "आपका ऑर्डर २-३ दिनों में आपके घर पहुंच जाएगा।"
    },
    Marathi: {
      title: "बीजक तयार आहे!",
      no: "बीजक क्र.",
      name: "शेतकऱ्याचे नाव",
      disease: "रोग",
      medicine: "औषध",
      total: "एकूण रक्कम",
      download: "बीजक डाउनलोड करा (PDF)",
      track: "माझी ऑर्डर ट्रॅक करा",
      note: "तुमची ऑर्डर २-३ दिवसात तुमच्या घरी पोहोचेल."
    }
  }[lang];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 rotate-12 opacity-10">
          <InvoiceIcon size={120} />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
          <button onClick={handleVoice} className="bg-green-100 p-2 rounded-full text-green-600">
            <VolumeIcon />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">{t.no}</span>
            <span className="font-bold">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t.name}</span>
            <span className="font-bold">{order.farmer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t.disease}</span>
            <span className="font-bold">{order.disease}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">{t.medicine}</span>
            <span className="font-bold">{order.medicine.name}</span>
          </div>
          <div className="flex justify-between border-t border-dashed border-gray-200 pt-4 text-base">
            <span className="font-bold">{t.total}</span>
            <span className="font-bold text-green-700">₹{order.amount}</span>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2">
            📄 {t.download}
          </button>
          <button 
            onClick={onTrack}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg"
          >
            📍 {t.track}
          </button>
        </div>
      </div>
      
      <p className="text-center text-xs text-gray-500">
        {t.note}
      </p>
    </div>
  );
};

const InvoiceIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);
const VolumeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
);

export default InvoiceView;
