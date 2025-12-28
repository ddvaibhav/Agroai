
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { DiseaseResult, Language, LocationData, SprayRecommendation, CropStage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- VOICE ENGINE STATE ---
let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
const audioCache = new Map<string, AudioBuffer>();

// --- HAPTICS ---
export const triggerHaptic = (pattern: number | number[] = 15) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// CIRCUIT BREAKER
let lastQuotaErrorTime = 0;
const QUOTA_COOLDOWN_MS = 60000;

export const isQuotaLimited = () => {
  if (lastQuotaErrorTime === 0) return false;
  const elapsed = Date.now() - lastQuotaErrorTime;
  if (elapsed > QUOTA_COOLDOWN_MS) {
    lastQuotaErrorTime = 0;
    return false;
  }
  return true;
};

export const getRemainingCooldown = () => {
  if (lastQuotaErrorTime === 0) return 0;
  const elapsed = Date.now() - lastQuotaErrorTime;
  const remaining = QUOTA_COOLDOWN_MS - elapsed;
  return Math.max(0, remaining);
};

export const nativeSpeak = (text: string, lang: Language) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  const voiceMap = {
    'Marathi': 'mr-IN',
    'Hindi': 'hi-IN',
    'English': 'en-US'
  };
  
  utterance.lang = voiceMap[lang];
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

export const initAudioContext = async () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  if (audioCtx.state === 'suspended') await audioCtx.resume();
};

async function callWithRetry<T>(fn: () => Promise<T>): Promise<T> {
  if (isQuotaLimited()) throw new Error("QUOTA_LIMIT_ACTIVE");
  try {
    return await fn();
  } catch (error: any) {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("quota") || msg.includes("429") || msg.includes("limit")) {
      lastQuotaErrorTime = Date.now();
      throw new Error("QUOTA_EXCEEDED");
    }
    throw error;
  }
}

export const searchVillage = async (query: string, lat?: number, lng?: number): Promise<LocationData | null> => {
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find the official village/city name and district in Maharashtra for: ${query}. Use the map tool to be accurate.`,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: lat && lng ? {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        } : undefined
      },
    });

    const chunk = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.[0];
    if (chunk?.maps) {
      return {
        name: chunk.maps.title || query,
        district: "Maharashtra",
        uri: chunk.maps.uri
      };
    }
    return null;
  });
};

export const getVillageSuggestions = async (query: string): Promise<LocationData[]> => {
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `List 5 real villages or talukas in Maharashtra that match or are near "${query}". Return as JSON array of objects with 'name' and 'district' properties.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              district: { type: Type.STRING }
            },
            required: ["name", "district"]
          }
        }
      }
    });
    const text = response.text || "[]";
    return JSON.parse(text);
  });
};

export const getSprayRecommendation = async (crop: string, stage: CropStage, lang: Language, disease?: string): Promise<SprayRecommendation | null> => {
  return callWithRetry(async () => {
    const today = new Date().toDateString();
    const prompt = `Recommend one best chemical or organic spray for ${crop} at the ${stage} stage for today (${today}). ${disease ? `Previously detected disease: ${disease}.` : "Preventive spray advisory."} 
    Provide response in JSON format. Use ${lang} for 'useFor' and 'tip'.
    For 'imageUrl', use a real-looking agricultural pesticide bottle image from Unsplash. Pick a unique one if possible.
    JSON structure: { name: string (English), useFor: string, tip: string, dosage: string, imageUrl: string }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            useFor: { type: Type.STRING },
            tip: { type: Type.STRING },
            dosage: { type: Type.STRING },
            imageUrl: { type: Type.STRING }
          },
          required: ["name", "useFor", "tip", "dosage", "imageUrl"]
        }
      }
    });

    const res = JSON.parse(response.text || "null");
    if (res && (!res.imageUrl || !res.imageUrl.startsWith('http'))) {
      res.imageUrl = `https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80&w=400`;
    }
    return res;
  });
};

export const chatWithAI = async (message: string, lang: Language, context?: { diseaseName?: string, cropName?: string }): Promise<string> => {
  return callWithRetry(async () => {
    const systemInstruction = `You are an expert agricultural assistant for AgroAI Pro. 
    Always reply in ${lang}. 
    Keep advice practical, simple, and safe for farmers.
    Current context: ${context?.cropName ? `Crop: ${context.cropName}, ` : ''}${context?.diseaseName ? `Disease: ${context.diseaseName}` : ''}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text || (lang === 'Marathi' ? "क्षमस्व, मला प्रतिसाद मिळाला नाही." : lang === 'Hindi' ? "क्षमा करें, मुझे कोई प्रतिक्रिया नहीं मिली।" : "Sorry, I received no response.");
  });
};

export const analyzePlantImage = async (base64Image: string): Promise<DiseaseResult | null> => {
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { 
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: "Identify plant disease AND recommend medicine. Return JSON only: { cropName, diseaseName, accuracy, severity, description: {cause, symptoms, impact, prevention}, recommendedMedicine: {name, type, dosage, application, price, organic} }" }
        ] 
      },
      config: { responseMimeType: "application/json" }
    });
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr) as DiseaseResult;
  });
};

export const stopVoice = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (currentSource) { try { currentSource.stop(); } catch(e){} currentSource = null; }
};

export const aiSpeak = async (text: string, lang: string, gender: 'Male' | 'Female') => {
  if (!text || isQuotaLimited()) return;
  
  const cacheKey = `ai_${lang}_${gender}_${text.trim()}`;
  if (audioCache.has(cacheKey)) {
    playBuffer(audioCache.get(cacheKey)!);
    return;
  }

  try {
    await initAudioContext();
    const voiceName = gender === 'Male' ? 'Kore' : 'Puck';
    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
          },
        },
      });
    });

    const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64 && audioCtx) {
      const bin = atob(base64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      
      const i16 = new Int16Array(bytes.buffer);
      const buffer = audioCtx.createBuffer(1, i16.length, 24000);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < i16.length; i++) data[i] = i16[i] / 32768.0;
      
      audioCache.set(cacheKey, buffer);
      playBuffer(buffer);
    }
  } catch (e) {
    console.warn("AI TTS Failed, falling back to Native", e);
    nativeSpeak(text, lang as any);
  }
};

const playBuffer = (buffer: AudioBuffer) => {
  if (!audioCtx) return;
  stopVoice();
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  currentSource = source;
  source.start(0);
};

export const getSampleResult = (lang: Language): DiseaseResult => ({
  cropName: lang === 'Marathi' ? "टोमॅटो" : lang === 'Hindi' ? "टमाटर" : "Tomato",
  diseaseName: lang === 'Marathi' ? "अर्ली ब्लाइट" : lang === 'Hindi' ? "अर्ली ब्लाइट" : "Early Blight",
  accuracy: 0.98,
  severity: "Medium",
  description: {
    cause: "Alternaria solani fungus",
    symptoms: "Target-shaped brown spots on leaves",
    impact: "Reduces yield and quality of fruit",
    prevention: "Rotate crops and use drip irrigation"
  },
  recommendedMedicine: {
    name: "Mancozeb 75% WP",
    type: "Fungicide",
    dosage: "30g per 15L water",
    application: "Foliar Spray",
    price: 450,
    organic: false
  }
});
