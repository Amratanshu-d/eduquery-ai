import React from 'react';

export default function StatCard({ title, value, subtitle, color }) {
  return (
    <div style={{
      background: '#1e293b', borderRadius: '12px',
      padding: '24px', border: `1px solid ${color}33`,
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '32px', fontWeight: '700', color }}>{value}</div>
      {subtitle && <div style={{ color: '#64748b', fontSize: '12px', marginTop: '6px' }}>{subtitle}</div>}
    </div>
  );
}