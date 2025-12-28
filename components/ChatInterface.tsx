
import React, { useState, useEffect, useRef } from 'react';
import { DiseaseResult, Medicine, AppState, Language, UserProfile } from '../types';
import { chatWithAI, triggerHaptic } from '../services/gemini';

interface ChatInterfaceProps {
  disease: DiseaseResult | null;
  medicine: Medicine | null;
  navigateTo: (p: AppState) => void;
  lang: Language;
  user: UserProfile | null;
  triggerVoice: (text: string, type?: 'system' | 'ai') => void;
}

type ChatMode = 'INITIAL' | 'AI' | 'EXPERT';

interface Message {
  role: 'ai' | 'user' | 'expert';
  text: string;
  showOrder?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ disease, medicine, navigateTo, lang, user, triggerVoice }) => {
  const [mode, setMode] = useState<ChatMode>('INITIAL');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const t = {
    English: {
      askChoice: `Disease detected: ${disease?.diseaseName || 'None'}. Do you want AI Guidance or to chat with an Expert?`,
      aiGuidance: "🤖 AI Guidance",
      expertChat: "💬 Chat with Expert",
      expertHeader: "Chat with Agriculture Expert",
      expertGreeting: "Hello, I am the AgroAI Pro Agriculture Expert. Please tell me about your crop problem.",
      expertReply: `Based on your crop data, ${medicine?.name || 'the medicine'} is suitable. Apply it once a week.`,
      orderBtn: "🛒 Order Medicine",
      aiWelcome: `I can provide detailed information about ${disease?.diseaseName}. What would you like to know?`,
      listen: "🔊 Listen",
      placeholder: "Type or tap mic...",
      thinking: "AI is thinking...",
      busy: "High usage. Please try again later.",
      err: "AI service is busy. Please try again."
    },
    Hindi: {
      askChoice: `रोग का पता चला: ${disease?.diseaseName || 'कोई नहीं'}। क्या आप AI मार्गदर्शन चाहते हैं या विशेषज्ञ से बात करना चाहते हैं?`,
      aiGuidance: "🤖 AI मार्गदर्शन",
      expertChat: "💬 विशेषज्ञ चैट",
      expertHeader: "कृषि विशेषज्ञ",
      expertGreeting: "नमस्ते, मैं कृषि विशेषज्ञ हूँ। कृपया अपनी फसल की समस्या बताएं।",
      expertReply: `आपके आंकड़ों के आधार पर, ${medicine?.name || 'दवा'} उपयुक्त है। सप्ताह में एक बार प्रयोग करें।`,
      orderBtn: "🛒 दवा ऑर्डर करें",
      aiWelcome: `मैं ${disease?.diseaseName} के बारे में जानकारी दे सकता हूँ। आप क्या जानना चाहेंगे?`,
      listen: "🔊 सुनें",
      placeholder: "लिखें या माइक दबाएं...",
      thinking: "AI सोच रहा है...",
      busy: "अधिक उपयोग। कृपया बाद में पुनः प्रयास करें।",
      err: "AI सेवा व्यस्त है। फिर से कोशिश करें।"
    },
    Marathi: {
      askChoice: `तुमच्या पिकावर ${disease?.diseaseName || 'रोग'} आढळला आहे. तुम्हाला AI मार्गदर्शन हवंय की तज्ञाशी चॅट करायची आहे?`,
      aiGuidance: "🤖 AI मार्गदर्शन",
      expertChat: "💬 तज्ञाशी चॅट",
      expertHeader: "कृषि तज्ञ",
      expertGreeting: "नमस्कार, मी कृषी तज्ञ आहे. कृपया पिकाची समस्या सांगा.",
      expertReply: `तुमच्या पिकासाठी ${medicine?.name || 'औषध'} योग्य आहे. आठवड्यातून एकदा फवारणी करा.`,
      orderBtn: "🛒 औषध ऑर्डर करा",
      aiWelcome: `मी ${disease?.diseaseName} बद्दल माहिती देऊ शकतो. तुम्हाला काय जाणून घ्यायचे आहे?`,
      listen: "🔊 ऐका",
      placeholder: "लिहा किंवा माइक दाबा...",
      thinking: "AI विचार करत आहे...",
      busy: "जास्त वापर. कृपया नंतर पुन्हा प्रयत्न करा.",
      err: "AI सेवा व्यस्त आहे. पुन्हा प्रयत्न करा."
    }
  }[lang];

  useEffect(() => {
    if (mode === 'INITIAL' && user) {
      triggerVoice(t.askChoice, 'system');
    }
  }, [mode, lang, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // STT Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lang === 'Marathi' ? 'mr-IN' : lang === 'Hindi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        handleUserMessage(text);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [lang]);

  const toggleListening = () => {
    triggerHaptic(10);
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleUserMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    triggerHaptic(15);
    // STEP 1: Message shows immediately
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    
    // STEP 2 & 3: PROCESSING STATE & ONE REQUEST
    setIsProcessing(true);

    try {
      if (mode === 'EXPERT') {
        // Simulated Expert Response
        await new Promise(r => setTimeout(r, 1000));
        const replyText = t.expertReply;
        setMessages(prev => [...prev, { role: 'expert', text: replyText, showOrder: true }]);
        // Voice is NOT automatic as per Step 4
      } else {
        // STEP 6: AI Chat call with context & language
        const context = {
          diseaseName: disease?.diseaseName,
          cropName: disease?.cropName
        };
        const response = await chatWithAI(text, lang, context);
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
      }
    } catch (err: any) {
      // STEP 5: HANDLE QUOTA
      const isQuota = err.message.includes("QUOTA");
      const errorMsg = isQuota ? t.busy : t.err;
      setMessages(prev => [...prev, { role: mode === 'EXPERT' ? 'expert' : 'ai', text: errorMsg }]);
    } finally {
      // Re-enable send button
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] animate-fadeIn">
      {mode === 'INITIAL' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4 text-center">
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <BotIcon size={48} />
          </div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight px-4">{t.askChoice}</h2>
          <div className="w-full space-y-3 px-4">
            <button onClick={() => { triggerHaptic(20); setMode('AI'); setMessages([{ role: 'ai', text: t.aiWelcome }]); }} className="w-full bg-white border-2 border-green-600 text-green-600 font-bold py-4 rounded-2xl shadow-sm">{t.aiGuidance}</button>
            <button onClick={() => { triggerHaptic(20); setMode('EXPERT'); setMessages([{ role: 'expert', text: t.expertGreeting }]); }} className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg">{t.expertChat}</button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border-b border-gray-100 p-3 mb-2 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${mode === 'EXPERT' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
              {mode === 'EXPERT' ? <ExpertIcon /> : <BotIcon />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-800">{mode === 'EXPERT' ? t.expertHeader : "AgroAI Assistant"}</h3>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{mode === 'EXPERT' ? "Expert Online" : "AI Powered"}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pb-4 px-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm text-sm ${
                  m.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                  {m.showOrder && (
                    <button onClick={() => { triggerHaptic(20); navigateTo('CHECKOUT'); }} className="mt-3 w-full bg-green-600 text-white font-black py-3 rounded-xl text-xs">{t.orderBtn}</button>
                  )}
                </div>
                {m.role !== 'user' && (
                  <button 
                    onClick={() => { triggerHaptic(5); triggerVoice(m.text, 'ai'); }} 
                    className="mt-1 text-[10px] font-bold text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full active:scale-90"
                  >
                    {t.listen}
                  </button>
                )}
              </div>
            ))}
            
            {/* STEP 2: Thinking State */}
            {isProcessing && (
              <div className="flex items-center gap-2 text-gray-400 italic text-[11px] animate-pulse ml-2">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
                {t.thinking}
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <div className="p-2 space-y-2">
            <div className="flex gap-2">
              <button 
                onClick={toggleListening}
                disabled={isProcessing}
                className={`p-3 rounded-xl shadow-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-50 text-green-600 disabled:opacity-50'}`}
              >
                <MicIcon />
              </button>
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isProcessing}
                placeholder={t.placeholder}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 disabled:bg-gray-50"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleUserMessage(inputValue);
                }}
              />
              <button 
                onClick={() => handleUserMessage(inputValue)}
                disabled={isProcessing || !inputValue.trim()}
                className="bg-green-600 text-white p-3 rounded-xl shadow-lg disabled:bg-gray-400 transition-colors"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const BotIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
);
const ExpertIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v2"/><path d="M18 9h2"/></svg>
);
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
);

export default ChatInterface;
