import React from 'react';

const MonthlyPnL = () => {
  return (
    <div>
      <h1 className="page-title">Monthly Profit & Loss</h1>
      <div className="card" style={{ marginTop: '20px', textAlign: 'center', padding: '50px' }}>
        <h3>📊 Detailed Report Generation</h3>
        <p>Select a month to download the PDF report.</p>
        <button style={{ marginTop: '20px', padding: '10px 20px' }}>Download Current Month</button>
      </div>
    </div>
  );
};

export default MonthlyPnL;