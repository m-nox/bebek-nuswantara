import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Order from './pages/Order';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Contact from './pages/Contact';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/order" element={<Order />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/promo" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
