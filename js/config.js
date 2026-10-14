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
  SUPABASE_URL: "https://acxqhjuzndgdbbgsvlig.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjeHFoanV6bmRnZGJiZ3N2bGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMDMzNzksImV4cCI6MjEwNzU3OTM3OX0.wVGno8QuCw1QxfKIOY0wf0OqjBzz_dS8qGJt0OA0IhI"
};

// Expose globally
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
