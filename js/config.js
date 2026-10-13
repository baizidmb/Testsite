/**
 * Global Store Configuration - LittleNest BD
 * Centralized contact details, tracking IDs, and Supabase Database credentials.
 * To change configuration across the entire app, edit here:
 */
const SITE_CONFIG = {
  // WhatsApp number for direct wa.me links (digits only, e.g. "8801700000000")
  WHATSAPP_NUMBER: "8801700000000",

  // Hotline phone number to display and call (e.g. "+8801700000000")
  HOTLINE_DISPLAY: "+8801700000000",

  // Meta (Facebook) Pixel ID (leave empty "" for now or paste Pixel ID string)
  PIXEL_ID: "",

  // ⚡ Supabase PostgreSQL Database Configuration
  // 100% portable for Vercel, Cloudflare Pages, Netlify & local dev.
  // Paste your Supabase project URL and anon public key below (or configure via Admin UI):
  SUPABASE_URL: "https://your-project-id.supabase.co",
  SUPABASE_ANON_KEY: "your-anon-public-key"
};

// Expose globally
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
