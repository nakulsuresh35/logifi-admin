import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Shield, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

const Insurance = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    // Fetch trucks sorted by insurance expiry (closest first)
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('insurance_expiry', { ascending: true, nullsFirst: true }); // Show NULL or Expiring First

    if (data) setTrucks(data);
    setLoading(false);
  };

  const updateInsurance = async (truckId, currentExpiry) => {
    // Logic: Add 1 Year to the current expiry (or today)
    const newDate = new Date(); // Default to today if null
    newDate.setFullYear(newDate.getFullYear() + 1);
    
    // Convert to YYYY-MM-DD for SQL
    const dateString = newDate.toISOString().split('T')[0];

    const { error } = await supabase
      .from('vehicles')
      .update({ insurance_expiry: dateString })
      .eq('id', truckId);

    if (!error) {
      alert("Insurance Renewed for 1 Year!");
      fetchTrucks(); // Refresh list
    } else {
      alert(error.message);
    }
  };

  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return -1; // No date set
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  if (loading) return <div>Loading Fleet Data...</div>;

  return (
    <div>
      <h1 className="page-title">Insurance Status</h1>
      <p className="subtitle">Manage annual insurance renewals for your fleet.</p>

      <div style={{ marginTop: '30px' }}>
        {trucks.map(truck => {
          const daysLeft = getDaysRemaining(truck.insurance_expiry);
          const isUrgent = daysLeft < 30; // Red alert if less than 30 days
          const isMissing = daysLeft === -1;

          return (
            <div key={truck.id} className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              
              {/* Truck Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ 
                  background: isUrgent || isMissing ? '#FEE2E2' : '#ECFDF5', 
                  padding: '15px', borderRadius: '12px' 
                }}>
                  <Shield size={24} color={isUrgent || isMissing ? '#DC2626' : '#10B981'} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{truck.plate_number}</h3>
                  <p style={{ margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' }}>
                    {isMissing ? "No Insurance Data" : `Expires: ${truck.insurance_expiry}`}
                  </p>
                </div>
              </div>

              {/* Countdown & Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                
                {/* Countdown Box */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    display: 'block', 
                    fontSize: '24px', 
                    fontWeight: '800', 
                    color: isUrgent || isMissing ? '#DC2626' : '#10B981' 
                  }}>
                    {isMissing ? "N/A" : `${daysLeft} Days`}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600' }}>REMAINING</span>
                </div>

                {/* Renew Button */}
                <button 
                  onClick={() => updateInsurance(truck.id, truck.insurance_expiry)}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Register Payment
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Insurance;