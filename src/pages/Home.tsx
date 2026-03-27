import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section 
        className="hero" 
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") center/cover',
          color: 'white',
          padding: '120px 20px',
          textAlign: 'center',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: 800, animation: 'fadeIn 1s ease-out' }}>
          <div style={{ display: 'inline-block', backgroundColor: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: 20, fontWeight: 'bold', marginBottom: 24, fontSize: '0.9rem', letterSpacing: 1 }}>
            RESTO PILIHAN KELUARGA
          </div>
          <h1 className="text-4xl" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.1, marginBottom: 24 }}>
            Selamat Datang di <br/>
            <span style={{ color: 'var(--primary)' }}>Bebek Nuswantara Beta</span>
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Nikmati sensasi daging bebek super empuk berpadu dengan bumbu hitam legendaris khas nusantara yang pedasnya nendang banget!
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/order" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: 30 }}>
              Mulai Pemesanan <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: 30, color: 'white', borderColor: 'white' }}>
              Lihat Lokasi
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding container">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="card flex-col items-center">
            <div className="btn-icon" style={{ width: 64, height: 64, margin: '0 auto 16px', backgroundColor: 'rgba(255, 90, 0, 0.1)', color: 'var(--primary)', border: 'none' }}>
              <Star size={32} />
            </div>
            <h3 className="text-xl mb-2">Rasa Autentik</h3>
            <p className="text-muted">Bumbu rempah rahasia warisan nusantara yang meresap hingga ke tulang.</p>
          </div>
          <div className="card flex-col items-center">
            <div className="btn-icon" style={{ width: 64, height: 64, margin: '0 auto 16px', backgroundColor: 'rgba(255, 90, 0, 0.1)', color: 'var(--primary)', border: 'none' }}>
              <Clock size={32} />
            </div>
            <h3 className="text-xl mb-2">Siap Saji Cepat</h3>
            <p className="text-muted">Pelayanan ekstra cepat baik untuk dine-in maupun take-away.</p>
          </div>
          <div className="card flex-col items-center">
            <div className="btn-icon" style={{ width: 64, height: 64, margin: '0 auto 16px', backgroundColor: 'rgba(255, 90, 0, 0.1)', color: 'var(--primary)', border: 'none' }}>
              <MapPin size={32} />
            </div>
            <h3 className="text-xl mb-2">Lokasi Strategis</h3>
            <p className="text-muted">Parkiran luas dan tempat nyaman untuk berkumpul bersama keluarga.</p>
          </div>
        </div>
      </section>

      {/* Banner Order Now */}
      <section className="section-padding" style={{ backgroundColor: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 className="text-3xl mb-4">Lapar? Jangan Ditahan!</h2>
          <p className="text-xl mb-6" style={{ opacity: 0.9 }}>
            Pesan sekarang tanpa perlu antri panjang. Tersedia pilihan Dine-in dan Take Away.
          </p>
          <Link to="/order" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '16px 40px', fontSize: '1.2rem', borderRadius: 30, fontWeight: 'bold' }}>
            Pesan via Website
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
