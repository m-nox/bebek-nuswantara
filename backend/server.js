const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Dana } = require('dana-node');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Keep raw body for webhook signature verification
app.use('/v1.0/debit/notify', express.raw({ type: 'application/json' }));
app.use(express.json());

// Wrap raw base64 key in PEM headers if not already wrapped
function wrapPem(raw, type) {
  if (!raw) return undefined;
  raw = raw.trim();
  if (raw.startsWith('-----')) return raw; // already has headers
  const header = `-----BEGIN ${type}-----`;
  const footer = `-----END ${type}-----`;
  // chunk into 64-char lines
  const body = raw.match(/.{1,64}/g).join('\n');
  return `${header}\n${body}\n${footer}`;
}

const privateKey = wrapPem(process.env.DANA_PRIVATE_KEY, 'PRIVATE KEY');
const publicKey  = wrapPem(process.env.DANA_PUBLIC_KEY,  'PUBLIC KEY');

// Initialize DANA client
let paymentGatewayApi = null;
let danaClient = null;
try {
  danaClient = new Dana({
    partnerId: process.env.DANA_CLIENT_ID,
    privateKey: privateKey,
    origin: process.env.ORIGIN || 'http://localhost:3001',
    env: process.env.DANA_ENV || 'SANDBOX',
    clientSecret: process.env.DANA_CLIENT_SECRET,
  });
  paymentGatewayApi = danaClient.paymentGateway;
  console.log('[DANA] Client initialized successfully.');
} catch (e) {
  console.error('[DANA] Client initialization failed:', e.message);
}

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', initialized: !!paymentGatewayApi });
});

// ─── Create Order ─────────────────────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  const { cartItems, orderData, totalAmount } = req.body;
  if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const orderId = `BBR-${Date.now()}`;
  const newOrder = { id: orderId, orderData, cartItems, totalAmount, status: 'pending', createdAt: new Date().toISOString() };
  orders.push(newOrder);
  console.log(`[Order Created] ${orderId} - Total: Rp ${totalAmount}`);

  // Expire in 1 hour (WIB / UTC+7)
  const exp = new Date();
  exp.setHours(exp.getHours() + 8); // adjust to UTC+7
  const validUpTo = exp.toISOString().slice(0, 19) + '+07:00';

  const BASE_URL = process.env.BASE_URL || 'https://bebek-nuswantara.vercel.app';

  // Fallback URL if DANA API is unavailable
  let checkoutUrl = `https://m.dana.id/m/portal/cashier/checkout?orderId=${orderId}&amount=${totalAmount}&merchantId=${process.env.DANA_MERCHANT_ID}`;

  if (paymentGatewayApi) {
    try {
      const createOrderRequest = {
        partnerReferenceNo: orderId,
        merchantId: process.env.DANA_MERCHANT_ID,
        amount: {
          value: `${totalAmount}.00`,
          currency: 'IDR',
        },
        validUpTo,
        urlParams: [
          {
            url: `${BASE_URL}/v1.0/debit/notify`,
            type: 'NOTIFY',
            isDeeplink: 'N',
          },
          {
            url: `${BASE_URL}/api/payment/finish?orderId=${orderId}`,
            type: 'PAY_RETURN',
            isDeeplink: 'N',
          },
        ],
        // Required for API-flow (hosted checkout page)
        payOptionDetails: [
          {
            payMethod: 'DANA_WALLET',
            payOption: 'REDIRECT',
            transAmount: {
              value: `${totalAmount}.00`,
              currency: 'IDR',
            },
          },
        ],
        additionalInfo: {
          order: {
            scenario: 'API',
          },
        },
      };

      const response = await paymentGatewayApi.createOrder(createOrderRequest);
      console.log('[DANA] createOrder response:', JSON.stringify(response, null, 2));

      checkoutUrl = response.webRedirectUrl || response.redirectUrl || checkoutUrl;
    } catch (error) {
      console.error('[DANA] createOrder error:', error.message || error);
    }
  }

  return res.json({ success: true, orderId, paymentUrl: checkoutUrl });
});

// ─── DANA Webhook Notify (ASPI path) ─────────────────────────────────────────
app.post('/v1.0/debit/notify', (req, res) => {
  const httpMethod = req.method;
  const relativePathUrl = req.path;
  const headers = req.headers;

  let requestBodyString;
  if (Buffer.isBuffer(req.body)) {
    requestBodyString = req.body.toString('utf8');
  } else if (typeof req.body === 'string') {
    requestBodyString = req.body;
  } else {
    requestBodyString = JSON.stringify(req.body);
  }

  try {
    const { WebhookParser } = require('dana-node/dist/webhook');
    const parser = new WebhookParser(publicKey, undefined);
    const finishNotify = parser.parseWebhook(httpMethod, relativePathUrl, headers, requestBodyString);

    console.log('[DANA Webhook] Order Reference:', finishNotify.originalPartnerReferenceNo);
    console.log('[DANA Webhook] Status:', finishNotify.latestTransactionStatus);

    // Update order status
    const orderIndex = orders.findIndex(o => o.id === finishNotify.originalPartnerReferenceNo);
    if (orderIndex !== -1) {
      orders[orderIndex].status = finishNotify.latestTransactionStatus === 'SUCCESS' ? 'paid' : finishNotify.latestTransactionStatus;
    }

    res.status(200).send('Webhook received and verified.');
  } catch (error) {
    console.error('[DANA Webhook] Verification failed:', error.message);
    res.status(400).send(`Webhook verification failed: ${error.message}`);
  }
});

// ─── Customer Finish Redirect ─────────────────────────────────────────────────
app.get('/api/payment/finish', (req, res) => {
  const orderId = req.query.orderId || '';
  console.log(`[Finish Redirect] Customer returned from DANA. Order: ${orderId}`);
  res.redirect(`http://localhost:5173/confirmation?orderId=${orderId}`);
});

// ─── List Orders ──────────────────────────────────────────────────────────────
app.get('/api/orders', (req, res) => {
  res.json({ orders });
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
