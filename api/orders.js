/**
 * Vercel Serverless Function: Orders API
 * Supports GET (list orders) and POST (submit new order)
 */

let ordersCache = [];

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      let payload = req.body;
      if (typeof payload === 'string') {
        payload = JSON.parse(payload);
      }

      // Handle Clear All
      if (payload && payload.action === 'clear') {
        ordersCache = [];
        return res.status(200).json({ success: true, count: 0, orders: [] });
      }

      // Handle Update Status & Cancel/Return Reason
      if (payload && payload.action === 'updateStatus' && payload.orderId) {
        const item = ordersCache.find(o => o.orderId === payload.orderId);
        if (item) {
          item.status = payload.status || item.status;
          if (payload.cancelReason !== undefined) item.cancelReason = payload.cancelReason;
          if (payload.returnReason !== undefined) item.returnReason = payload.returnReason;
          item.updatedAt = Date.now();
          return res.status(200).json({ success: true, count: ordersCache.length, order: item, orders: ordersCache });
        }
        return res.status(404).json({ success: false, error: 'Order not found in server cache' });
      }

      // Handle Create or In-place Update Order
      if (payload && (payload.customerName || payload.orderId)) {
        const idx = ordersCache.findIndex(o => o.orderId === payload.orderId);
        if (idx !== -1) {
          ordersCache[idx] = { ...ordersCache[idx], ...payload, updatedAt: Date.now() };
          return res.status(200).json({ success: true, count: ordersCache.length, order: ordersCache[idx], orders: ordersCache });
        } else {
          ordersCache.unshift(payload);
          if (ordersCache.length > 300) ordersCache.pop();
          return res.status(200).json({ success: true, count: ordersCache.length, order: payload, orders: ordersCache });
        }
      }
      return res.status(400).json({ success: false, error: 'Invalid order payload' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({ success: true, orders: ordersCache });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
