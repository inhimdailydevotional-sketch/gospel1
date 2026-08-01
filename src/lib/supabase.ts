import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Submission services are not configured for this deployment.');
  }

  return supabase;
}

/* ─── typed helpers ─────────────────────────────────────────── */

export async function insertFreeSampleLead(data: {
  first_name: string;
  email: string;
  source: 'homepage_cta' | 'free_sample_page';
  country?: string;
  city_region?: string;
  referral_source?: string;
}) {
  const { error } = await getSupabaseClient().from('free_sample_leads').insert(data);
  if (error) throw error;
}

export async function insertNewsletterSubscriber(data: {
  name: string;
  email: string;
  country?: string;
  city_region?: string;
}) {
  const { error } = await getSupabaseClient().from('newsletter_subscribers').insert({
    ...data,
    status: 'subscribed',
    subscribed_at: new Date().toISOString(),
  });
  if (error) {
    if (error.code === '23505') return;
    throw error;
  }
}

export async function insertPrayerPartner(data: {
  name: string;
  email: string;
  country?: string;
  city_region?: string;
}) {
  const { error } = await getSupabaseClient().from('prayer_partners').insert({
    ...data,
    status: 'active',
  });
  if (error) {
    if (error.code === '23505') return;
    throw error;
  }
}

export async function insertPrayerRequest(data: {
  name: string;
  email?: string;
  request: string;
  country?: string;
  city_region?: string;
}) {
  const { error } = await getSupabaseClient().from('prayer_requests').insert({
    name:    data.name,
    email:   data.email || null,
    request: data.request,
    country: data.country || null,
    city_region: data.city_region || null,
  });
  if (error) throw error;
}

export async function insertContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  country?: string;
  city_region?: string;
}) {
  const { error } = await getSupabaseClient().from('contact_messages').insert(data);
  if (error) throw error;
}

export async function insertDonation(data: {
  name: string;
  email: string;
  country?: string;
  city_region?: string;
  amount?: number;
  prayer_request?: string;
  message?: string;
}) {
  const { error } = await getSupabaseClient().from('donations').insert(data);
  if (error) throw error;
}
