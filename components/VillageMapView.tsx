
import React, { useState, useEffect } from 'react';
import { Language, LocationData } from '../types';
import { searchVillage, getVillageSuggestions } from '../services/gemini';

interface VillageMapViewProps {
  lang: Language;
  onBack: () => void;
  onSave: (location: LocationData) => void;
}

const VillageMapView: React.FC<VillageMapViewProps> = ({ lang, onBack, onSave }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [result, setResult] = useState<LocationData | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const t = {
    English: {
      title: "Smart Village Finder",
      searchPlaceholder: "Enter Village or Taluka Name...",
      locateMe: "Use My Location",
      suggestions: "Suggestions for you",
      btnSearch: "Search",
      searching: "Finding village details...",
      mapTitle: "Village Map View",
      mapHint: "Your village location on map",
      addBtn: "⭐ Add to Home Page",
      back: "Back",
      notFound: "Village not found. Try another name."
    },
    Hindi: {
      title: "स्मार्ट गाँव खोजक",
      searchPlaceholder: "गाँव या तालुका का नाम लिखें...",
      locateMe: "मेरा स्थान उपयोग करें",
      suggestions: "आपके लिए सुझाव",
      btnSearch: "खोजें",
      searching: "विवरण ढूँढ रहे हैं...",
      mapTitle: "गाँव का नक्शा",
      mapHint: "नक्शे पर आपके गाँव का स्थान",
      addBtn: "⭐ होम पेज पर जोड़ें",
      back: "पीछे",
      notFound: "गाँव नहीं मिला। दूसरा नाम लिखें।"
    },
    Marathi: {
      title: "स्मार्ट गाव शोधक",
      searchPlaceholder: "गावाचे किंवा तालुक्याचे नाव लिहा...",
      locateMe: "माझे लोकेशन वापरा",
      suggestions: "तुमच्यासाठी काही पर्याय",
      btnSearch: "शोधा",
      searching: "माहिती शोधत आहोत...",
      mapTitle: "गावाचा नकाशा",
      mapHint: "नकाशावर तुमच्या गावाचे स्थान",
      addBtn: "⭐ होम पेजवर जोडा",
      back: "मागे",
      notFound: "गाव सापडले नाही. दुसरे नाव लिहा."
    }
  }[lang];

  const handleInput = async (val: string) => {
    setQuery(val);
    if (val.length > 2) {
      setIsSuggesting(true);
      try {
        const list = await getVillageSuggestions(val);
        setSuggestions(list);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSuggesting(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = async (loc: LocationData) => {
    setQuery(loc.name);
    setSuggestions([]);
    handleSearch(loc.name);
  };

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim() || isSearching) return;
    setIsSearching(true);
    setSuggestions([]);
    try {
      const loc = await searchVillage(q, userCoords?.lat, userCoords?.lng);
      setResult(loc);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = async () => {
    if (!userCoords) {
      alert("Please allow location access");
      return;
    }
    setIsSearching(true);
    try {
      const loc = await searchVillage("Nearby village at my location", userCoords.lat, userCoords.lng);
      setResult(loc);
      if (loc) setQuery(loc.name);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-24">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <MapIcon size={100} />
        </div>
        <h2 className="text-2xl font-black mb-1">{t.title}</h2>
        <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">{t.mapHint}</p>

        <button 
          onClick={handleLocateMe}
          className="mt-6 w-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs"
        >
          <GpsIcon size={16} /> {t.locateMe}
        </button>
      </div>

      {/* SEARCH BOX */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-indigo-50 flex flex-col gap-2 relative z-[100]">
        <div className="relative">
          <input 
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder={t.searchPlaceholder}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-indigo-50 border-none px-5 py-4 rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-600 outline-none placeholder:text-indigo-200"
          />
          <button 
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="absolute right-2 top-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg active:scale-90 disabled:bg-gray-400 transition-all"
          >
            {isSearching ? <LoadingSpinner /> : <SearchIcon size={20} />}
          </button>
        </div>

        {/* AUTO-SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-3xl shadow-2xl border border-indigo-50 overflow-hidden divide-y divide-gray-50 animate-fadeIn">
            <div className="p-3 bg-gray-50/50 text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t.suggestions}</div>
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => selectSuggestion(s)}
                className="w-full text-left p-4 hover:bg-indigo-50 transition-colors flex items-center gap-3 active:bg-indigo-100"
              >
                <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg"><MapPinIcon size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{s.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{s.district}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH RESULT / MAP VIEW */}
      {result ? (
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-indigo-50 animate-slideUp">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-2xl">
              <MapPinIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800 leading-tight">{result.name}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{result.district}</p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-[2rem] aspect-video overflow-hidden border border-indigo-50 mb-6 relative shadow-inner">
            <iframe 
              title="Village Map"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              src={`https://www.google.com/maps/embed/v1/place?key=DUMMY_KEY&q=${encodeURIComponent(result.name + ", Maharashtra")}`}
              className="grayscale-[0.2] contrast-[1.1]"
              loading="lazy"
            ></iframe>
            <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none"></div>
          </div>

          <button 
            onClick={() => onSave(result)}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 active:scale-95 transition-all text-sm uppercase tracking-widest"
          >
            {t.addBtn}
          </button>
        </div>
      ) : isSearching ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="relative">
             <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                <SearchIcon size={24} />
             </div>
           </div>
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] animate-pulse">{t.searching}</p>
        </div>
      ) : !query && (
        <div className="flex flex-col items-center justify-center py-10 opacity-10">
           <MapIcon size={120} />
        </div>
      )}

      <button 
        onClick={onBack}
        className="w-full bg-gray-100 text-gray-500 font-black py-4 rounded-2xl active:scale-95 transition-all text-[11px] uppercase tracking-widest mt-4"
      >
        {t.back}
      </button>
    </div>
  );
};

// ICONS
const SearchIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const MapPinIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const MapIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
);
const GpsIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 7V3"/><path d="M12 21v-4"/><path d="M17 12h4"/><path d="M3 12h4"/></svg>
);
const LoadingSpinner = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
);

export default VillageMapView;
