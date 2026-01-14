import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Shield, CheckCircle } from 'lucide-react';

const Insurance = () => {
  const [trucks, setTrucks] = useState([]);
  const [inputs, setInputs] = useState({}); // To store "Amount Paid" input

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('vehicles').select('*').order('insurance_expiry', { ascending: true });
    if (data) setTrucks(data);
  };

  const handleRegister = async (truckId) => {
    // 1. Calculate Next Year Date
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const dateString = nextYear.toISOString().split('T')[0];

    // 2. Update Database (Only changing the date)
    const { error } = await supabase
      .from('vehicles')
      .update({ insurance_expiry: dateString })
      .eq('id', truckId);

    if (!error) {
      alert(`Success! Insurance extended to ${dateString}`);
      setInputs({ ...inputs, [truckId]: '' }); // Clear input
      fetchData(); // Refresh list
    }
  };

  const getDaysLeft = (date) => {
    if (!date) return 'N/A';
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      {/* HEADER MATCHING IMAGE 1 */}
      <div style={{ backgroundColor: '#7C3AED', padding: '30px', borderRadius: '16px', color: 'white', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Shield size={32} />
              <div>
                <h1 style={{ margin: 0, fontSize: '24px' }}>Insurance</h1>
                <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>Annual renewal tracking</p>
              </div>
          </div>
      </div>

      {trucks.map(truck => {
        const days = getDaysLeft(truck.insurance_expiry);
        const isUrgent = days < 30;

        return (
          <div key={truck.id} className="card" style={{ padding: '24px', marginBottom: '20px' }}>
             {/* Title Row */}
             <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
               <div style={{ background: '#F3F4F6', padding: '10px', borderRadius: '10px' }}><Shield size={20} color="#6B7280"/></div>
               <div>
                 <h3 style={{ margin: 0 }}>{truck.plate_number}</h3>
                 <p style={{ margin: 0, color: '#9CA3AF', fontSize: '13px' }}>ID: {truck.id.slice(0,8)}</p>
               </div>
             </div>

             {/* Status Row */}
             <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1, background: '#F9FAFB', padding: '15px', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#6B7280', fontWeight: 'bold' }}>DUE DATE</p>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{truck.insurance_expiry || "Not Set"}</p>
                </div>
                <div style={{ flex: 1, background: isUrgent ? '#FEF2F2' : '#ECFDF5', padding: '15px', borderRadius: '10px' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: isUrgent ? '#EF4444' : '#10B981', fontWeight: 'bold' }}>COUNTDOWN</p>
                  <p style={{ margin: 0, fontWeight: 'bold', color: isUrgent ? '#EF4444' : '#10B981' }}>{days} days left</p>
                </div>
             </div>

             {/* Input & Button Row */}
             <div style={{ display: 'flex', gap: '10px' }}>
               <input 
                 type="number" 
                 placeholder="Enter amount paid"
                 value={inputs[truck.id] || ''}
                 onChange={(e) => setInputs({ ...inputs, [truck.id]: e.target.value })}
                 style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }}
               />
               <button 
                 onClick={() => handleRegister(truck.id)}
                 style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: '8px', padding: '0 25px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
               >
                 <CheckCircle size={18} /> Register
               </button>
             </div>
          </div>
        );
      })}
    </div>
  );
};

export default Insurance;