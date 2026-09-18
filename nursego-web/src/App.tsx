import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Shield, Clock, Heart, ArrowRight } from 'lucide-react';
import './index.css';

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '4rem' }}>
        <div className="animate-fade-up" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1>Premium Nursing Care<br/>At Your Doorstep</h1>
          <p style={{ margin: '0 auto 2.5rem' }}>
            Experience world-class healthcare from the comfort of your home. 
            Our certified professionals are ready to provide compassionate, expert care 24/7.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary">
              Book a Nurse <ArrowRight size={20} />
            </button>
            <button className="btn btn-outline">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>Why Choose NurseGo?</h2>
          <p style={{ margin: '0 auto' }}>We combine medical excellence with unprecedented convenience to transform how you receive healthcare.</p>
        </div>

        <div className="grid grid-cols-3">
          <div className="glass-card animate-fade-up delay-100">
            <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }}>
              <Shield size={48} />
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Certified Professionals</h3>
            <p style={{ fontSize: '1rem' }}>Every nurse undergoes rigorous background checks and clinical verification to ensure highest quality care.</p>
          </div>
          
          <div className="glass-card animate-fade-up delay-200">
            <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>
              <Heart size={48} />
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Compassionate Care</h3>
            <p style={{ fontSize: '1rem' }}>Beyond clinical excellence, our caregivers are selected for their empathy and dedication to patient well-being.</p>
          </div>

          <div className="glass-card animate-fade-up delay-300">
            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
              <Clock size={48} />
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>24/7 Availability</h3>
            <p style={{ fontSize: '1rem' }}>Healthcare needs don't follow a schedule. Our professionals are available round-the-clock for emergencies.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '3rem 2rem', marginTop: '4rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h3 style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NurseGo</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: 0 }}>Elevating Healthcare Standards</p>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</Link>
            <Link to="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Services</Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', backdropFilter: 'var(--glass-blur)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15, 23, 42, 0.8)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NurseGo</h2>
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
            <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>About</Link>
            <Link to="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Services</Link>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Patient Portal</button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<div className="container" style={{paddingTop:'4rem'}}><h1>About Us</h1><p>Coming Soon...</p></div>} />
        <Route path="/services" element={<div className="container" style={{paddingTop:'4rem'}}><h1>Our Services</h1><p>Coming Soon...</p></div>} />
        <Route path="/contact" element={<div className="container" style={{paddingTop:'4rem'}}><h1>Contact</h1><p>Coming Soon...</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;
