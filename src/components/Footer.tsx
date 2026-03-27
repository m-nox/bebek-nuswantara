import React from 'react';
import { Share2, Globe, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container grid grid-cols-4 gap-6" style={{ paddingBottom: 40 }}>
        <div style={{ gridColumn: 'span 2' }}>
          <h3 className="text-2xl mb-4" style={{ color: 'var(--primary)' }}>Bebek Nuswantara Beta</h3>
          <p className="text-muted" style={{ maxWidth: 400, marginBottom: 20 }}>
            Menyajikan olahan bebek dan ayam bumbu hitam khas nusantara dengan rasa yang autentik, pedas mantap, dan daging yang super empuk.
          </p>
          <div className="flex gap-4">
            <a href="#" className="btn-icon" style={{ backgroundColor: '#333', borderColor: '#444', color: 'white' }}><Share2 size={20} /></a>
            <a href="#" className="btn-icon" style={{ backgroundColor: '#333', borderColor: '#444', color: 'white' }}><Globe size={20} /></a>
            <a href="#" className="btn-icon" style={{ backgroundColor: '#333', borderColor: '#444', color: 'white' }}><MessageCircle size={20} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-xl mb-4" style={{ color: 'white' }}>Tautan Cepat</h4>
          <ul className="flex flex-col gap-2" style={{ listStyle: 'none' }}>
            <li><a href="/order" className="text-muted hover-primary">Menu</a></li>
            <li><a href="/promo" className="text-muted hover-primary">Promo</a></li>
            <li><a href="/contact" className="text-muted hover-primary">Lokasi & Kontak</a></li>
            <li><a href="#" className="text-muted hover-primary">Syarat & Ketentuan</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl mb-4" style={{ color: 'white' }}>Jam Operasional</h4>
          <ul className="flex flex-col gap-2 text-muted" style={{ listStyle: 'none' }}>
            <li>Senin - Jumat: 10:00 - 22:00</li>
            <li>Sabtu - Minggu: 09:00 - 23:00</li>
            <li>Hari Libur Nasional Buka</li>
          </ul>
        </div>
      </div>
      <div className="container text-center text-muted" style={{ borderTop: '1px solid #333', paddingTop: 20, fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} Bebek Nuswantara Beta. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
