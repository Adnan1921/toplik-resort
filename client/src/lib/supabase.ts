import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Admin features will be disabled.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database types
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  submission_type: 'contact' | 'reservation' | 'inquiry';
  is_read: boolean;
  notes: string | null;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReservationInstruction {
  id: string;
  title: string;
  content: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  key: string;
  value: string;
  content_type: 'text' | 'html' | 'json';
  description: string | null;
  created_at: string;
  updated_at: string;
}

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== 'https://placeholder.supabase.co';
};






