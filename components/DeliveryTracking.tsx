
import React from 'react';
import { Order, Language } from '../types';

interface DeliveryTrackingProps {
  order: Order;
  onHome: () => void;
  lang: Language;
}

const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ order, onHome, lang }) => {
  const t = {
    English: {
      title: "Tracking Order",
      placed: "Order Placed",
      shipped: "Shipped",
      out: "Out for Delivery",
      timeNow: "Today, 10:30 AM",
      timeExp: "Expected by Tomorrow",
      timeEst: "Estimated 2-3 Days",
      item: "Item",
      home: "Go to Home",
      reorder: "Reorder"
    },
    Hindi: {
      title: "ऑर्डर ट्रैकिंग",
      placed: "ऑर्डर दिया गया",
      shipped: "भेज दिया गया",
      out: "डिलिवरी के लिए निकला",
      timeNow: "आज, सुबह 10:30",
      timeExp: "कल तक अपेक्षित",
      timeEst: "अनुमानित 2-3 दिन",
      item: "वस्तु",
      home: "होम पर जाएं",
      reorder: "फिर से ऑर्डर करें"
    },
    Marathi: {
      title: "ऑर्डर ट्रॅकिंग",
      placed: "ऑर्डर दिली",
      shipped: "पाठवले",
      out: "डिलिव्हरीसाठी बाहेर",
      timeNow: "आज, सकाळी १०:३०",
      timeExp: "उद्यापर्यंत अपेक्षित",
      timeEst: "अपेक्षित २-३ दिवस",
      item: "वस्तू",
      home: "होमवर जा",
      reorder: "पुन्हा ऑर्डर करा"
    }
  }[lang];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{t.title}</h2>
        
        <div className="space-y-8 relative">
          <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-green-100"></div>
          
          <div className="flex gap-6 relative">
            <div className="w-5 h-5 rounded-full bg-green-600 z-10 ring-4 ring-green-100"></div>
            <div>
              <p className="font-bold text-sm text-gray-800">{t.placed}</p>
              <p className="text-[10px] text-gray-500">{t.timeNow}</p>
            </div>
          </div>

          <div className="flex gap-6 relative opacity-50">
            <div className="w-5 h-5 rounded-full bg-gray-200 z-10"></div>
            <div>
              <p className="font-bold text-sm text-gray-800">{t.shipped}</p>
              <p className="text-[10px] text-gray-500">{t.timeExp}</p>
            </div>
          </div>

          <div className="flex gap-6 relative opacity-50">
            <div className="w-5 h-5 rounded-full bg-gray-200 z-10"></div>
            <div>
              <p className="font-bold text-sm text-gray-800">{t.out}</p>
              <p className="text-[10px] text-gray-500">{t.timeEst}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl text-green-600">
            <BoxIcon />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.item}</p>
            <p className="font-bold text-gray-800">{order.medicine.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onHome}
          className="bg-white border-2 border-green-600 text-green-600 font-bold py-4 rounded-2xl"
        >
          {t.home}
        </button>
        <button className="bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg">
          {t.reorder}
        </button>
      </div>
    </div>
  );
};

const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
);

export default DeliveryTracking;
