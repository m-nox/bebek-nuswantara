import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, XCircle, Clock, ArrowLeft, Utensils, Calendar, MapPin, Phone, Loader2 } from 'lucide-react';

interface OrderResponse {
  id: string;
  status: string;
  totalAmount: number;
  orderData: {
    serviceType: string;
    name: string;
    phone: string;
    address?: string;
    peopleCount?: number;
    date: string;
    time: string;
  };
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  paymentMethod: string;
  createdAt: string;
}

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      navigate('/order', { replace: true });
      return;
    }

    const fetchOrder = async () => {
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      try {
        const res = await fetch(`${apiBase}/orders/${orderId}`);
        if (!res.ok) throw new Error('Order not found');
        const data = await res.json();
        setOrder(data);
        // Clear cart after successful fetch
        clearCart();
      } catch (err) {
        setError('Pesanan tidak ditemukan. Mungkin sudah expired atau belum dibuat.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: '100px 20px', minHeight: '60vh' }}>
        <Loader2 size={48} className="animate-spin mx-auto mb-4" style={{ color: 'var(--primary)' }} />
        <p className="text-muted text-lg">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container text-center" style={{ padding: '100px 20px', minHeight: '60vh' }}>
        <XCircle size={64} style={{ color: 'var(--danger)', margin: '0 auto 16px' }} />
        <h1 className="text-3xl mb-2" style={{ color: 'var(--danger)' }}>Pesanan Tidak Ditemukan</h1>
        <p className="text-muted mb-8">{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/order')}>
          <ArrowLeft size={18} /> Kembali ke Menu
        </button>
      </div>
    );
  }

  const isPaid = order.status === 'PAID' || order.status === 'SETTLED';
  const isPending = order.status === 'PENDING';
  const isFailed = order.status === 'EXPIRED' || order.status === 'FAILED';

  const getStatusIcon = () => {
    if (isPaid) return <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 16px' }} />;
    if (isPending) return <Clock size={64} className="animate-pulse" style={{ color: '#B38600', margin: '0 auto 16px' }} />;
    return <XCircle size={64} style={{ color: 'var(--danger)', margin: '0 auto 16px' }} />;
  };

  const getStatusTitle = () => {
    if (isPaid) return 'Pembayaran Berhasil!';
    if (isPending) return 'Menunggu Pembayaran';
    return 'Pembayaran Gagal';
  };

  const getStatusBadge = () => {
    if (isPaid) return <span className="status-badge status-paid">✓ Lunas</span>;
    if (isPending) return <span className="status-badge status-pending">⏳ Menunggu Pembayaran</span>;
    return <span className="status-badge status-failed">✗ Gagal / Expired</span>;
  };

  return (
    <div className="container animate-fadeIn" style={{ padding: '60px 20px', maxWidth: 700 }}>
      <div className="text-center mb-8">
        {getStatusIcon()}
        <h1 className="text-3xl mb-2" style={{ color: isPaid ? 'var(--success)' : isPending ? '#B38600' : 'var(--danger)' }}>
          {getStatusTitle()}
        </h1>
        <p className="text-muted text-lg">
          {isPaid && 'Terima kasih atas pesanan Anda di Bebek Nuswantara.'}
          {isPending && 'Silakan selesaikan pembayaran Anda. Halaman ini akan diperbarui otomatis.'}
          {isFailed && 'Pembayaran tidak berhasil. Silakan coba pesan kembali.'}
        </p>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
          <h2 className="text-xl flex items-center gap-2">
            <Utensils /> Detail Pesanan
          </h2>
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-muted text-sm" style={{ display: 'block' }}>Order ID</span>
            <span className="font-bold" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{order.id}</span>
          </div>
          <div>
            <span className="text-muted text-sm" style={{ display: 'block' }}>Nama Lengkap</span>
            <span className="font-bold">{order.orderData.name}</span>
          </div>
          <div>
            <span className="text-muted text-sm" style={{ display: 'block' }}>Layanan</span>
            <span className="font-bold">{order.orderData.serviceType}</span>
          </div>
          <div>
            <span className="text-muted text-sm" style={{ display: 'block' }}>Tanggal & Waktu</span>
            <span className="font-bold flex items-center gap-1"><Calendar size={16} /> {order.orderData.date} | {order.orderData.time}</span>
          </div>

          {order.orderData.serviceType === 'Take Away' && order.orderData.address && (
            <div style={{ gridColumn: 'span 2' }}>
              <span className="text-muted text-sm" style={{ display: 'block' }}>Alamat Pengiriman</span>
              <span className="font-bold flex gap-1"><MapPin size={16} style={{ flexShrink: 0, marginTop: 4 }} /> {order.orderData.address}</span>
            </div>
          )}

          <div style={{ gridColumn: 'span 2' }}>
            <span className="text-muted text-sm" style={{ display: 'block' }}>Nomor Kontak</span>
            <span className="font-bold flex items-center gap-1"><Phone size={16} /> {order.orderData.phone}</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--background)', borderRadius: 'var(--border-radius-sm)', padding: 16 }}>
          <h3 className="font-bold mb-4">Item Dipesan:</h3>
          {order.cartItems.map(item => (
            <div key={item.id} className="flex justify-between mb-2" style={{ paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
              <span>{item.name} x {item.quantity}</span>
              <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4 text-primary">
            <span>{isPaid ? 'Total Dibayar:' : 'Total:'}</span>
            <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center" style={{ flexWrap: 'wrap' }}>
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Kembali ke Beranda
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/order')}>
          Pesan Lagi
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
