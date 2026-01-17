import React, { useEffect, useState } from 'react';
import { Calendar, Truck, TrendingUp, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

const MonthlyPnL = () => {
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [summary, setSummary] = useState({ totalPnL: 0, truckCount: 0 });
  const [truckData, setTruckData] = useState([]);

  // --- LOGIC (Same as before) ---
  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);

      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const today = now.toISOString();
      setCurrentDate(now.toLocaleString('default', { month: 'long', year: 'numeric' }));

      // 1. Fetch Trips
      const { data: trips, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .gte('created_at', firstDay)
        .lte('created_at', today);

      if (tripsError) throw tripsError;

      if (!trips || trips.length === 0) {
        setTruckData([]);
        setLoading(false);
        return;
      }

      // 2. Fetch Related Data
      const tripIds = trips.map(t => t.id);
      const vehicleIds = [...new Set(trips.map(t => t.vehicle_id))];

      const { data: expenses } = await supabase.from('expenses').select('*').in('trip_id', tripIds);
      const { data: vehicles } = await supabase.from('vehicles').select('*').in('id', vehicleIds);

      // 3. Calculate P&L
      const truckMap = {};
      let grandTotalPnL = 0;
      const findVehicle = (vId) => vehicles.find(v => v.id === vId);

      trips.forEach((trip) => {
        const vId = trip.vehicle_id;
        const vehicle = findVehicle(vId);
        
        if (!truckMap[vId]) {
          truckMap[vId] = {
            id: vId,
            plate: vehicle ? vehicle.plate_number : 'Unknown',
            revenue: 0, expenses: 0, trips: 0, profit: 0
          };
        }

        const tripRevenue = Number(trip.Total_freight || trip.total_freight || 0);
        const tripBata = Number(trip.driver_bata || 0);
        
        const tripSpecificExpenses = expenses ? expenses.filter(e => e.trip_id === trip.id) : [];
        const otherExpensesTotal = tripSpecificExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

        truckMap[vId].revenue += tripRevenue;
        truckMap[vId].expenses += (tripBata + otherExpensesTotal);
        truckMap[vId].trips += 1;
      });

      const processedList = Object.values(truckMap).map(t => {
        const profit = t.revenue - t.expenses;
        grandTotalPnL += profit;
        return { ...t, profit };
      });

      setTruckData(processedList);
      setSummary({ totalPnL: grandTotalPnL, truckCount: processedList.length });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#F3F4F6', fontFamily: 'sans-serif' }}>
      

      {/* Header Card (Emerald Green) */}
      <div style={{ backgroundColor: '#10B981', padding: '30px', borderRadius: '16px', color: 'white', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Monthly P&L</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px', opacity: 0.9, fontSize: '14px' }}>
            <Calendar size={16} />
            <span>{currentDate}</span>
        </div>
        
        <div style={{ marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px' }}>
             <p style={{ margin: 0, fontSize: '12px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Profit</p>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={28} />
                <span style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{summary.totalPnL.toLocaleString('en-IN')}</span>
             </div>
        </div>
      </div>

      {/* List of Trucks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {loading ? (
           <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              <Loader2 className="animate-spin" style={{ margin: '0 auto', display: 'block', marginBottom: 10 }} />
              Calculating financials...
           </div>
        ) : truckData.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              No trips recorded for this month.
           </div>
        ) : (
           truckData.map(truck => (
             <div 
               key={truck.id} 
               className="hover-card"
               style={{ 
                 backgroundColor: 'white', 
                 padding: '24px', 
                 borderRadius: '16px', 
                 display: 'flex', 
                 justifyContent: 'space-between', 
                 alignItems: 'center',
                 boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
               }}
             >
                {/* Left Side: Icon & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                   {/* Mint Green Background for Icon */}
                   <div style={{ background: '#ECFDF5', padding: '12px', borderRadius: '12px' }}>
                      <Truck size={24} color="#059669"/>
                   </div>
                   <div>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>{truck.plate}</h3>
                      <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
                         {truck.trips} Trips this month
                      </p>
                   </div>
                </div>

                {/* Right Side: Profit Value */}
                <div style={{ textAlign: 'right' }}>
                   <p style={{ 
                      margin: 0, 
                      fontSize: '18px', 
                      fontWeight: 'bold', 
                      color: truck.profit >= 0 ? '#10B981' : '#EF4444' 
                   }}>
                      {truck.profit >= 0 ? '+' : ''}₹{truck.profit.toLocaleString('en-IN')}
                   </p>
                   <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase' }}>
                      Net Profit
                   </p>
                </div>
             </div>
           ))
        )}

      </div>

      <style>{`
        .hover-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
      `}</style>
    </div>
  );
};

export default MonthlyPnL;