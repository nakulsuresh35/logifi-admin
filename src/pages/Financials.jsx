import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Truck, ChevronRight, ArrowLeft, Download, FileText, MapPin, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';

const Financials = () => {
  const [view, setView] = useState('list'); // 'list' | 'truck' | 'trip'
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [truckTrips, setTruckTrips] = useState([]);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    const { data } = await supabase.from('vehicles').select('*');
    if (data) setTrucks(data);
  };

  const handleTruckClick = async (truck) => {
    setSelectedTruck(truck);
    // FIX: We select '*' from expenses so we get the 'type' column correctly
    const { data } = await supabase
      .from('trips')
      .select('*, expenses(*)') 
      .eq('vehicle_id', truck.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (data) {
      setTruckTrips(data);
      setView('truck');
    }
  };

  // --- NEW EXCEL LOGIC: PIVOT TABLE (One Row Per Trip) ---
  const downloadTruckReport = () => {
    if (!truckTrips.length) return alert("No trips to export!");

    // 1. Pivot the data
    const excelRows = truckTrips.map(trip => {
      // Basic Trip Info
      const row = {
        Date: new Date(trip.created_at).toLocaleDateString(),
        Route: `${trip.from_location} - ${trip.to_location}`,
        Driver: trip.driver_name || 'N/A',
        'Total Freight (Income)': trip.total_freight || 0,
      };

      // Initialize Expense Columns (so they appear even if 0)
      row['Diesel'] = 0;
      row['AdBlue'] = 0;
      row['Driver Bata'] = 0;
      row['Police/RTO'] = 0;
      row['Food'] = 0;
      row['Other'] = 0;

      let totalExpense = 0;

      // Fill Expense Columns
      if (trip.expenses) {
        trip.expenses.forEach(exp => {
          // FIX: Use 'type' from your DB schema
          const typeName = exp.type || 'Other'; 
          
          // Add to the specific column (or 'Other' if it doesn't match standard names)
          if (row.hasOwnProperty(typeName)) {
            row[typeName] += (exp.amount || 0);
          } else {
            row['Other'] += (exp.amount || 0);
          }
          
          totalExpense += exp.amount;
        });
      }

      row['Total Expenses'] = totalExpense;
      row['NET PROFIT'] = (trip.total_freight || 0) - totalExpense;

      return row;
    });

    // 2. Generate Sheet
    const ws = XLSX.utils.json_to_sheet(excelRows);
    
    // Auto-width for columns
    const wscols = Object.keys(excelRows[0]).map(() => ({ wch: 18 }));
    ws['!cols'] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Trip Register");
    XLSX.writeFile(wb, `${selectedTruck.plate_number}_Master_Report.xlsx`);
  };

  const calculateTotalExpenses = (expenses) => {
    if (!expenses) return 0;
    return expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  // --- VIEWS ---

  // 1. TRUCK LIST
  if (view === 'list') {
    return (
      <div>
        <div style={{ backgroundColor: '#10B981', padding: '30px', borderRadius: '16px', color: 'white', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Financials</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Truck-wise profit & loss</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {trucks.map(truck => (
            <div key={truck.id} className="card hover-card" onClick={() => handleTruckClick(truck)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: '#F3F4F6', padding: '12px', borderRadius: '12px' }}><Truck size={24} color="#374151"/></div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{truck.plate_number}</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#6B7280' }}>Click to view trips</p>
                </div>
              </div>
              <ChevronRight color="#9CA3AF" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. SINGLE TRUCK HISTORY
  if (view === 'truck') {
    const totalRev = truckTrips.reduce((sum, t) => sum + (t.total_freight || 0), 0);
    const totalExp = truckTrips.reduce((sum, t) => sum + calculateTotalExpenses(t.expenses), 0);
    const totalProfit = totalRev - totalExp;

    return (
      <div>
        <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#6B7280', marginBottom: '20px' }}>
          <ArrowLeft size={20} /> Back to Fleet
        </button>

        <div style={{ backgroundColor: '#10B981', padding: '30px', borderRadius: '16px', color: 'white', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '24px' }}>{selectedTruck.plate_number}</h1>
                    <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Trip History & Financials</p>
                </div>
                <button 
                  onClick={downloadTruckReport} 
                  style={{ backgroundColor: 'white', color: '#10B981', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <Download size={18} /> Download Excel Report
                </button>
            </div>
            
            <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
                <div>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: '12px' }}>TOTAL REVENUE</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>₹{totalRev.toLocaleString()}</p>
                </div>
                <div>
                    <p style={{ margin: 0, opacity: 0.8, fontSize: '12px' }}>NET PROFIT</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold' }}>₹{totalProfit.toLocaleString()}</p>
                </div>
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {truckTrips.map(trip => (
             <div key={trip.id} className="card hover-card" onClick={() => { setSelectedTrip(trip); setView('trip'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', cursor: 'pointer' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{trip.from_location} → {trip.to_location}</h4>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '13px' }}>{new Date(trip.created_at).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#10B981' }}>₹{(trip.total_freight - calculateTotalExpenses(trip.expenses)).toLocaleString()}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>NET PROFIT</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. TRIP DETAILS
  if (view === 'trip') {
    const expenses = selectedTrip.expenses || [];
    const profit = (selectedTrip.total_freight || 0) - calculateTotalExpenses(expenses);

    return (
      <div>
        <button onClick={() => setView('truck')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#6B7280', marginBottom: '20px' }}>
          <ArrowLeft size={20} /> Back to {selectedTruck.plate_number}
        </button>

        <div style={{ backgroundColor: '#1E40AF', padding: '30px', borderRadius: '16px', color: 'white', marginBottom: '20px' }}>
            <h1 style={{ margin: 0, fontSize: '20px' }}>{selectedTrip.from_location} → {selectedTrip.to_location}</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', opacity: 0.9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> {new Date(selectedTrip.created_at).toLocaleDateString()}</div>
            </div>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #E5E7EB', paddingBottom: '15px' }}>
              <span style={{ color: '#6B7280' }}>Freight (Income)</span>
              <span style={{ color: '#10B981', fontWeight: 'bold' }}>+ ₹{selectedTrip.total_freight?.toLocaleString()}</span>
           </div>
           
           {/* FIX: Using 'exp.type' from database schema */}
           {expenses.map((exp, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                  <FileText size={14} color="#6B7280"/> {exp.type || "Uncategorized"}
                </span>
                <span style={{ color: '#EF4444' }}>- ₹{exp.amount.toLocaleString()}</span>
             </div>
           ))}

           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #E5E7EB' }}>
              <span style={{ fontWeight: 'bold' }}>Net Profit</span>
              <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '18px' }}>₹{profit.toLocaleString()}</span>
           </div>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default Financials;