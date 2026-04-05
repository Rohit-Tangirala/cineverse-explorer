import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-6">
      <h1 className="text-9xl font-black tracking-tighter">404</h1>
      <p className="text-2xl font-bold text-muted-text">PAGE NOT FOUND</p>
      <Link to="/" className="bg-accent-red px-8 py-3 rounded-xl font-bold">RETURN HOME</Link>
    </div>
  );
}
