import React, { useEffect, useState } from 'react';

export default function ModerationPanel() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  return (
    <div style={{ marginTop: 12 }}>
      {orders.map((o) => (
        <div key={o.id} style={{ background: '#0E0E0E', padding: 12, marginBottom: 8 }}>
          <div style={{ color: '#F3F3F3' }}>{o.id}</div>
          {(o.photos || []).map((p: string) => (
            <div key={p} style={{ marginTop: 8 }}>
              <img src={p} alt="photo" style={{ maxWidth: 240 }} />
              <div>
                <button onClick={() => alert('approve ' + p)}>Approve</button>
                <button onClick={() => alert('reject ' + p)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}


