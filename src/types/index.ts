export type UserRole = 'retailer' | 'wholesaler' | 'farmer' | 'boda_rider' | 'admin';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  business_name: string | null;
  location: GeoPoint | null;
  address: string | null;
  is_verified: boolean;
  is_active: boolean;
  elevenlabs_voice_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface RetailerInventory {
  id: string;
  retailer_id: string;
  product_id: string;
  current_stock: number;
  low_stock_threshold: number;
  reorder_quantity: number;
  last_updated: string;
  product?: Product;
}

export interface SupplierListing {
  id: string;
  supplier_id: string;
  product_id: string;
  price_per_unit: number;
  available_stock: number;
  min_order_quantity: number;
  unit: string;
  is_active: boolean;
  location: GeoPoint | null;
  delivery_radius_km: number;
  delivery_fee_per_km: number;
  created_at: string;
  updated_at: string;
  product?: Product;
  supplier?: Profile;
  distance_km?: number;
  total_delivery_fee?: number;
}

export interface Order {
  id: string;
  retailer_id: string;
  supplier_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  delivery_fee: number;
  total_amount: number;
  status: OrderStatus;
  delivery_address: string;
  delivery_location: GeoPoint | null;
  delivery_notes: string | null;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  created_at: string;
  updated_at: string;
  product?: Product;
  supplier?: Profile;
  retailer?: Profile;
  boda_assignment?: BodaAssignment;
}

export type OrderStatus = 'pending' | 'confirmed' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'disputed';

export interface BodaAssignment {
  id: string;
  order_id: string;
  boda_rider_id: string;
  status: BodaAssignmentStatus;
  pickup_location: GeoPoint | null;
  delivery_location: GeoPoint | null;
  distance_km: number | null;
  delivery_fee: number | null;
  offered_at: string;
  accepted_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  rider?: Profile;
  order?: Order;
}

export type BodaAssignmentStatus = 'offered' | 'accepted' | 'declined' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface VoiceCommand {
  id: string;
  user_id: string;
  transcript: string;
  intent: string | null;
  entities: Record<string, unknown> | null;
  action_taken: string | null;
  success: boolean | null;
  created_at: string;
}

// ElevenLabs types
export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description: string;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

// Web Speech API types
export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Extend Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface VoiceCommandResult {
  intent: string;
  entities: Record<string, unknown>;
  confidence: number;
}