import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-bg-card border border-white/5 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-white/5" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );
}
