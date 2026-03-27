const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Dana, PaymentGatewayApi } = require('dana-node');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const orders = [];

// Avoid crashing if credentials are set but not fully valid structurally by users.
let paymentApi = null;
try {
  const danaClient = new Dana({
      partnerId: process.env.DANA_CLIENT_ID || 'MOCK',
      privateKey: process.env.DANA_PRIVATE_KEY || 'MOCK_KEY',
      origin: process.env.ORIGIN || "http://localhost:3001",
      env: process.env.DANA_ENV || "SANDBOX"
  });
  paymentApi = new PaymentGatewayApi(danaClient);
} catch (e) {
  console.log("Could not initialize DANA Client due to key format. Using fallback mode.");
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running with DANA integration!' });
});

app.post('/api/orders', async (req, res) => {
  const { cartItems, orderData, totalAmount } = req.body;
  if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const orderId = `BBR-${Math.floor(Math.random() * 900000) + 100000}`;
  const newOrder = { id: orderId, orderData, cartItems, totalAmount, status: 'pending', createdAt: new Date().toISOString() };
  orders.push(newOrder);
  console.log(`[Order Created] ${orderId} - Total: Rp ${totalAmount}`);

  const d = new Date();
  d.setHours(d.getHours() + 1);
  const validUpTo = d.toISOString().replace(/\.[0-9]{3}/, '').replace('Z', '+07:00');

  let checkoutUrl = `https://m.dana.id/m/portal/cashier/checkout?orderId=${orderId}&amount=${totalAmount}&merchantId=${process.env.DANA_MERCHANT_ID}`;

  if (paymentApi && process.env.DANA_PRIVATE_KEY && process.env.DANA_PRIVATE_KEY.length > 50) {
      try {
         const response = await paymentApi.createOrder({
             partnerReferenceNo: orderId,
             merchantId: process.env.DANA_MERCHANT_ID || 'MOCK',
             amount: { value: totalAmount.toString() + ".00", currency: "IDR" },
             validUpTo: validUpTo,
             urlParams: [
                 { url: "https://bebek-nuswantara.vercel.app/api/payment/notify", type: "NOTIFY", isDeeplink: "N" },
                 { url: "https://bebek-nuswantara.vercel.app/api/payment/finish?orderId=" + orderId, type: "PAY_RETURN", isDeeplink: "N" }
             ]
         });
         
         checkoutUrl = response.redirectUrl || response.checkoutUrl || checkoutUrl;
      } catch (error) {
         console.error('DANA API Error:', error);
      }
  }

  return res.json({ 
    success: true, orderId: newOrder.id, paymentUrl: checkoutUrl, message: 'DANA checkout generated.' 
  });
});

app.post('/api/payment/notify', (req, res) => {
  const notification = req.body;
  if (notification && notification.orderId) {
    const orderIndex = orders.findIndex(o => o.id === notification.orderId);
    if (orderIndex !== -1) orders[orderIndex].status = 'paid';
  }
  return res.json({ resultInfo: { resultStatus: "S", resultCodeId: "00000000", resultMsg: "Success" } });
});

app.get('/api/payment/finish', (req, res) => {
  const orderId = req.query.orderId || '';
  res.redirect(`http://localhost:5173/confirmation?orderId=${orderId}`);
});

app.get('/api/orders', (req, res) => {
  res.json({ orders });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
