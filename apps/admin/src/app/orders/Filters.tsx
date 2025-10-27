import React, { useState } from 'react';

export default function Filters({ onApply }: { onApply?: (q: any) => void }) {
  const [q, setQ] = useState('');
  return (
    <div style={{ marginBottom: 12 }}>
      <input placeholder="Search order id or user" value={q} onChange={(e) => setQ((e.target as any).value)} />
      <button onClick={() => onApply && onApply({ q })}>Apply</button>
    </div>
  );
}


