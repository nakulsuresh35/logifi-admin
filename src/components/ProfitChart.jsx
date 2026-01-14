import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProfitChart = ({ data }) => {
  // If no data, show a friendly message
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        <p>No trip data available yet to show trends.</p>
      </div>
    );
  }

  return (
    <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Daily Revenue Trend</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{fontSize: 12}} 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis 
            tick={{fontSize: 12}} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(value) => '₹${value}'} // Add Rupee symbol
          />
          <Tooltip 
            cursor={{fill: '#f3f4f6'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Bar 
            dataKey="amount" 
            fill="#1e3a8a" // Your Navy Blue Brand Color
            radius={[4, 4, 0, 0]} // Rounded top corners
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitChart;