import React, { useEffect, useState } from 'react';

export default function TransactionsPanel() {
  const [tx, setTx] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/transactions')
      .then((r) => r.json())
      .then(setTx)
      .catch(() => setTx([]));
  }, []);

  return (
    <div style={{ marginTop: 12 }}>
      <h3 style={{ color: '#D4AF37' }}>Transactions</h3>
      {tx.map((t) => (
        <div key={t.id} style={{ background: '#0E0E0E', padding: 12, marginBottom: 8 }}>
          <div style={{ color: '#F3F3F3' }}>{t.id}</div>
          <div style={{ color: '#B8B8B8' }}>Order: {t.orderId} — Amount: {t.amount}</div>
        </div>
      ))}
    </div>
  );
}


