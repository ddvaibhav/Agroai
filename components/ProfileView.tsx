
import React, { useState } from 'react';
import { UserProfile, Language } from '../types';

interface ProfileViewProps {
  onSave: (profile: UserProfile) => void;
  lang: Language;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onSave, lang, onBack }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');

  const t = {
    English: {
      title: "Welcome Farmer!",
      sub: "Please enter your details to start your smart farming journey.",
      nameLabel: "Your Full Name",
      genderLabel: "Select Gender",
      male: "Male",
      female: "Female",
      start: "Start Using App",
      back: "Change Language"
    },
    Hindi: {
      title: "किसान भाई, आपका स्वागत है!",
      sub: "अपनी स्मार्ट खेती की यात्रा शुरू करने के लिए कृपया अपना विवरण दर्ज करें।",
      nameLabel: "आपका पूरा नाम",
      genderLabel: "लिंग चुनें",
      male: "पुरुष",
      female: "महिला",
      start: "ऐप का उपयोग शुरू करें",
      back: "भाषा बदलें"
    },
    Marathi: {
      title: "शेतकरी मित्र, आपले स्वागत आहे!",
      sub: "तुमचा स्मार्ट शेती प्रवास सुरू करण्यासाठी कृपया तुमची माहिती भरा.",
      nameLabel: "तुमचे पूर्ण नाव",
      genderLabel: "लिंग निवडा",
      male: "पुरुष",
      female: "स्त्री",
      start: "ॲप वापरण्यास सुरुवात करा",
      back: "भाषा बदला"
    }
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name, gender });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-green-50">
        <div className="flex justify-center mb-6">
          <div className="bg-green-600 p-4 rounded-full text-white shadow-lg">
            <UserIcon size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">{t.title}</h2>
        <p className="text-xs text-gray-500 text-center mb-8 leading-relaxed px-4">{t.sub}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t.nameLabel}</label>
            <input 
              required
              autoFocus
              className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-gray-700"
              placeholder="e.g. Vaibhav Daspute"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{t.genderLabel}</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setGender('Male')}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                  gender === 'Male' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-100' : 'bg-white text-gray-400 border-gray-50'
                }`}
              >
                ♂️ {t.male}
              </button>
              <button
                type="button"
                onClick={() => setGender('Female')}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                  gender === 'Female' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-100' : 'bg-white text-gray-400 border-gray-50'
                }`}
              >
                ♀️ {t.female}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-green-700 transition-all active:scale-95 mt-4"
            >
              {t.start}
            </button>
            <button 
              type="button"
              onClick={onBack}
              className="w-full text-gray-400 font-bold py-2 text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon size={16} /> {t.back}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const ArrowLeftIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

export default ProfileView;
