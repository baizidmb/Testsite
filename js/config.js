/**
 * Global Store Configuration - LittleNest BD
 * Centralized contact details and tracking IDs.
 * To change the contact numbers or Pixel ID across the entire page, edit here:
 */
const SITE_CONFIG = {
  // WhatsApp number for direct wa.me links (digits only, e.g. "971567813203" or "8801712345678")
  WHATSAPP_NUMBER: "971567813203",

  // Hotline phone number to display and call (e.g. "+971567813203" or "+8801712345678")
  HOTLINE_DISPLAY: "+971567813203",

  // Meta (Facebook) Pixel ID (leave empty "" for now or paste Pixel ID string)
  PIXEL_ID: ""
};

// Expose globally
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
