const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const orders = [];
const DANA_MERCHANT_ID = process.env.DANA_MERCHANT_ID || 'MOCK_MERCHANT_ID';

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vercel Serverless Backend is running with DANA integration!' });
});

app.post('/api/orders', (req, res) => {
  const { cartItems, orderData, totalAmount } = req.body;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const orderId = `BBR-${Math.floor(Math.random() * 900000) + 100000}`;
  const newOrder = {
    id: orderId,
    orderData,
    cartItems,
    totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);

  const danaCheckoutUrl = `https://m.dana.id/m/portal/cashier/checkout?orderId=${orderId}&amount=${totalAmount}&merchantId=${DANA_MERCHANT_ID}`;

  return res.json({ 
    success: true, 
    orderId: newOrder.id,
    paymentUrl: danaCheckoutUrl,
    message: 'DANA checkout generated via Vercel Serverless.'
  });
});

app.post('/api/payment/notify', (req, res) => {
  const notification = req.body;
  if (notification && notification.orderId) {
    const orderIndex = orders.findIndex(o => o.id === notification.orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'paid';
    }
  }
  return res.json({ resultInfo: { resultStatus: "S", resultCodeId: "00000000", resultMsg: "Success" } });
});

app.get('/api/payment/finish', (req, res) => {
  const orderId = req.query.orderId || '';
  res.redirect(`/confirmation?orderId=${orderId}`);
});

app.get('/api/orders', (req, res) => {
  res.json({ orders });
});

// For Vercel Serverless Functions
module.exports = app;
