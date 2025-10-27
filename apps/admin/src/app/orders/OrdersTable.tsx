import React, { useEffect, useState } from 'react';
import Filters from './Filters';

export default function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);

  function load(q?: any) {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        if (q?.q) data = data.filter((d: any) => d.id.includes(q.q) || d.userId.includes(q.q));
        setOrders(data);
      })
      .catch(() => setOrders([]));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <Filters onApply={load} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', color: '#F3F3F3', minWidth: 800 }}>
          <thead>
            <tr>
              <th scope="col" style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th scope="col" style={{ padding: '12px', textAlign: 'left' }}>User</th>
              <th scope="col" style={{ padding: '12px', textAlign: 'left' }}>Type</th>
              <th scope="col" style={{ padding: '12px', textAlign: 'left' }}>Bags</th>
              <th scope="col" style={{ padding: '12px', textAlign: 'left' }}>Floor</th>
              <th scope="col" style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th scope="col" style={{ padding: '12px', textAlign: 'left' }}>Price</th>
              <th scope="col" style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid #2A2A2A' }}>
                <td style={{ padding: '12px' }}>{o.id}</td>
                <td style={{ padding: '12px' }}>{o.userId}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    background: o.type === 'STANDARD' ? '#4CAF50' : o.type === 'RECYCLABLE' ? '#2196F3' : '#FF9800',
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: '600'
                  }}>
                    {o.type}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  {o.bagsCount || '-'}
                  {o.bagsCount > 1 && ' 🎒'}
                </td>
                <td style={{ padding: '12px' }}>
                  {o.floor || '-'} {o.accessType === 'STAIRS' && '🚶'}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    background: 
                      o.status === 'COMPLETED' ? '#4CAF50' :
                      o.status === 'EN_ROUTE' ? '#2196F3' :
                      o.status === 'ARRIVED' ? '#FF9800' :
                      o.status === 'ACCEPTED' ? '#9C27B0' :
                      '#FF5722',
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: '600'
                  }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: '12px', fontWeight: '600' }}>{o.price} ₴</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => alert('View order details ' + o.id)}
                    style={{
                      background: 'transparent',
                      color: '#D4AF37',
                      border: '1px solid #D4AF37',
                      padding: '6px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


