/**
 * Facebook Pixel Integration for E-Commerce Landing Page
 * Designed for High-Conversion Facebook Ads Tracking
 */

// Default Facebook Pixel ID (from localStorage or centralized SITE_CONFIG)
let DEFAULT_PIXEL_ID = localStorage.getItem('fb_pixel_id') || 
  (typeof window !== 'undefined' && window.SITE_CONFIG && window.SITE_CONFIG.PIXEL_ID ? window.SITE_CONFIG.PIXEL_ID : '') || 
  '';

window.FACEBOOK_PIXEL_ID = DEFAULT_PIXEL_ID;

// Initialize Meta Pixel Code
(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = '2.0';
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

// Function to initialize pixel with an ID
function initFacebookPixel(pixelId) {
  if (!pixelId || pixelId === 'YOUR_PIXEL_ID_HERE') {
    console.warn('[Meta Pixel] Pixel ID is not configured yet. Set your Pixel ID in Admin Settings or js/pixel.js');
    return false;
  }
  try {
    fbq('init', pixelId);
    fbq('track', 'PageView');
    console.log(`[Meta Pixel] Initialized successfully with ID: ${pixelId}`);
    return true;
  } catch (err) {
    console.error('[Meta Pixel] Error initializing pixel:', err);
    return false;
  }
}

// Auto init if valid pixel ID exists
if (DEFAULT_PIXEL_ID && DEFAULT_PIXEL_ID !== 'YOUR_PIXEL_ID_HERE') {
  initFacebookPixel(DEFAULT_PIXEL_ID);
} else {
  console.info('[Meta Pixel] Ready for Pixel ID setup. You can set it from the footer admin button or by setting localStorage.getItem("fb_pixel_id")');
}

/**
 * Meta Pixel Standard Event Wrappers
 */
const PixelTracker = {
  // Track PageView
  trackPageView: function () {
    try {
      if (window.fbq) fbq('track', 'PageView');
      console.log('[Meta Pixel] Tracked: PageView');
    } catch (e) {
      console.warn('[Meta Pixel] Could not track PageView', e);
    }
  },

  // Track ViewContent (when product page loads or user views product)
  trackViewContent: function (productData) {
    const data = {
      content_name: productData.name || 'বাচ্চাদের প্রিমিয়াম ফুড গ্রেড সিলিকন ফিডিং সেট (৬ পিস)',
      content_category: 'Baby Care & Dinnerware',
      content_ids: [productData.id || 'SKU-SILICONE-FEEDER-SET'],
      content_type: 'product',
      value: productData.price || 1190,
      currency: 'BDT'
    };
    try {
      if (window.fbq) fbq('track', 'ViewContent', data);
      console.log('[Meta Pixel] Tracked: ViewContent', data);
    } catch (e) {
      console.warn('[Meta Pixel] Could not track ViewContent', e);
    }
  },

  // Track AddToCart (when customer selects variant or clicks "অর্ডার করুন")
  trackAddToCart: function (cartData) {
    const data = {
      content_name: cartData.name || 'বাচ্চাদের সিলিকন ফিডিং সেট',
      content_ids: [cartData.id || 'SKU-SILICONE-FEEDER-SET'],
      content_type: 'product',
      value: cartData.price || 1190,
      currency: 'BDT',
      quantity: cartData.quantity || 1
    };
    try {
      if (window.fbq) fbq('track', 'AddToCart', data);
      console.log('[Meta Pixel] Tracked: AddToCart', data);
    } catch (e) {
      console.warn('[Meta Pixel] Could not track AddToCart', e);
    }
  },

  // Track InitiateCheckout (when customer scrolls to or starts filling the order form)
  trackInitiateCheckout: function (checkoutData) {
    const data = {
      content_name: 'সিলিকন ফিডিং সেট অর্ডার ফর্ম',
      content_ids: ['SKU-SILICONE-FEEDER-SET'],
      content_type: 'product',
      value: checkoutData.total || 1190,
      currency: 'BDT',
      num_items: checkoutData.num_items || 1
    };
    try {
      if (window.fbq) fbq('track', 'InitiateCheckout', data);
      console.log('[Meta Pixel] Tracked: InitiateCheckout', data);
    } catch (e) {
      console.warn('[Meta Pixel] Could not track InitiateCheckout', e);
    }
  },

  // Track Purchase (upon successful order form submission)
  trackPurchase: function (orderData) {
    const data = {
      content_name: orderData.packageTitle || 'সিলিকন ফিডিং সেট কম্বো',
      content_ids: ['SKU-SILICONE-FEEDER-SET'],
      content_type: 'product',
      value: orderData.totalPrice,
      currency: 'BDT',
      num_items: orderData.quantity || 1,
      order_id: orderData.orderId
    };
    try {
      if (window.fbq) fbq('track', 'Purchase', data);
      console.log('[Meta Pixel] Tracked: Purchase', data);
    } catch (e) {
      console.warn('[Meta Pixel] Could not track Purchase', e);
    }
  },

  // Track Contact / WhatsApp Click
  trackContact: function (method) {
    try {
      if (window.fbq) fbq('track', 'Contact', { method: method });
      console.log(`[Meta Pixel] Tracked: Contact via ${method}`);
    } catch (e) {
      console.warn('[Meta Pixel] Could not track Contact', e);
    }
  }
};

window.PixelTracker = PixelTracker;
