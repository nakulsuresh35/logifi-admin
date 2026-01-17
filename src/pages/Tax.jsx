import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { CreditCard, ArrowLeft, Loader2, Save, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const Tax = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renewalLoading, setRenewalLoading] = useState(null);
  const [amounts, setAmounts] = useState({});

  // --- 1. FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch vehicles sorted by tax_expiry (soonest first)
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('tax_expiry', { ascending: true });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching tax data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HANDLE RENEWAL (Adds 3 Months) ---
  const handleRegister = async (vehicle) => {
    const amount = amounts[vehicle.id];

    if (!amount) return alert("Please enter the amount paid.");
    // CONFIRMATION DIALOG
    if (!confirm(`Confirm Tax payment for ${vehicle.plate_number}? This will extend the validity by 3 Months (Quarterly).`)) return;

    try {
      setRenewalLoading(vehicle.id);

      // A. Calculate New Date (Add 3 Months)
      const currentExpiry = new Date(vehicle.tax_expiry);
      // Change +3 to +12 if you pay tax Annually
      const newExpiry = new Date(currentExpiry.setMonth(currentExpiry.getMonth() + 3)); 
      const newExpiryString = newExpiry.toISOString().split('T')[0];

      // B. Update Vehicle Table
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ tax_expiry: newExpiryString })
        .eq('id', vehicle.id);

      if (updateError) throw updateError;

      // C. Log to Compliance Table
      // Type is 'Tax' (Capitalized)
      const { error: logError } = await supabase
        .from('compliance_logs')
        .insert([{
          vehicle_id: vehicle.id,
          type: 'Tax', 
          amount_paid: parseFloat(amount),
          payment_date: new Date().toISOString(),
          new_expiry_date: newExpiryString
        }]);

      if (logError) throw logError;

      // D. Cleanup
      alert("Tax Updated Successfully!");
      setAmounts({ ...amounts, [vehicle.id]: '' });
      fetchData();

    } catch (error) {
      alert("Error updating: " + error.message);
    } finally {
      setRenewalLoading(null);
    }
  };

  // --- 3. HELPER: COUNTDOWN ---
  const getCountdown = (dateStr) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Status Colors
    if (days < 0) return { label: `${Math.abs(days)} days overdue`, color: '#DC2626', bg: '#FEE2E2' }; // Deep Red
    if (days <= 15) return { label: `${days} days left`, color: '#D97706', bg: '#FEF3C7' }; // Amber
    return { label: `${days} days left`, color: '#059669', bg: '#D1FAE5' }; // Green
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#F3F4F6', fontFamily: 'sans-serif' }}>
      
      

      {/* --- HEADER CARD (CRIMSON RED) --- */}
      <div style={{ 
        backgroundColor: '#DC2626', // Crimson Red
        padding: '30px', 
        borderRadius: '16px', 
        color: 'white', 
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.3)'
      }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
            <CreditCard size={32} color="white" />
        </div>
        <div>
            <h1 style={{ margin: 0, fontSize: '26px' }}>Tax Tracker</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Quarterly tax payments</p>
        </div>
      </div>

      {/* --- LIST AREA --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {loading ? (
           <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              <Loader2 className="animate-spin" style={{ margin: '0 auto', display: 'block', marginBottom: 10 }} />
              Loading tax records...
           </div>
        ) : vehicles.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>No vehicles found.</div>
        ) : (
          vehicles.map((vehicle) => {
            const status = getCountdown(vehicle.tax_expiry);
            
            return (
              <div key={vehicle.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                
                {/* 1. Vehicle Identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
                    {/* Pale Red BG with Red Icon */}
                    <div style={{ width: '48px', height: '48px', background: '#FEF2F2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={24} color="#DC2626" />
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

                {/* 2. Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '24px' }}>
                    
                    {/* Due Date */}
                    <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '11px', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Tax Due Date
                        </p>
                        <p style={{ margin: '6px 0 0 0', fontSize: '16px', fontWeight: '600', color: '#1F2937' }}>
                            {vehicle.tax_expiry || 'Not Set'}
                        </p>
                    </div>

                    {/* Countdown */}
                    <div style={{ backgroundColor: status.bg, padding: '16px', borderRadius: '12px' }}>
                        <p style={{ margin: 0, fontSize: '11px', color: '#374151', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>
                            Countdown
                        </p>
                        <p style={{ margin: '6px 0 0 0', fontSize: '16px', fontWeight: '700', color: status.color }}>
                            {status.label}
                        </p>
                    </div>
                </div>

                {/* 3. Action Row */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                        type="number"
                        placeholder="Amount paid"
                        value={amounts[vehicle.id] || ''}
                        onChange={(e) => setAmounts({ ...amounts, [vehicle.id]: e.target.value })}
                        style={{ 
                            flex: 1, 
                            backgroundColor: '#F9FAFB', 
                            color: '#1F2937', // FIX: Dark text
                            border: '1px solid #E5E7EB',
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
                            backgroundColor: '#DC2626', 
                            backgroundImage: 'linear-gradient(to right, #DC2626, #B91C1C)', // Red Gradient
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

export default Tax;