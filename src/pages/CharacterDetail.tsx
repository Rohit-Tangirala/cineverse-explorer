import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Shield, Swords, Users, Zap, BookOpen, Heart, ArrowLeftRight, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { setUniverseTheme } from '../components/ThemeWrapper';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import { toast } from 'react-hot-toast';

export default function CharacterDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/characters/detail/${name}`);
        const data = res.data;
        setCharacter(data);
        setLoading(false);
        
        // Set dynamic theme
        setUniverseTheme(data.universe);

        // Save to recently viewed
        const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const newItem = { 
          name: data.name, 
          universe: data.universe, 
          imageUrl: data.imageUrl,
          role: data.role
        };
        
        const filtered = recent.filter((item: any) => item.name !== data.name);
        const updated = [newItem, ...filtered].slice(0, 6);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));

        // Check favorite status if logged in
        if (user && token) {
          try {
            const favRes = await axios.get(`/api/auth/favorites/check/${encodeURIComponent(data.name)}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setIsFavorite(favRes.data.isFavorite);
          } catch (err) {
            console.error("Failed to check favorite status", err);
          }
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDetail();
  }, [name, user, token]);

  const toggleFavorite = async () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        await axios.delete('/api/auth/favorites/remove', {
          data: { characterName: character.name },
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(false);
        toast.success('Removed from favourites', {
          duration: 3000,
          position: 'top-right',
          style: { background: '#12122A', color: '#fff', border: '1px solid #E23636' },
        });
      } else {
        await axios.post('/api/auth/favorites/add', 
          { characterName: character.name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsFavorite(true);
        toast.success('Added to favourites!', {
          duration: 3000,
          position: 'top-right',
          style: { background: '#12122A', color: '#fff', border: '1px solid #E23636' },
        });
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent-red" />
      </div>
    );
  }

  if (!character) {
    return <div className="text-center py-20">Character not found.</div>;
  }

  const roleColor = character.role === 'hero' ? 'text-hero-green' : character.role === 'villain' ? 'text-villain-red' : 'text-antihero-gold';
  const roleBg = character.role === 'hero' ? 'bg-hero-green/10 border-hero-green/30' : character.role === 'villain' ? 'bg-villain-red/10 border-villain-red/30' : 'bg-antihero-gold/10 border-antihero-gold/30';

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <BackButton />
        <div className="flex items-center gap-2 text-xs font-black text-muted-text uppercase tracking-widest">
          <Link to="/" className="hover:text-white transition-colors">HOME</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/universe/${character.universe}`} className="hover:text-white transition-colors">{character.universe.toUpperCase()}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">{character.name.toUpperCase()}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full md:w-1/3"
        >
          <div className="relative group">
            <img 
              src={character.imageUrl || `https://ui-avatars.com/api/?name=${character.name}&size=512&background=random`} 
              alt={character.name}
              className="w-full aspect-square object-cover rounded-2xl border-4 border-white/5 shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute -bottom-4 -right-4 px-6 py-2 rounded-full border font-black text-sm ${roleBg} ${roleColor}`}>
              {character.role.toUpperCase()}
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-card p-4 rounded-xl border border-white/5">
                <p className="text-xs text-muted-text font-bold mb-1">UNIVERSE</p>
                <p className="font-black">{character.universe}</p>
              </div>
              <div className="bg-bg-card p-4 rounded-xl border border-white/5">
                <p className="text-xs text-muted-text font-bold mb-1">ARC</p>
                <p className="font-black">{character.arcName}</p>
              </div>
            </div>
            <div className="bg-bg-card p-4 rounded-xl border border-white/5">
              <p className="text-xs text-muted-text font-bold mb-1 flex items-center gap-1 uppercase tracking-wider">
                <BookOpen className="w-3 h-3 text-accent-red" /> First Appearance
              </p>
              <p className="font-black text-sm">{character.firstAppearance || "Unknown"}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-6xl font-black tracking-tighter">{character.name}</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/compare?char1=${encodeURIComponent(character.name)}`)}
                className="p-3 rounded-full border border-white/10 bg-bg-card text-muted-text hover:border-accent-red hover:text-accent-red transition-all flex items-center gap-2 px-6 font-black text-xs tracking-widest"
              >
                <ArrowLeftRight className="w-4 h-4" /> COMPARE
              </button>
              <button
                onClick={toggleFavorite}
                disabled={favLoading}
                className={`p-3 rounded-full border transition-all ${
                  isFavorite 
                    ? 'bg-villain-red border-villain-red text-white' 
                    : 'bg-bg-card border-white/10 text-muted-text hover:border-villain-red hover:text-villain-red'
                }`}
              >
                {favLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                )}
              </button>
            </div>
          </div>
          <p className="text-xl font-bold text-accent-red mb-8">{character.team}</p>

          <div className="space-y-8">
            <div className="glass-card p-6">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Shield className="text-accent-red" /> BIOGRAPHY
              </h3>
              <p className="text-muted-text leading-relaxed">
                {character.bio}
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Zap className="text-antihero-gold" /> POWERS & ABILITIES
              </h3>
              <div className="flex flex-wrap gap-2">
                {character.powers ? character.powers.split(', ').map((p: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-antihero-gold/10 border border-antihero-gold/30 text-antihero-gold text-xs font-bold rounded-full">
                    {p}
                  </span>
                )) : <p className="text-xs text-muted-text italic">No powers recorded.</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                  <Users className="text-hero-green" /> ALLIES
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scroll-smooth snap-x">
                  {character.allies && character.allies.length > 0 ? character.allies.map((a: any) => (
                    <Link 
                      key={a.id} 
                      to={`/character/${a.name}`}
                      className="flex-shrink-0 w-32 group snap-start"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 border border-white/10 group-hover:border-hero-green transition-colors">
                        <img src={`https://ui-avatars.com/api/?name=${a.name}&size=128&background=random`} alt={a.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-black truncate text-center group-hover:text-hero-green transition-colors">{a.name}</p>
                    </Link>
                  )) : <p className="text-xs text-muted-text italic">No known allies recorded.</p>}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                  <Swords className="text-villain-red" /> ENEMIES
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scroll-smooth snap-x">
                  {character.enemies && character.enemies.length > 0 ? character.enemies.map((e: any) => (
                    <Link 
                      key={e.id} 
                      to={`/character/${e.name}`}
                      className="flex-shrink-0 w-32 group snap-start"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden mb-2 border border-white/10 group-hover:border-villain-red transition-colors">
                        <img src={`https://ui-avatars.com/api/?name=${e.name}&size=128&background=random`} alt={e.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-black truncate text-center group-hover:text-villain-red transition-colors">{e.name}</p>
                    </Link>
                  )) : <p className="text-xs text-muted-text italic">No known enemies recorded.</p>}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
