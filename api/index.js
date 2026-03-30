import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

// Capture raw body for webhook verification
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// ── Upstash Redis (persistent storage) ────────────────────────────────────────
// Uses REST API – works perfectly in Vercel Serverless (no persistent connections)
const UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

async function redisCommand(...args) {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    return null; // Fallback: no Redis configured
  }
  const res = await fetch(`${UPSTASH_REDIS_REST_URL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  const data = await res.json();
  if (data.error) {
    console.error('[Redis] Error:', data.error);
    return null;
  }
  return data.result;
}

// Helper: save order to Redis (expires after 24 hours)
async function saveOrder(orderId, orderData) {
  const json = JSON.stringify(orderData);
  await redisCommand('SET', `order:${orderId}`, json, 'EX', 86400);
}

// Helper: get order from Redis
async function getOrder(orderId) {
  const json = await redisCommand('GET', `order:${orderId}`);
  if (!json) return null;
  try {
    return typeof json === 'string' ? JSON.parse(json) : json;
  } catch {
    return null;
  }
}

// Helper: update order status
async function updateOrderStatus(orderId, status, extra = {}) {
  const order = await getOrder(orderId);
  if (!order) return null;
  const updated = { ...order, status, ...extra };
  await saveOrder(orderId, updated);
  return updated;
}

// ── Xendit Config ──────────────────────────────────────────────────────────────
const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY || '';
const XENDIT_WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN || '';
const BASE_URL = process.env.BASE_URL || 'https://bebek-nuswantara.vercel.app';
const XENDIT_API = 'https://api.xendit.co';

async function xenditRequest(method, path, body) {
  const response = await fetch(`${XENDIT_API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64'),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Xendit API error: ${response.status}`);
  }
  return data;
}

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    payment: 'xendit',
    storage: UPSTASH_REDIS_REST_URL ? 'redis' : 'none',
    configured: !!XENDIT_SECRET_KEY,
  });
});

// ── Create Order + Xendit Invoice ─────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const { cartItems, orderData, totalAmount, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid total amount' });
    }

    const orderId = `BN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const itemDescriptions = cartItems.map(i => `${i.name || i.id} x${i.quantity}`).join(', ');

    const newOrder = {
      id: orderId,
      orderData,
      cartItems,
      totalAmount,
      paymentMethod: paymentMethod || 'xendit',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      xenditInvoiceId: null,
      xenditInvoiceUrl: null,
    };

    // Create Xendit Invoice
    let invoiceUrl = null;
    if (XENDIT_SECRET_KEY) {
      const invoicePayload = {
        external_id: orderId,
        amount: totalAmount,
        description: `Pesanan Bebek Nuswantara – ${itemDescriptions}`,
        invoice_duration: 3600,
        customer: {
          given_names: orderData?.name || 'Pelanggan',
          mobile_number: orderData?.phone || undefined,
        },
        success_redirect_url: `${BASE_URL}/api/payment/finish?orderId=${orderId}&status=success`,
        failure_redirect_url: `${BASE_URL}/api/payment/finish?orderId=${orderId}&status=failed`,
        currency: 'IDR',
        items: cartItems.map(item => ({
          name: item.name || item.id,
          quantity: item.quantity,
          price: item.price || 0,
        })),
      };

      try {
        const invoice = await xenditRequest('POST', '/v2/invoices', invoicePayload);
        newOrder.xenditInvoiceId = invoice.id;
        newOrder.xenditInvoiceUrl = invoice.invoice_url;
        invoiceUrl = invoice.invoice_url;
      } catch (err) {
        console.error('[Xendit] Create invoice error:', err.message);
        return res.status(500).json({ error: 'Gagal membuat invoice pembayaran.' });
      }
    } else {
      invoiceUrl = `${BASE_URL}/api/payment/finish?orderId=${orderId}&status=success`;
    }

    // Save to Redis
    await saveOrder(orderId, newOrder);

    return res.json({
      success: true,
      orderId,
      invoiceUrl,
    });
  } catch (err) {
    console.error('[Order] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Get Order Status ──────────────────────────────────────────────────────────
app.get('/api/orders/:id', async (req, res) => {
  const order = await getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json({
    id: order.id,
    status: order.status,
    totalAmount: order.totalAmount,
    orderData: order.orderData,
    cartItems: order.cartItems,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
  });
});

// ── Xendit Webhook ────────────────────────────────────────────────────────────
app.post('/api/webhook/xendit', async (req, res) => {
  // Verify X-Callback-Token
  const callbackToken = req.headers['x-callback-token'];
  if (XENDIT_WEBHOOK_TOKEN && callbackToken !== XENDIT_WEBHOOK_TOKEN) {
    console.error('[Webhook] Invalid callback token');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Parse body
  let payload;
  if (Buffer.isBuffer(req.body)) {
    payload = JSON.parse(req.body.toString('utf8'));
  } else {
    payload = req.body;
  }

  console.log('[Webhook] Received:', JSON.stringify(payload));

  const externalId = payload.external_id;
  const status = payload.status; // PAID, EXPIRED, etc.

  if (externalId) {
    const updated = await updateOrderStatus(externalId, status || 'PAID', {
      paidAt: payload.paid_at || new Date().toISOString(),
      xenditPaymentMethod: payload.payment_method || null,
      xenditPaymentChannel: payload.payment_channel || null,
    });

    if (updated) {
      console.log(`[Webhook] Order ${externalId} updated to ${status}`);
    } else {
      console.warn(`[Webhook] Order ${externalId} not found in Redis`);
    }
  }

  return res.status(200).json({ status: 'ok' });
});

// ── Payment Finish Redirect ───────────────────────────────────────────────────
app.get('/api/payment/finish', (req, res) => {
  const orderId = req.query.orderId || '';
  const status = req.query.status || 'unknown';
  console.log(`[Finish] Customer returned. Order: ${orderId}, Status: ${status}`);
  res.redirect(`/confirmation?orderId=${orderId}`);
});

// ── List All Orders (admin/debug) ─────────────────────────────────────────────
app.get('/api/orders', async (_req, res) => {
  const keys = await redisCommand('KEYS', 'order:*');
  if (!keys || keys.length === 0) {
    return res.json({ orders: [] });
  }

  const orders = [];
  for (const key of keys.slice(0, 50)) {
    const json = await redisCommand('GET', key);
    if (json) {
      try {
        orders.push(typeof json === 'string' ? JSON.parse(json) : json);
      } catch { /* skip invalid */ }
    }
  }

  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders });
});

export default app;
