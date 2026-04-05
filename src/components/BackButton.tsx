import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-text hover:text-white transition-colors mb-6">
      <ArrowLeft className="w-4 h-4" />
      <span className="font-bold uppercase tracking-widest text-xs">BACK</span>
    </button>
  );
}
