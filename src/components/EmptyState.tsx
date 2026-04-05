import React from 'react';
import { Search } from 'lucide-react';

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
        <Search className="w-10 h-10 text-muted-text" />
      </div>
      <p className="text-muted-text font-bold">{message}</p>
    </div>
  );
}
