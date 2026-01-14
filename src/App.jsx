import React, { useState, useEffect } from 'react';

// 1. Safe Imports (Prevents "export not found" crashes)
import { LayoutDashboard } from 'lucide-react';
import { Truck } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { Activity } from 'lucide-react';

import { supabase } from './supabaseClient';
import ProfitChart from './components/ProfitChart'; // Ensure you created this file!
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for Cards
  const [stats, setStats] = useState({ 
    totalRevenue: 0, 
    activeTrucks: 0, 
    totalTrips: 0 
  });

  // State for Graph
  const [chartData, setChartData] = useState([]);

  // FETCH DATA FROM SUPABASE
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // 1. Get Trips (Select created_at for the graph)
    const { data: trips } = await supabase
      .from('trips')
      .select('created_at, total_freight, status')
      .order('created_at', { ascending: true }); // Order by date for the graph
    
    let revenue = 0;
    let active = 0;
    const dailyMap = {}; // Helper object to group money by date

    if (trips) {
      trips.forEach(trip => {
        // --- CALCULATION FOR CARDS ---
        if (trip.total_freight) revenue += trip.total_freight;
        if (trip.status === 'active') active += 1;

        // --- CALCULATION FOR GRAPH ---
        // Only graph trips that have revenue (finished trips)
        if (trip.created_at && trip.total_freight > 0) {
          // Format date like "12 Jan"
          const date = new Date(trip.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
          
          // Add to existing total or start new
          if (dailyMap[date]) {
            dailyMap[date] += trip.total_freight;
          } else {
            dailyMap[date] = trip.total_freight;
          }
        }
      });
    }

    // Convert Map to Array for Recharts: [{ date: "12 Jan", amount: 5000 }]
    const graphData = Object.keys(dailyMap).map(date => ({
      date,
      amount: dailyMap[date]
    }));

    setStats({
      totalRevenue: revenue,
      activeTrucks: active,
      totalTrips: trips?.length || 0
    });
    
    setChartData(graphData);
  };

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
      
      {/* PROFIT GRAPH (Now Connected!) */}
      <div className="card">
         <ProfitChart data={chartData} />
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">
          <Truck size={28} /> LogiFi
        </div>
        
        <nav>
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} /> Dashboard
          </div>
          
          <div 
            className={`nav-item ${activeTab === 'trucks' ? 'active' : ''}`} 
            onClick={() => setActiveTab('trucks')}
          >
            <Truck size={20} /> Live Map
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item" style={{ color: '#ef4444', cursor: 'pointer' }} onClick={() => window.location.reload()}>
            <LogOut size={20} /> Refresh Data
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'trucks' && (
          <div className="card">
            <h1>📍 Live Map</h1>
            <p>Coming up in the next phase...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;