import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { History, Zap, Star } from 'lucide-react';
import axios from 'axios';

const Stat = ({ label, value }: { label: string, value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 3, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return (
    <div className="flex flex-col items-center p-6 glass-card">
      <motion.span className="text-5xl font-black text-accent-red mb-2">{rounded}</motion.span>
      <span className="text-xs font-black text-muted-text uppercase tracking-widest">{label}</span>
    </div>
  );
};

const UNIVERSES = [
  { id: 'Marvel', name: 'MARVEL', icon: '🦸', desc: 'Explore the Avengers, X-Men, and the vast Marvel Multiverse.', color: '#E23636' },
  { id: 'DC', name: 'DC', icon: '🦇', desc: 'Discover the Justice League, Gotham, and the heroes of DC.', color: '#0047AB' },
  { id: 'Naruto', name: 'NARUTO', icon: '🍥', desc: 'Journey through the Hidden Leaf and the world of Shinobi.', color: '#FF9F00' },
  { id: 'One Piece', name: 'ONE PIECE', icon: '☠️', desc: 'Sail the Grand Line with the Straw Hat Pirates.', color: '#00BFFF' },
];

export default function Home() {
  const navigate = useNavigate();
  const [recent, setRecent] = useState<any[]>([]);
  const [cotd, setCotd] = useState<any>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecent(data);
    
    const fetchCotd = async () => {
        try {
            const res = await axios.get('/api/characters/search?q=');
            const characters = res.data;
            const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
            setCotd(characters[dayOfYear % characters.length]);
        } catch (err) {
            console.error(err);
        }
    };
    fetchCotd();
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-accent-red/20"
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', scale: Math.random() * 0.5 + 0.2 }}
            animate={{ y: [null, -100], opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5 }}
            style={{ width: Math.random() * 10 + 5 + 'px', height: Math.random() * 10 + 5 + 'px' }}
          />
        ))}
      </div>

      <section className="relative pt-32 pb-20 px-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-black mb-8 tracking-tighter text-white drop-shadow-[0_0_15px_rgba(226,54,54,0.5)]"
        >
          CINEVERSE <span className="text-accent-red">EXPLORER</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-text max-w-2xl mx-auto mb-16"
        >
          A visual graph of relationships, timelines, and connections across the greatest entertainment universes.
        </motion.p>
        
        <div className="flex justify-center gap-8 mb-20">
          <Stat label="Total Characters" value={1248} />
          <Stat label="Total Relationships" value={5632} />
        </div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate('/search')}
          className="bg-accent-red hover:bg-red-700 text-white px-12 py-4 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 mx-auto"
        >
          <Zap className="w-5 h-5" /> ADVANCED SEARCH
        </motion.button>
      </section>

      {cotd && (
        <section className="px-6 pb-20 max-w-7xl mx-auto">
            <div className="relative h-[400px] rounded-3xl overflow-hidden glass-card group">
                <img src={cotd.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-12">
                    <p className="text-accent-red font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Star className="w-4 h-4" /> Character of the Day</p>
                    <h2 className="text-5xl font-black mb-4">{cotd.name}</h2>
                    <p className="text-muted-text max-w-xl mb-6">{cotd.bio || 'No bio available.'}</p>
                    <div className="flex gap-4">
                        <button onClick={() => navigate(`/character/${cotd.name}`)} className="bg-accent-red px-8 py-3 rounded-full font-black uppercase tracking-widest">Explore</button>
                        <button className="bg-white/10 px-8 py-3 rounded-full font-black uppercase tracking-widest hover:bg-white/20">Favourite</button>
                    </div>
                </div>
            </div>
        </section>
      )}

      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black tracking-tighter mb-12 text-center">CHOOSE YOUR UNIVERSE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UNIVERSES.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/universe/${u.id}`)}
              className="glass-card p-8 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-6xl mb-6">{u.icon}</div>
              <h2 className="text-2xl font-black mb-3 group-hover:text-accent-red transition-colors">{u.name}</h2>
              <p className="text-sm text-muted-text mb-6">{u.desc}</p>
              <button className="bg-white/5 hover:bg-accent-red text-white py-2 px-4 rounded-full font-black text-xs uppercase tracking-widest transition-all w-full">
                Explore
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
