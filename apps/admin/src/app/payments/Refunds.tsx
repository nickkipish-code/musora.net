import React from 'react';

export default function Refunds() {
  const refund = async () => {
    const res = await fetch('/api/payments/refund', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentIntentId: 'pi_fake' }) });
    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ color: '#D4AF37' }}>Refunds</h3>
      <button onClick={refund}>Create Refund (mock)</button>
    </div>
  );
}


