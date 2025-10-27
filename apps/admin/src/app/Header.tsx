import React from 'react';

export default function Header() {
  return (
    <header aria-label="Main header" style={{ padding: 16, borderBottom: '1px solid #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ color: '#D4AF37', fontWeight: 700 }} role="img" aria-label="Museum logo">Museum Admin</div>
      <nav aria-label="Main navigation">
        <a href="/orders" style={{ color: '#F3F3F3', marginRight: 12 }} aria-label="Orders">Orders</a>
        <a href="/couriers" style={{ color: '#F3F3F3', marginRight: 12 }} aria-label="Couriers">Couriers</a>
        <a href="/promos" style={{ color: '#F3F3F3' }} aria-label="Promos">Promos</a>
      </nav>
    </header>
  );
}


