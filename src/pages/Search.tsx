import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Loader2, History } from 'lucide-react';
import { motion } from 'motion/react';
import { debounce } from 'lodash';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (q: string) => {
      if (!q) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`/api/characters/search?q=${q}`);
        setResults(res.data);
        
        // Save to history
        const newHistory = [q, ...history.filter(h => h !== q)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500),
    [history]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-6xl font-black tracking-tighter mb-4">GLOBAL SEARCH</h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all universes..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-lg font-bold focus:outline-none focus:border-accent-red transition-colors"
          />
        </div>
      </div>

      {history.length > 0 && !query && (
        <div className="flex gap-2 justify-center flex-wrap">
          <span className="text-muted-text text-sm font-bold flex items-center gap-2 mr-2"><History className="w-4 h-4" /> Recent:</span>
          {history.map((h, index) => (
            <button key={`${h}-${index}`} onClick={() => setQuery(h)} className="bg-white/5 px-4 py-1 rounded-full text-sm font-bold hover:bg-white/10">{h}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-accent-red" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((c, index) => (
            <Link key={c.id || index} to={`/character/${c.name}`} className="glass-card group overflow-hidden">
              <img src={c.imageUrl} alt={c.name} className="w-full aspect-square object-cover" />
              <div className="p-4">
                <p className="font-black truncate">{c.name}</p>
                <p className="text-xs text-muted-text">{c.universe}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
