import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuItemsByCategory, menuItems } from '../data/menu';
import { useCart } from '../context/CartContext';
import type { OrderData } from '../context/CartContext';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

const Order: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, setOrderData, setPaymentMethod, getTotal } = useCart();
  const menuByCategory = getMenuItemsByCategory();

  const [serviceType, setServiceType] = useState<'Dine-in' | 'Take Away'>('Dine-in');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [peopleCount, setPeopleCount] = useState<number | ''>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [payment, setPayment] = useState<string>('Midtrans');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Silakan pilih menu terlebih dahulu!');
      return;
    }
    if (!payment) {
      alert('Silakan pilih metode pembayaran.');
      return;
    }
    
    const orderData: OrderData = {
      serviceType,
      name,
      phone,
      address: serviceType === 'Take Away' ? address : undefined,
      peopleCount: serviceType === 'Dine-in' ? Number(peopleCount) : undefined,
      date,
      time
    };

    setOrderData(orderData);
    setPaymentMethod(payment);
    navigate('/payment');
  };

  const getQuantity = (id: string) => {
    return items.find(i => i.id === id)?.quantity || 0;
  };

  return (
    <div className="container" style={{ padding: '40px 20px', display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      
      {/* Menu Area */}
      <div style={{ flex: '1 1 60%', minWidth: 300 }}>
        <h1 className="text-3xl mb-6">Menu Pilihan</h1>
        
        {Object.entries(menuByCategory).map(([category, mItems]) => (
          <div key={category} style={{ marginBottom: '40px' }}>
            <h2 className="text-2xl mb-4" style={{ color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px' }}>{category}</h2>
            <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {mItems.map((item) => (
                <div key={item.id} className="product-card">
                  {/* Empty Image Placeholder */}
                  <div className="product-image"></div>
                  <div className="product-info">
                    <h3 className="product-title">{item.name}</h3>
                    <p className="product-price">Rp {item.price.toLocaleString('id-ID')}</p>
                    
                    <div className="quantity-control mt-auto">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label="Kurangi">
                        <Minus size={18} />
                      </button>
                      <span>{getQuantity(item.id)}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label="Tambah">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart & Form Area */}
      <div className="card" style={{ flex: '1 1 35%', minWidth: 320, position: 'sticky', top: '100px' }}>
        <h2 className="text-2xl mb-4 flex items-center gap-2">
          <ShoppingCart /> Ringkasan Pesanan
        </h2>
        
        {items.length === 0 ? (
          <p className="text-muted mb-6">Belum ada menu yang dipilih.</p>
        ) : (
          <div className="mb-6">
            {items.map((cartItem) => {
              const menu = menuItems.find(m => m.id === cartItem.id);
              if (!menu) return null;
              return (
                <div key={cartItem.id} className="flex justify-between mb-2">
                  <div>
                    <span className="font-bold">{menu.name}</span> x {cartItem.quantity}
                  </div>
                  <div>Rp {(menu.price * cartItem.quantity).toLocaleString('id-ID')}</div>
                </div>
              );
            })}
            <div className="flex justify-between text-xl font-bold mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <span>Subtotal:</span>
              <span className="text-primary">Rp {getTotal().toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <span className="form-label">Pilihan Layanan</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="service" 
                  value="Dine-in" 
                  checked={serviceType === 'Dine-in'} 
                  onChange={() => setServiceType('Dine-in')} 
                />
                Makan di Tempat (Dine-in)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="service" 
                  value="Take Away" 
                  checked={serviceType === 'Take Away'} 
                  onChange={() => setServiceType('Take Away')} 
                />
                Take Away
              </label>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-2">Identitas Pemesan</h3>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input required type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Masukkan nama..." />
          </div>
          <div className="form-group">
            <label className="form-label">Nomor Telepon</label>
            <input required type="tel" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08123456789" />
          </div>

          {serviceType === 'Take Away' ? (
            <div className="form-group">
              <label className="form-label">Alamat Pengiriman</label>
              <textarea required className="form-input" rows={3} value={address} onChange={e => setAddress(e.target.value)} placeholder="Alamat lengkap..."></textarea>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Jumlah Orang</label>
              <input required type="number" min="1" className="form-input" value={peopleCount} onChange={e => setPeopleCount(Number(e.target.value))} placeholder="Contoh: 4" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Tanggal</label>
              <input required type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Waktu</label>
              <input required type="time" className="form-input" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <h3 className="font-bold text-lg mt-4 mb-2">Metode Pembayaran</h3>
          <div className="form-group mb-4">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="radio" name="payment" value="Midtrans" checked={payment === 'Midtrans'} onChange={() => setPayment('Midtrans')} />
              Online Payment via Midtrans (QRIS, Virtual Account, E-Wallet)
            </label>
          </div>

          <label className="flex items-start gap-2 cursor-pointer mb-6 text-sm text-muted">
            <input type="checkbox" required checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 4 }} />
            Saya menyetujui syarat dan ketentuan pemesanan di Bebek Nuswantara Beta.
          </label>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.2rem' }} disabled={items.length === 0 || !agreed}>
            Pesan Sekarang
          </button>
        </form>
      </div>

    </div>
  );
};

export default Order;
