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
      let order = req.body;
      if (typeof order === 'string') {
        order = JSON.parse(order);
      }
      if (order && (order.customerName || order.orderId)) {
        const exists = ordersCache.some(o => o.orderId === order.orderId);
        if (!exists) {
          ordersCache.unshift(order);
          if (ordersCache.length > 300) ordersCache.pop();
        }
        return res.status(200).json({ success: true, count: ordersCache.length, order });
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
