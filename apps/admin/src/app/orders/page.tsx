import React from 'react';
import OrdersTable from './OrdersTable';
import ModerationPanel from './ModerationPanel';
import TransactionsPanel from './TransactionsPanel';

export default function OrdersPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#D4AF37' }}>Orders</h2>
      <OrdersTable />
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: '#D4AF37' }}>Photo Moderation</h3>
        <p style={{ color: '#B8B8B8' }}>Use admin API to review uploaded photos (mock)</p>
        <ModerationPanel />
      </div>
      <div style={{ marginTop: 24 }}>
        <TransactionsPanel />
      </div>
    </div>
  );
}


