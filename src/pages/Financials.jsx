import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6']; // Green(Profit), Red(Fuel), Orange(Food), Blue(Others)

const Financials = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    calculateFinancials();
  }, []);

  const calculateFinancials = async () => {
    // 1. Fetch all trips with their expenses
    const { data: trips } = await supabase
      .from('trips')
      .select(`
        total_freight,
        expenses (amount, expense_type)
      `);

    if (!trips) return;

    let totalRevenue = 0;
    let totalFuel = 0;
    let totalFood = 0;
    let totalOther = 0;

    trips.forEach(trip => {
      totalRevenue += trip.total_freight || 0;
      
      if (trip.expenses) {
        trip.expenses.forEach(exp => {
          if (exp.expense_type === 'Fuel' || exp.expense_type === 'Diesel') totalFuel += exp.amount;
          else if (exp.expense_type === 'Food') totalFood += exp.amount;
          else totalOther += exp.amount;
        });
      }
    });

    const totalExpenses = totalFuel + totalFood + totalOther;
    const netProfit = totalRevenue - totalExpenses;

    // Prepare Data for Pie Chart
    setData([
      { name: 'Net Profit', value: netProfit > 0 ? netProfit : 0 },
      { name: 'Fuel', value: totalFuel },
      { name: 'Food', value: totalFood },
      { name: 'Other Exp', value: totalOther },
    ]);
  };

  return (
    <div>
      <h1 className="page-title">Financial Breakdown</h1>
      <p className="subtitle">Where is the money going?</p>

      <div className="card" style={{ height: '400px', marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3>Revenue vs. Expenses</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Financials;