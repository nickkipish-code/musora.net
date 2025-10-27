import React from 'react';

async function fetchOrder(id: string) {
  const r = await fetch(process.env.API_BASE_URL + `/orders/${id}`);
  return r.json();
}

export default async function OrderDetail({ params }: any) {
  const order = await fetchOrder(params.id);
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#D4AF37' }}>Order {order.id}</h2>
      <pre style={{ color: '#F3F3F3' }}>{JSON.stringify(order, null, 2)}</pre>
    </div>
  );
}


