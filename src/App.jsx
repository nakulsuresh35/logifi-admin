import React, { useState } from 'react';
import { 
  LayoutDashboard, Truck, FileText, LogOut, 
  Shield, CreditCard, PieChart, TrendingUp 
} from 'lucide-react';
import { supabase } from './supabaseClient';
import './App.css';

// Import the new pages (We will build these next!)
import Financials from './pages/Financials';
import MonthlyPnL from './pages/MonthlyPnL';
import Insurance from './pages/Insurance';
import Tax from './pages/Tax';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // --- COMPONENT: HOME (The 4 Options Page) ---
  const Home = () => (
    <div>
      <div className="header">
        <h1 className="page-title">Owner Dashboard</h1>
        <p className="subtitle">Select a module to manage your fleet.</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Option 1: Financials */}
        <div className="card hover-card" onClick={() => setActiveTab('financials')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '10px' }}>
              <PieChart size={32} color="#2563EB" />
            </div>
            <h3>Financials</h3>
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>
            View trip lists, profit/loss per truck, and expense breakdowns.
          </p>
        </div>

        {/* Option 2: Monthly P&L */}
        <div className="card hover-card" onClick={() => setActiveTab('monthly_pnl')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: '#ECFDF5', padding: '12px', borderRadius: '10px' }}>
              <TrendingUp size={32} color="#10B981" />
            </div>
            <h3>Monthly P&L</h3>
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Track monthly performance and net profit across the fleet.
          </p>
        </div>

        {/* Option 3: Insurance */}
        <div className="card hover-card" onClick={() => setActiveTab('insurance')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: '#FEF3C7', padding: '12px', borderRadius: '10px' }}>
              <Shield size={32} color="#D97706" />
            </div>
            <h3>Insurance Tracker</h3>
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Monitor expiry dates and renew annual insurance policies.
          </p>
        </div>

        {/* Option 4: Tax */}
        <div className="card hover-card" onClick={() => setActiveTab('tax')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ background: '#FEE2E2', padding: '12px', borderRadius: '10px' }}>
              <CreditCard size={32} color="#DC2626" />
            </div>
            <h3>Tax Tracker</h3>
          </div>
          <p style={{ color: '#6B7280', margin: 0 }}>
            Manage quarterly tax payments and due date countdowns.
          </p>
        </div>

      </div>
    </div>
  );

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
          <div className="nav-item" style={{ color: '#ef4444', cursor: 'pointer' }} onClick={() => window.location.reload()}>
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