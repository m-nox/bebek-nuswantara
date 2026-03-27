import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, ArrowLeft, Utensils, Calendar, MapPin, Phone } from 'lucide-react';
import { menuItems } from '../data/menu';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const { orderData, items, paymentMethod, getTotal, clearCart } = useCart();

  if (!orderData || items.length === 0) {
    return <Navigate to="/order" replace />;
  }


  const handleHomeClick = () => {
    clearCart();
    navigate('/');
  };

  const handleReorderClick = () => {
    clearCart();
    navigate('/order');
  };

  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: 700 }}>
      <div className="text-center mb-8">
        <CheckCircle size={64} className="text-success mx-auto mb-4" />
        <h1 className="text-3xl mb-2 text-success">Pembayaran Berhasil!</h1>
        <p className="text-muted text-lg">Terima kasih atas pesanan Anda di Bebek Nuswantara Beta.</p>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl border-b pb-4 mb-4 flex items-center gap-2">
          <Utensils /> Detail Pesanan
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-muted block text-sm">Nama Lengkap</span>
            <span className="font-bold">{orderData.name}</span>
          </div>
          <div>
            <span className="text-muted block text-sm">Metode Pembayaran</span>
            <span className="font-bold">{paymentMethod} - Lunas</span>
          </div>
          <div>
            <span className="text-muted block text-sm">Layanan</span>
            <span className="font-bold">{orderData.serviceType}</span>
          </div>
          <div>
            <span className="text-muted block text-sm">Tanggal & Waktu</span>
            <span className="font-bold flex items-center gap-1"><Calendar size={16}/> {orderData.date} | {orderData.time}</span>
          </div>
          
          {orderData.serviceType === 'Take Away' && orderData.address && (
            <div style={{ gridColumn: 'span 2' }}>
              <span className="text-muted block text-sm">Alamat Pengiriman</span>
              <span className="font-bold flex gap-1"><MapPin size={16} className="mt-1 flex-shrink-0" /> {orderData.address}</span>
            </div>
          )}
          
          <div style={{ gridColumn: 'span 2' }}>
            <span className="text-muted block text-sm">Nomor Kontak</span>
            <span className="font-bold flex items-center gap-1"><Phone size={16}/> {orderData.phone}</span>
          </div>
        </div>

        <div className="bg-background rounded-md p-4 mt-6">
          <h3 className="font-bold mb-3">Item Dipesan:</h3>
          {items.map(cartItem => {
            const menu = menuItems.find(m => m.id === cartItem.id);
            if (!menu) return null;
            return (
              <div key={cartItem.id} className="flex justify-between mb-2 pb-2 border-b border-border">
                <span>{menu.name} x {cartItem.quantity}</span>
                <span>Rp {(menu.price * cartItem.quantity).toLocaleString('id-ID')}</span>
              </div>
            );
          })}
          <div className="flex justify-between font-bold text-lg mt-4 text-primary">
            <span>Total Dibayar:</span>
            <span>Rp {getTotal().toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button className="btn btn-outline" onClick={handleHomeClick}>
          <ArrowLeft size={18} /> Kembali ke Beranda
        </button>
        <button className="btn btn-primary" onClick={handleReorderClick}>
          Pesan Lagi
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
