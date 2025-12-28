
export type AppState = 'LANGUAGE_SELECT' | 'PROFILE' | 'HOME' | 'SCAN' | 'RESULT' | 'CHAT' | 'MEDICINE' | 'CHECKOUT' | 'INVOICE' | 'DELIVERY' | 'ABOUT' | 'CLIMATE' | 'VILLAGE_MAP' | 'SPRAY_ADVISORY';

export interface LocationData {
  name: string;
  district: string;
  uri?: string;
  lat?: number;
  lng?: number;
}

export interface UserProfile {
  name: string;
  gender: 'Male' | 'Female';
  savedLocation?: LocationData;
  activeCrop?: string;
}

export interface DiseaseResult {
  cropName: string;
  diseaseName: string;
  accuracy: number;
  severity: 'Low' | 'Medium' | 'High';
  description: {
    cause: string;
    symptoms: string;
    impact: string;
    prevention: string;
  };
  recommendedMedicine?: Medicine; 
}

export interface Medicine {
  name: string;
  type: string;
  dosage: string;
  application: string;
  price: number;
  organic: boolean;
  image?: string;
}

export interface SprayRecommendation {
  name: string;
  useFor: string;
  tip: string;
  dosage: string;
  imageUrl: string;
}

export type CropStage = 'Initial' | 'Growth' | 'Flowering';

export interface FarmerInfo {
  name: string;
  mobile: string;
  address: {
    village: string;
    taluka: string;
    district: string;
    state: string;
    pincode: string;
  };
}

export interface Order {
  id: string;
  disease: string;
  medicine: Medicine;
  farmer: FarmerInfo;
  amount: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export type Language = 'Marathi' | 'Hindi' | 'English';

export const CROP_PHOTOS: Record<string, string> = {
  "Cotton": "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=600",
  "Onion": "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=600",
  "Soybean": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600",
  "Tomato": "https://images.unsplash.com/photo-1592841200221-a6898f307bac?auto=format&fit=crop&q=80&w=600",
  "Sugarcane": "https://images.unsplash.com/photo-1594142145070-e41c4228c2e6?auto=format&fit=crop&q=80&w=600",
  "Wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
  "Maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600",
  "Grapes": "https://images.unsplash.com/photo-1533604131587-32c2ed869bb0?auto=format&fit=crop&q=80&w=600",
  "Pomegranate": "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=600"
};
