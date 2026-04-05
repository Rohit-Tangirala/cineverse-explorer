import React from 'react';

export default function ErrorCard({ message, retry }: { message: string, retry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 glass-card max-w-md mx-auto text-center space-y-4">
      <h2 className="text-2xl font-black text-red-500">ERROR</h2>
      <p className="text-muted-text">{message}</p>
      {retry && (
        <button onClick={retry} className="bg-accent-red px-6 py-2 rounded-xl font-bold">RETRY</button>
      )}
    </div>
  );
}
