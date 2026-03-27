import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div className="text-center mb-12">
        <h1 className="text-4xl mb-4">Lokasi & Kontak</h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Kunjungi kedai kami untuk menikmati sajian Bebek Nuswantara Beta secara langsung, atau hubungi kami untuk layanan pelanggan.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Contact Info */}
        <div className="card flex flex-col gap-6">
          <h2 className="text-2xl mb-2">Informasi Restoran</h2>
          
          <div className="flex gap-4 items-start">
            <div className="btn-icon" style={{ backgroundColor: 'rgba(255, 90, 0, 0.1)', color: 'var(--primary)', border: 'none' }}>
              <MapPin />
            </div>
            <div>
              <h3 className="font-bold mb-1">Alamat</h3>
              <p className="text-muted">Jl. Jenderal Sudirman No. 45, Senayan<br/>Jakarta Selatan, 12190<br/>DKI Jakarta, Indonesia</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="btn-icon" style={{ backgroundColor: 'rgba(255, 90, 0, 0.1)', color: 'var(--primary)', border: 'none' }}>
              <Clock />
            </div>
            <div>
              <h3 className="font-bold mb-1">Jam Operasional</h3>
              <p className="text-muted">Senin - Jumat: 10:00 - 22:00<br/>Sabtu - Minggu: 09:00 - 23:00</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="btn-icon" style={{ backgroundColor: 'rgba(255, 90, 0, 0.1)', color: 'var(--primary)', border: 'none' }}>
              <Phone />
            </div>
            <div>
              <h3 className="font-bold mb-1">Telepon & WhatsApp</h3>
              <p className="text-muted">+62 812 3456 7890<br/>+62 21 555 1234</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="btn-icon" style={{ backgroundColor: 'rgba(255, 90, 0, 0.1)', color: 'var(--primary)', border: 'none' }}>
              <Mail />
            </div>
            <div>
              <h3 className="font-bold mb-1">Email</h3>
              <p className="text-muted">halo@bebeknuswantara.id</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: 400 }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273030230282!2d106.80401831476906!3d-6.227681695491879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14eb34b5c77%3A0xe53bc3101ff61a99!2sSudirman%20Central%20Business%20District%20(SCBD)!5e0!3m2!1sen!2sid!4v1680182434522!5m2!1sen!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0, minHeight: 400 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>

      </div>
    </div>
  );
};

export default Contact;
