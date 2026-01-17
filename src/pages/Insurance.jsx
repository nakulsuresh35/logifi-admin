import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Shield, Clock, Calendar, CheckCircle, ArrowLeft, Loader2, Save } from 'lucide-react';

const Insurance = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renewalLoading, setRenewalLoading] = useState(null); // Tracks which ID is updating
  const [amounts, setAmounts] = useState({}); // Stores input values per vehicle

  // --- 1. FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('insurance_expiry', { ascending: true }); // Expiring soonest first

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLE RENEWAL ---
  // --- 2. HANDLE RENEWAL ---
  const handleRegister = async (vehicle) => {
    const amount = amounts[vehicle.id];

    if (!amount) return alert("Please enter the amount paid.");
    if (!confirm(`Confirm renewal for ${vehicle.plate_number}? This will extend insurance by 1 year.`)) return;

    try {
      setRenewalLoading(vehicle.id);

      // A. Calculate New Date (Add 1 Year)
      const currentExpiry = new Date(vehicle.insurance_expiry);
      const newExpiry = new Date(currentExpiry.setFullYear(currentExpiry.getFullYear() + 1));
      const newExpiryString = newExpiry.toISOString().split('T')[0];

      // B. Update Vehicle Table
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ insurance_expiry: newExpiryString })
        .eq('id', vehicle.id);

      if (updateError) throw updateError;

      // C. Log to Compliance Table (History)
      // FIX: Changed type from 'insurance' to 'Insurance' (Capitalized)
      const { error: logError } = await supabase
        .from('compliance_logs')
        .insert([{
          vehicle_id: vehicle.id,
          type: 'Insurance', 
          amount_paid: parseFloat(amount),
          payment_date: new Date().toISOString(),
          new_expiry_date: newExpiryString
        }]);

      if (logError) throw logError;

      // D. Cleanup
      alert("Renewal Success! Expiry updated.");
      setAmounts({ ...amounts, [vehicle.id]: '' }); // Clear input
      fetchData(); // Refresh list

    } catch (error) {
      console.error(error);
      alert("Error updating: " + error.message);
    } finally {
      setRenewalLoading(null);
    }
  };
  // --- 3. HELPER: COUNTDOWN CALCULATION ---
  const getCountdown = (dateStr) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Status Logic
    if (days < 0) return { label: `${Math.abs(days)} days overdue`, color: '#EF4444', bg: '#FEE2E2' }; // Red
    if (days <= 30) return { label: `${days} days left`, color: '#F59E0B', bg: '#FEF3C7' }; // Yellow
    return { label: `${days} days left`, color: '#10B981', bg: '#D1FAE5' }; // Green
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#F3F4F6', fontFamily: 'sans-serif' }}>
      

      {/* --- HEADER CARD (BLUE) --- */}
      <div style={{ 
        backgroundColor: '#ef7809', // Royal Blue
        padding: '30px', 
        borderRadius: '16px', 
        color: 'white', 
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
      }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
            <Shield size={32} color="white" />
        </div>
        <div>
            <h1 style={{ margin: 0, fontSize: '26px' }}>Insurance</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Annual renewal tracking</p>
        </div>
      </div>

      {/* --- LIST AREA --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {loading ? (
           <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              <Loader2 className="animate-spin" style={{ margin: '0 auto', display: 'block', marginBottom: 10 }} />
              Loading policies...
           </div>
        ) : (
          vehicles.map((vehicle) => {
            const status = getCountdown(vehicle.insurance_expiry);
            
            return (
              <div key={vehicle.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                
                {/* 1. Vehicle Identity Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', background: '#F3F4F6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={24} color="#d86e11" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#111827', fontWeight: '700' }}>
                            {vehicle.plate_number}
                        </h3>
                        <p style={{ margin: '2px 0 0 0', color: '#9CA3AF', fontSize: '13px', fontFamily: 'monospace' }}>
                            ID: {vehicle.id.slice(0, 8)}...
                        </p>
                    </div>
                </div>

                {/* 2. Info Grid (Due Date + Countdown) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
                    
                    {/* Due Date Box */}
                    <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '11px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Due Date
                        </p>
                        <p style={{ margin: '6px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>
                            {vehicle.insurance_expiry}
                        </p>
                    </div>

                    {/* Countdown Box */}
                    <div style={{ backgroundColor: status.bg, padding: '16px', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '11px', color: '#374151', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>
                            Countdown
                        </p>
                        <p style={{ margin: '6px 0 0 0', fontSize: '16px', fontWeight: '700', color: status.color }}>
                            {status.label}
                        </p>
                    </div>
                </div>

                {/* 3. Action Row (Input + Button) */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                        type="number"
                        placeholder="Enter amount paid"
                        value={amounts[vehicle.id] || ''}
                        onChange={(e) => setAmounts({ ...amounts, [vehicle.id]: e.target.value })}
                        style={{ 
                            flex: 1, 
                            backgroundColor: '#F9FAFB', 
                            color: 'white', 
                            border: 'none', 
                            padding: '14px 20px', 
                            borderRadius: '8px',
                            outline: 'none',
                            fontSize: '14px'
                        }}
                    />
                    
                    <button 
                        onClick={() => handleRegister(vehicle)}
                        disabled={renewalLoading === vehicle.id}
                        style={{ 
                            backgroundColor: '#ef7809', // Using a slight purple/blue accent for button like screenshot
                            backgroundImage: 'linear-gradient(to right, #ef7809, #ef5d09)', 
                            color: 'white', 
                            border: 'none', 
                            padding: '14px 24px', 
                            borderRadius: '8px', 
                            fontWeight: '600', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            opacity: renewalLoading === vehicle.id ? 0.7 : 1
                        }}
                    >
                        {renewalLoading === vehicle.id ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <>
                                <Save size={18} /> Register
                            </>
                        )}
                    </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Insurance;