
import React, { useState } from 'react';
import { Medicine, FarmerInfo, Language } from '../types';

interface CheckoutProps {
  medicine: Medicine;
  onConfirm: (info: FarmerInfo, payment: string) => void;
  onBack: () => void;
  lang: Language;
}

const Checkout: React.FC<CheckoutProps> = ({ medicine, onConfirm, onBack, lang }) => {
  const [formData, setFormData] = useState<FarmerInfo>({
    name: '',
    mobile: '',
    address: {
      village: '',
      taluka: '',
      district: '',
      state: 'Maharashtra',
      pincode: ''
    }
  });
  const [payment, setPayment] = useState('COD');

  const t = {
    English: {
      title: "Delivery Address",
      name: "Farmer Full Name",
      mobile: "Mobile Number",
      loc: "Use Current Location",
      village: "Village/City",
      pin: "Pincode",
      summary: "Order Summary",
      charges: "Delivery Charges",
      total: "Total Amount",
      pay: "Payment Method",
      confirm: "Confirm & Place Order",
      back: "Back to Chat"
    },
    Hindi: {
      title: "वितरण पता",
      name: "किसान का पूरा नाम",
      mobile: "मोबाइल नंबर",
      loc: "वर्तमान स्थान का उपयोग करें",
      village: "गाँव/शहर",
      pin: "पिन कोड",
      summary: "ऑर्डर सारांश",
      charges: "वितरण शुल्क",
      total: "कुल राशि",
      pay: "भुगतान विधि",
      confirm: "पुष्टि करें और ऑर्डर दें",
      back: "चैट पर वापस जाएं"
    },
    Marathi: {
      title: "वितरण पत्ता",
      name: "शेतकऱ्याचे पूर्ण नाव",
      mobile: "मोबाईल नंबर",
      loc: "सध्याचे स्थान वापरा",
      village: "गाव/शहर",
      pin: "पिन कोड",
      summary: "ऑर्डर सारांश",
      charges: "डिलिव्हरी शुल्क",
      total: "एकूण रक्कम",
      pay: "पेमेंट पद्धत",
      confirm: "ऑर्डरची पुष्टी करा",
      back: "चॅटवर परत जा"
    }
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData, payment);
  };

  const useLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData(prev => ({
          ...prev,
          address: { ...prev.address, village: "Detected Village", pincode: "411001" }
        }));
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            required
            placeholder={t.name}
            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:border-green-500 text-sm"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
          <input 
            required
            type="tel"
            placeholder={t.mobile}
            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:border-green-500 text-sm"
            value={formData.mobile}
            onChange={e => setFormData({...formData, mobile: e.target.value})}
          />
          
          <button 
            type="button"
            onClick={useLocation}
            className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-blue-100"
          >
            📍 {t.loc}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <input 
              required
              placeholder={t.village}
              className="bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none text-sm"
              value={formData.address.village}
              onChange={e => setFormData({...formData, address: {...formData.address, village: e.target.value}})}
            />
            <input 
              required
              placeholder={t.pin}
              className="bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none text-sm"
              value={formData.address.pincode}
              onChange={e => setFormData({...formData, address: {...formData.address, pincode: e.target.value}})}
            />
          </div>

          <div className="bg-green-50 p-4 rounded-2xl">
            <h3 className="text-sm font-bold text-green-800 mb-3">{t.summary}</h3>
            <div className="flex justify-between text-xs mb-2">
              <span>{medicine.name} x 1</span> <span>₹{medicine.price}</span>
            </div>
            <div className="flex justify-between text-xs mb-2 text-gray-500">
              <span>{t.charges}</span> <span>₹50</span>
            </div>
            <div className="flex justify-between text-base font-bold text-green-900 border-t border-green-200 pt-2 mt-2">
              <span>{t.total}</span> <span>₹{medicine.price + 50}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-800">{t.pay}</h3>
            <div className="flex gap-2">
              {['UPI', 'Card', 'COD'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPayment(m)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold border ${
                    payment === m ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {m === 'COD' && lang !== 'English' ? (lang === 'Marathi' ? 'पोहोचल्यावर पैसे' : 'डिलीवरी पर नकद') : m}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg mt-4"
          >
            {t.confirm}
          </button>
        </form>
      </div>
      <button onClick={onBack} className="w-full text-gray-400 text-sm font-bold text-center">{t.back}</button>
    </div>
  );
};

export default Checkout;
