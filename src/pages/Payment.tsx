import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { menuItems } from '../data/menu';
import { Shield, Loader2, CreditCard } from 'lucide-react';

const Payment: React.FC = () => {
  const { items, orderData, paymentMethod, getTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If accessed directly without an order, redirect to order page
  if (!orderData || !paymentMethod || items.length === 0) {
    return <Navigate to="/order" replace />;
  }

  const total = getTotal();

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    const apiBase = import.meta.env.VITE_API_URL || '/api';

    try {
      // Build cart items with names and prices for the backend
      const cartItemsWithDetails = items.map(item => {
        const menuItem = menuItems.find(m => m.id === item.id);
        return {
          id: item.id,
          name: menuItem?.name || item.id,
          price: menuItem?.price || 0,
          quantity: item.quantity,
        };
      });

      const response = await fetch(`${apiBase}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: cartItemsWithDetails,
          orderData,
          totalAmount: total,
          paymentMethod
        }),
      });

      const data = await response.json();

      if (data.success && data.invoiceUrl) {
        // Redirect to Xendit checkout page
        window.location.href = data.invoiceUrl;
      } else {
        setError(data.error || 'Gagal membuat invoice pembayaran. Silakan coba lagi.');
        setIsProcessing(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memproses pesanan. Periksa koneksi Anda.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 600, minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="animate-fadeIn" style={{ width: '100%' }}>
        <h1 className="text-3xl mb-2 text-center">Selesaikan Pembayaran</h1>
        <p className="text-muted text-center mb-8">Silakan selesaikan pembayaran untuk mengonfirmasi pesanan Anda.</p>

        <div className="card mb-6" style={{ width: '100%' }}>
          {/* Order summary */}
          <h3 className="font-bold mb-4">Detail Pesanan</h3>
          {items.map((cartItem) => {
            const menu = menuItems.find(m => m.id === cartItem.id);
            if (!menu) return null;
            return (
              <div key={cartItem.id} className="flex justify-between mb-2" style={{ fontSize: '0.95rem', paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                <span>{menu.name} x {cartItem.quantity}</span>
                <span>Rp {(menu.price * cartItem.quantity).toLocaleString('id-ID')}</span>
              </div>
            );
          })}

          <div className="flex justify-between text-xl font-bold mt-4 pt-4" style={{ borderTop: '2px solid var(--border)' }}>
            <span>Total Tagihan</span>
            <span className="text-primary">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="card mb-6 text-center" style={{ width: '100%' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield size={20} style={{ color: 'var(--success)' }} />
            <span className="font-bold">Pembayaran Aman via Xendit</span>
          </div>
          <p className="text-muted text-sm">
            Anda akan diarahkan ke halaman pembayaran Xendit untuk menyelesaikan transaksi. Tersedia pembayaran via QRIS, Virtual Account, E-Wallet, dan Kartu Kredit/Debit.
          </p>
        </div>

        {error && (
          <div className="card mb-6" style={{ width: '100%', backgroundColor: 'rgba(220, 53, 69, 0.08)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handlePayment}
          disabled={isProcessing}
          style={{ width: '100%', padding: 16, fontSize: '1.15rem' }}
        >
          {isProcessing ? (
            <><Loader2 className="animate-spin" /> Memproses Pembayaran...</>
          ) : (
            <><CreditCard /> Bayar Sekarang</>
          )}
        </button>

        <p className="text-center text-muted text-sm" style={{ marginTop: 16 }}>
          🔒 Transaksi dilindungi enkripsi SSL 256-bit
        </p>
      </div>
    </div>
  );
};

export default Payment;
