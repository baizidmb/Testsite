/**
 * Global Store Configuration - LittleNest BD
 * Centralized contact details and tracking IDs.
 * To change the contact numbers or Pixel ID across the entire page, edit here:
 */
const SITE_CONFIG = {
  // WhatsApp number for direct wa.me links (digits only, e.g. "8801700000000")
  WHATSAPP_NUMBER: "8801700000000",

  // Hotline phone number to display and call (e.g. "+8801700000000")
  HOTLINE_DISPLAY: "+8801700000000",

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
