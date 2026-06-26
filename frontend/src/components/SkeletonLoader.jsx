import React from 'react';
import './SkeletonLoader.css';

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="skeleton-wrapper">
      {/* Header skeleton */}
      <div className="skeleton-row skeleton-header">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`th-${i}`} className="skeleton-pulse skeleton-box" style={{ height: '16px', width: i === 0 ? '40%' : '70%' }} />
        ))}
      </div>
      {/* Body skeletons */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`tr-${r}`} className="skeleton-row">
          {Array.from({ length: columns }).map((_, c) => (
            <div key={`td-${r}-${c}`} className="skeleton-pulse skeleton-box" style={{ height: '14px', width: c === 0 ? '80%' : c === columns - 1 ? '50%' : '90%' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="skeleton-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '16px' }}>
      <div className="skeleton-pulse skeleton-box" style={{ height: '24px', width: '30%', marginBottom: '24px' }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', flex: 1, paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`bar-${i}`} className="skeleton-pulse skeleton-box" style={{ flex: 1, height: `${Math.max(20, Math.random() * 80 + 20)}%`, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card" style={{ padding: '24px' }}>
      <div className="skeleton-pulse skeleton-box" style={{ width: '40px', height: '40px', borderRadius: '12px', marginBottom: '16px' }} />
      <div className="skeleton-pulse skeleton-box" style={{ height: '32px', width: '60%', marginBottom: '8px' }} />
      <div className="skeleton-pulse skeleton-box" style={{ height: '14px', width: '80%' }} />
    </div>
  );
}
