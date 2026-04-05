import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2 className="animate-spin w-12 h-12 text-accent-red" />
    </div>
  );
}
