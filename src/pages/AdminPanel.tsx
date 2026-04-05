import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Loader2, Plus, Trash2, Edit2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { token } = useAuth();
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, charsRes] = await Promise.all([
        axios.get('/api/characters/stats'),
        axios.get('/api/characters/search?q=') // Fetch all
      ]);
      setStats(statsRes.data);
      setCharacters(charsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteCharacter = async (id: number) => {
    try {
      await axios.delete(`/api/characters/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12" /></div>;

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto space-y-12">
      {deleteId && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="glass-card p-8 max-w-md w-full">
            <h3 className="text-xl font-black mb-4">Confirm Delete</h3>
            <p className="text-muted-text mb-8">Are you sure you want to delete this character? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-white/10 py-3 rounded-xl font-bold">CANCEL</button>
              <button onClick={() => deleteCharacter(deleteId)} className="flex-1 bg-red-600 py-3 rounded-xl font-bold">DELETE</button>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-4xl font-black tracking-tighter">ADMIN DASHBOARD</h1>
      
      {stats && (
        <div className="grid grid-cols-3 gap-8">
          <div className="glass-card p-6">
            <p className="text-muted-text text-xs font-black uppercase">Total Characters</p>
            <p className="text-3xl font-black">{stats.global.totalCharacters}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-muted-text text-xs font-black uppercase">Total Relationships</p>
            <p className="text-3xl font-black">{stats.global.totalRelationships}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-muted-text text-xs font-black uppercase">Universes</p>
            <p className="text-3xl font-black">{stats.universes.length}</p>
          </div>
        </div>
      )}

      <div className="glass-card p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black">Characters</h2>
          <button className="bg-accent-red px-6 py-2 rounded-xl font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> ADD CHARACTER
          </button>
        </div>
        
        <div className="space-y-4">
          {characters.map((c, index) => (
            <div key={c.id || index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <img src={c.imageUrl} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-muted-text">{c.universe}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(c.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
