import { useState, useEffect } from 'react'
import { LayoutDashboard, Truck, FileText, LogOut, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({ 
    totalRevenue: 0, 
    activeTrucks: 0, 
    totalTrips: 0 
  })

  // FETCH DATA FROM SUPABASE
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    // 1. Get Completed Trips for Revenue
    const { data: trips } = await supabase
      .from('trips')
      .select('total_freight, status')
    
    // 2. Calculate Totals
    let revenue = 0
    let active = 0
    
    if (trips) {
      trips.forEach(trip => {
        if (trip.total_freight) revenue += trip.total_freight
        if (trip.status === 'active') active += 1
      })
    }

    setStats({
      totalRevenue: revenue,
      activeTrucks: active,
      totalTrips: trips?.length || 0
    })
  }

  // --- COMPONENT: DASHBOARD ---
  const Dashboard = () => (
    <div>
      <div className="header">
        <h1 className="page-title">Fleet Overview</h1>
        <p className="subtitle">Real-time metrics from your logistics network.</p>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-label">Total Revenue</span>
            <DollarSign color="#16a34a" />
          </div>
          <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-label">Active Trucks</span>
            <Activity color="#3b82f6" />
          </div>
          <div className="stat-value">{stats.activeTrucks}</div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="stat-label">Total Trips</span>
            <TrendingUp color="#f59e0b" />
          </div>
          <div className="stat-value">{stats.totalTrips}</div>
        </div>
      </div>
      
      <div className="card">
        <h3>🚀 Coming Soon: Profit/Loss Graph</h3>
        <p style={{color: '#6b7280'}}>We will add the Recharts graph here next.</p>
      </div>
    </div>
  )

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">
          <Truck size={28} /> LogiFi
        </div>
        
        <nav>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'trucks' ? 'active' : ''}`} onClick={() => setActiveTab('trucks')}>
            <Truck size={20} /> Live Map
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item" style={{ color: '#ef4444' }}>
            <LogOut size={20} /> Logout
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'trucks' && <h1>Live Map Coming Soon...</h1>}
      </div>
    </div>
  )
}

export default App