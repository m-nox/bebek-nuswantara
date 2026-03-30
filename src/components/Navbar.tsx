import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, ShoppingBag, MapPin, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { getItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const count = getItemCount();

  const links = [
    { name: 'Menu & Pesan', path: '/order', icon: <Utensils size={18} /> },
    { name: 'Promo', path: '/promo', icon: <Tag size={18} /> },
    { name: 'Lokasi', path: '/contact', icon: <MapPin size={18} /> },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>🦆</span>
          Bebek Nuswantara
        </Link>

        {/* Mobile overlay */}
        <div
          className={`nav-overlay ${menuOpen ? 'open' : ''}`}
          onClick={closeMenu}
        />

        {/* Nav links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 ${location.pathname === link.path ? 'active' : ''}`}
              style={{ fontWeight: 600 }}
              onClick={closeMenu}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          <Link
            to="/order"
            className="btn btn-primary"
            style={{ padding: '8px 16px' }}
            onClick={closeMenu}
          >
            <ShoppingBag size={18} />
            <span>Pesanan {count > 0 && `(${count})`}</span>
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
