import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CreditCard, AlertCircle } from 'lucide-react';

const Tax = () => {
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    fetchTaxData();
  }, []);

  const fetchTaxData = async () => {
    const { data } = await supabase.from('vehicles').select('*').order('tax_expiry', { ascending: true });
    if (data) setTrucks(data);
  };

  const payTax = async (id) => {
    // Tax is usually 3 months (Quarterly)
    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() + 3);
    const dateString = newDate.toISOString().split('T')[0];

    await supabase.from('vehicles').update({ tax_expiry: dateString }).eq('id', id);
    alert("Tax Paid for 3 Months!");
    fetchTaxData();
  };

  return (
    <div>
      <h1 className="page-title">Quarterly Tax Tracker</h1>
      <div style={{ marginTop: '20px' }}>
        {trucks.map(truck => (
          <div key={truck.id} className="card" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{truck.plate_number}</h3>
              <p style={{ color: '#666' }}>Tax Expiry: {truck.tax_expiry || "Not Set"}</p>
            </div>
            <button 
              onClick={() => payTax(truck.id)}
              style={{ background: '#DC2626', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
            >
              Pay Tax (3 Months)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tax;