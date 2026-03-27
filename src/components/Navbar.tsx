import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, ShoppingBag, MapPin, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { getItemCount } = useCart();
  
  const count = getItemCount();

  const links = [
    { name: 'Menu & Pesan', path: '/order', icon: <Utensils size={18} /> },
    { name: 'Promo', path: '/promo', icon: <Tag size={18} /> },
    { name: 'Lokasi', path: '/contact', icon: <MapPin size={18} /> },
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">
          <img src="/vite.svg" alt="Logo" style={{ width: 32, height: 32, filter: 'hue-rotate(150deg)' }} />
          Bebek Nuswantara <span style={{fontSize: '0.8rem', backgroundColor: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: 12, marginLeft: 4}}>BETA</span>
        </Link>
        <div className="nav-links">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`flex items-center gap-2 ${location.pathname === link.path ? 'active' : ''}`}
              style={{ fontWeight: 600 }}
            >
              {link.icon}
              <span className="hidden sm:inline">{link.name}</span>
            </Link>
          ))}
          <Link to="/order" className="btn btn-primary" style={{ padding: '8px 16px' }}>
            <ShoppingBag size={18} />
            <span>Pesanan {count > 0 && `(${count})`}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
