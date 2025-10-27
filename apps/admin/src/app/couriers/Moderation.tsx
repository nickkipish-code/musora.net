import React from 'react';

export default function CourierModeration() {
  const approve = (id: string) => alert('Approve ' + id);
  const deny = (id: string) => alert('Deny ' + id);

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ color: '#D4AF37' }}>Courier Moderation</h3>
      <p style={{ color: '#B8B8B8' }}>List of pending verifications (mock)</p>
      <div>
        <div style={{ marginTop: 12 }}>
          <span style={{ color: '#F3F3F3' }}>courier-1</span>
          <button onClick={() => approve('courier-1')}>Approve</button>
          <button onClick={() => deny('courier-1')}>Deny</button>
        </div>
      </div>
    </div>
  );
}


