import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'motion/react';
import { Heart, Loader2, User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      if (!token) return;
      try {
        const res = await axios.get('/api/auth/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user, token, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent-red" />
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 mb-12 flex flex-col md:flex-row items-center gap-8"
      >
        <div className="w-32 h-32 bg-accent-red/10 rounded-full flex items-center justify-center border-2 border-accent-red/20 shadow-xl">
          <User className="w-16 h-16 text-accent-red" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase">{user?.username}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-muted-text font-bold">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent-red" />
              {user?.email}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-red" />
              MEMBER SINCE 2026
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-villain-red w-8 h-8 fill-current" />
        <h2 className="text-4xl font-black tracking-tight">FAVOURITE CHARACTERS</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-xl text-muted-text mb-6">You haven't favourited any characters yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            EXPLORE UNIVERSES
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {favorites.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/character/${encodeURIComponent(char.name)}`)}
              className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-accent-red transition-all group shadow-lg"
            >
              <div className="aspect-[3/4] relative">
                <img 
                  src={char.imageUrl || `https://ui-avatars.com/api/?name=${char.name}&background=random`} 
                  alt={char.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute top-3 right-3">
                  <Heart className="w-5 h-5 text-villain-red fill-current drop-shadow-lg" />
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-black truncate group-hover:text-accent-red transition-colors">{char.name}</p>
                <p className="text-[10px] text-muted-text uppercase font-bold tracking-widest">{char.universe}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
