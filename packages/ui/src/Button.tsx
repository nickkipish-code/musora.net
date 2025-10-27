import React from 'react';
import { tokens } from './tokens';

export function Button({ children, onClick, style }: any) {
  return (
    <button onClick={onClick} style={{ background: tokens.colors.primary, color: tokens.colors.bg, padding: 10, borderRadius: tokens.radii.md, border: 'none', ...style }}>
      {children}
    </button>
  );
}


