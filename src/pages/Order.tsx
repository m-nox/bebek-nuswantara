import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenuItemsByCategory, menuItems } from '../data/menu';
import { useCart } from '../context/CartContext';
import type { OrderData } from '../context/CartContext';
import { Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  'Signature Bebek - Paket Nasi': '🦆',
  'Bebek - Tanpa Nasi': '🍗',
  'Penyet Sambal Terasi': '🌶️',
  'Ayam - Paket Nasi': '🐔',
  'Ayam - Tanpa Nasi': '🍗',
  'Lele - Paket Nasi': '🐟',
  'Lele - Tanpa Nasi': '🐟',
  'Menu Tambahan': '🍳',
  'Snack Beta': '🍟',
  'Minuman Panas/Hot': '☕',
  'Minuman Dingin/Es': '🧊',
  'Mineral': '💧',
};

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
  const [payment, setPayment] = useState<string>('xendit');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Silakan pilih menu terlebih dahulu!');
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
        <h1 className="text-3xl mb-2">Menu Pilihan</h1>
        <p className="text-muted mb-6">Pilih menu favorit Anda, lalu isi formulir pemesanan di samping.</p>

        {Object.entries(menuByCategory).map(([category, mItems]) => (
          <div key={category} style={{ marginBottom: '40px' }}>
            <h2 className="text-2xl mb-4 flex items-center gap-2" style={{ color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: '8px' }}>
              <span>{CATEGORY_ICONS[category] || '🍽️'}</span> {category}
            </h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {mItems.map((item) => (
                <div key={item.id} className="product-card">
                  <div className="product-image">
                    {CATEGORY_ICONS[item.category] || '🍽️'}
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{item.name}</h3>
                    <p className="product-price">Rp {item.price.toLocaleString('id-ID')}</p>

                    <div className="quantity-control">
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
      <div className="card" style={{ flex: '1 1 35%', minWidth: 320, position: 'sticky', top: '80px' }}>
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
                <div key={cartItem.id} className="flex justify-between mb-2" style={{ fontSize: '0.95rem' }}>
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
              <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="service"
                  value="Dine-in"
                  checked={serviceType === 'Dine-in'}
                  onChange={() => setServiceType('Dine-in')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                Makan di Tempat
              </label>
              <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="service"
                  value="Take Away"
                  checked={serviceType === 'Take Away'}
                  onChange={() => setServiceType('Take Away')}
                  style={{ accentColor: 'var(--primary)' }}
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
          <p className="text-muted text-sm mb-4">Pembayaran diproses secara aman melalui Xendit</p>

          <label className={`payment-option ${payment === 'xendit' ? 'selected' : ''}`}>
            <input type="radio" name="payment" value="xendit" checked={payment === 'xendit'} onChange={() => setPayment('xendit')} />
            <CreditCard size={20} style={{ color: 'var(--primary)' }} />
            <div>
              <div className="font-bold" style={{ fontSize: '0.95rem' }}>Online Payment</div>
              <div className="text-muted text-sm">QRIS, Virtual Account, E-Wallet, Kartu Kredit/Debit</div>
            </div>
          </label>

          <label className="flex items-start gap-2 mb-6 text-sm text-muted" style={{ cursor: 'pointer', marginTop: 16 }}>
            <input type="checkbox" required checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 4, accentColor: 'var(--primary)' }} />
            Saya menyetujui syarat dan ketentuan pemesanan di Bebek Nuswantara.
          </label>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.15rem' }} disabled={items.length === 0 || !agreed}>
            Pesan Sekarang
          </button>
        </form>
      </div>

    </div>
  );
};

export default Order;
