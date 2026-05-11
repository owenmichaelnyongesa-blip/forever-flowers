// ============================================================
//  FOREVER FLOWERS — SUPABASE CONFIGURATION
//  ✏️  CLIENT SETUP: Replace the values below with your
//      actual Supabase project URL and anon key.
//      Find these at: https://supabase.com → Your Project
//      → Settings → API
// ============================================================

const SUPABASE_URL = "https://tfkqoezxjtstqjitwbhk.supabase.co";
// Example: "https://abcdefghijklm.supabase.co"

const SUPABASE_ANON_KEY = "sb_publishable_wA_ZJPjqFLZZwHPIxP-SbA_bRL6vedh";
// Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// ── PAYSTACK ─────────────────────────────────────────────────
// ✏️  Replace with your Paystack PUBLIC key (starts with pk_)
// Find at: https://dashboard.paystack.com → Settings → API Keys
const PAYSTACK_PUBLIC_KEY = "pk_live_ce7b117c9f15d28a9d56b1cae1771d6c8767cb10";
// Example: "pk_live_xxxxxxxxxxxxxxxxxxxx"
// Use "pk_test_xxxx" for testing before going live

// ── BUSINESS CONFIG ──────────────────────────────────────────
const BUSINESS_CONFIG = {
  name:          "Forever Flowers",
  whatsapp:      "254790022080",
  email:         "hello@foreverflowers.co.ke",
  currency:      "KES",
  deliveryFee:   300,    // KSh delivery fee — edit this
  freeDeliveryAt: 3000,  // Free delivery above this amount
  deliveryAreas: "Nairobi and surroundings",
};

// ── INITIALIZE SUPABASE CLIENT ────────────────────────────────
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);



