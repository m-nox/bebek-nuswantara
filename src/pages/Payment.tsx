import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, Loader2 } from 'lucide-react';

const Payment: React.FC = () => {
  const { items, orderData, paymentMethod, getTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // If accessed directly without an order, kick back to order
  if (!orderData || !paymentMethod) {
    return <Navigate to="/order" replace />;
  }

  const total = getTotal();

  const handlePayment = async () => {
    setIsProcessing(true);
    const apiBase = import.meta.env.VITE_API_URL || '/api';
    try {
      const response = await fetch(`${apiBase}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: items,
          orderData,
          totalAmount: total,
          paymentMethod
        }),
      });
      const data = await response.json();
      if (data.success && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert('Gagal membuat pesanan. Silakan coba lagi.');
        setIsProcessing(false);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat memproses pesanan. Periksa koneksi Anda.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 600, minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 className="text-3xl mb-2 text-center">Selesaikan Pembayaran</h1>
      <p className="text-muted text-center mb-8">Silakan selesaikan pembayaran untuk mengonfirmasi pesanan Anda.</p>
      
      <div className="card w-full mb-6 text-center" style={{ width: '100%' }}>
        <h2 className="text-xl mb-4">Total Tagihan</h2>
        <div className="text-4xl font-bold text-primary mb-2">Rp {total.toLocaleString('id-ID')}</div>
        
        <div style={{ borderTop: '1px solid var(--border)', margin: '20px 0' }}></div>

        <div className="text-xl font-bold mb-4">
          Online Payment secure by DANA 🛡️
        </div>
        <p className="text-muted text-sm mb-4">
          Anda akan diarahkan ke halaman pembayaran DANA untuk menyelesaikan transaksi Anda.
        </p>
      </div>

      <button 
        className="btn btn-primary" 
        onClick={handlePayment} 
        disabled={isProcessing}
        style={{ width: '100%', padding: 16, fontSize: '1.2rem' }}
      >
        {isProcessing ? (
          <><Loader2 className="animate-spin" /> Memproses Pembayaran...</>
        ) : (
          <><CheckCircle /> Bayar via DANA</>
        )}
      </button>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Payment;
