import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Truck, FileText, LogOut, 
  Shield, CreditCard, PieChart, TrendingUp, Lock, Mail
} from 'lucide-react';
import { supabase } from './supabaseClient';
import './App.css';

// Import pages
import Financials from './pages/Financials';
import MonthlyPnL from './pages/MonthlyPnL';
import Insurance from './pages/Insurance';
import Tax from './pages/Tax';

// --- COMPONENT: LOGIN SCREEN ---
// --- COMPONENT: LOGIN SCREEN ---
// --- COMPONENT: LOGIN SCREEN (Stunning Glass Version) ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      // Background Image with Dark Blue Overlay
      backgroundImage: `
        linear-gradient(rgba(15, 23, 42, 0.7), rgba(30, 58, 138, 0.8)),
        url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2940&auto=format&fit=crop')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 1000 
    }}>
      
      {/* 1. The Glass Container (Outer Frosted Border) */}
      <div style={{
        padding: '12px', // This creates the transparent gap
        background: 'rgba(255, 255, 255, 0.15)', // Semi-transparent white
        borderRadius: '32px',
        backdropFilter: 'blur(12px)', // The frost effect
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '420px',
        margin: '20px'
      }}>

        {/* 2. The Inner White Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '40px 32px',
          position: 'relative'
        }}>

          {/* Floating Logo (Negative Margin to pop out top) */}
          <div style={{ 
            position: 'absolute', 
            top: '-40px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.9)'
          }}>
            <Truck size={40} color="white" strokeWidth={1.5} />
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>LogiFi Admin</h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Sign in to manage your fleet</p>
          </div>

          <form onSubmit={handleLogin}>
            
            {/* Styled Email Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#3b82f6', marginBottom: '6px', marginLeft: '4px' }}>Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} color="#3b82f6" style={{ position: 'absolute', left: '14px', zIndex: 1 }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@logifi.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 42px',
                    borderRadius: '12px',
                    border: '2px solid #bfdbfe', // Light blue border
                    outline: 'none',
                    fontSize: '15px',
                    color: '#1e293b',
                    backgroundColor: '#fff',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#bfdbfe';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Styled Password Input */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#3b82f6', marginBottom: '6px', marginLeft: '4px' }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} color="#3b82f6" style={{ position: 'absolute', left: '14px', zIndex: 1 }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 42px',
                    borderRadius: '12px',
                    border: '2px solid #bfdbfe',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#1e293b',
                    backgroundColor: '#fff',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#bfdbfe';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Gradient Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(to bottom, #3b82f6, #1d4ed8)', // Gradient top to bottom
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3), 0 2px 4px -1px rgba(37, 99, 235, 0.2)',
                transition: 'transform 0.1s'
              }}
              onMouseDown={(e) => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // 1. Check Auth State on Load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Logout Function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    // Note: The onAuthStateChange hook above will automatically update 'session' to null,
    // which switches the view back to LoginScreen.
  };

  // --- SUB-COMPONENT: DASHBOARD HOME ---
  const Home = () => (
    <div>
      <div className="header">
        <h1 className="page-title">Owner Dashboard</h1>
        <p className="subtitle">Select a module to manage your fleet.</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="card hover-card" onClick={() => setActiveTab('financials')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '10px' }}><PieChart size={32} color="#2563EB" /></div>
            <h3>Financials</h3>
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>View trip lists, profit/loss per truck, and expense breakdowns.</p>
        </div>

        <div className="card hover-card" onClick={() => setActiveTab('monthly_pnl')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: '#ECFDF5', padding: '12px', borderRadius: '10px' }}><TrendingUp size={32} color="#10B981" /></div>
            <h3>Monthly P&L</h3>
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>Track monthly performance and net profit across the fleet.</p>
        </div>

        <div className="card hover-card" onClick={() => setActiveTab('insurance')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '10px' }}><Shield size={32} color="#D97706" /></div>
            <h3>Insurance Tracker</h3>
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>Monitor expiry dates and renew annual insurance policies.</p>
        </div>

        <div className="card hover-card" onClick={() => setActiveTab('tax')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: '#FEE2E2', padding: '12px', borderRadius: '10px' }}><CreditCard size={32} color="#DC2626" /></div>
            <h3>Tax Tracker</h3>
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>Manage quarterly tax payments and due date countdowns.</p>
        </div>
      </div>
    </div>
  );

  // --- RENDER LOGIC ---
  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  }

  // If NO session, show Login Screen
  if (!session) {
    return <LoginScreen />;
  }

  // If Session exists, show Dashboard
  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo" onClick={() => setActiveTab('home')} style={{cursor: 'pointer'}}>
          <Truck size={28} /> LogiFi
        </div>
        
        <nav>
          <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <LayoutDashboard size={20} /> Home
          </div>
          <div className={`nav-item ${activeTab === 'financials' ? 'active' : ''}`} onClick={() => setActiveTab('financials')}>
            <PieChart size={20} /> Financials
          </div>
          <div className={`nav-item ${activeTab === 'monthly_pnl' ? 'active' : ''}`} onClick={() => setActiveTab('monthly_pnl')}>
            <TrendingUp size={20} /> Monthly P&L
          </div>
          <div className={`nav-item ${activeTab === 'insurance' ? 'active' : ''}`} onClick={() => setActiveTab('insurance')}>
            <Shield size={20} /> Insurance
          </div>
          <div className={`nav-item ${activeTab === 'tax' ? 'active' : ''}`} onClick={() => setActiveTab('tax')}>
            <CreditCard size={20} /> Tax
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item" style={{ color: '#ef4444', cursor: 'pointer' }} onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        {activeTab === 'home' && <Home />}
        {activeTab === 'financials' && <Financials />}
        {activeTab === 'monthly_pnl' && <MonthlyPnL />}
        {activeTab === 'insurance' && <Insurance />}
        {activeTab === 'tax' && <Tax />}
      </div>
    </div>
  );
}

export default App;