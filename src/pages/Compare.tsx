import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Swords, Shield, Users, Zap, Award, BookOpen, X, ArrowLeftRight } from 'lucide-react';

interface Character {
  name: string;
  universe: string;
  role: string;
  team: string;
  bio: string;
  powers: string | string[];
  firstAppearance: string;
  imageUrl: string;
  allies: any[];
  enemies: any[];
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [char1, setChar1] = useState<Character | null>(null);
  const [char2, setChar2] = useState<Character | null>(null);
  
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  
  const [results1, setResults1] = useState<any[]>([]);
  const [results2, setResults2] = useState<any[]>([]);
  
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    const char1Name = searchParams.get('char1');
    const char2Name = searchParams.get('char2');
    
    if (char1Name) fetchCharacter(char1Name, 1);
    if (char2Name) fetchCharacter(char2Name, 2);
  }, [searchParams]);

  const fetchCharacter = async (name: string, slot: 1 | 2) => {
    slot === 1 ? setLoading1(true) : setLoading2(true);
    try {
      const res = await axios.get(`/api/characters/detail/${encodeURIComponent(name)}`);
      slot === 1 ? setChar1(res.data) : setChar2(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      slot === 1 ? setLoading1(false) : setLoading2(false);
    }
  };

  const handleSearch = async (query: string, slot: 1 | 2) => {
    if (query.length < 2) {
      slot === 1 ? setResults1([]) : setResults2([]);
      return;
    }
    try {
      const res = await axios.get(`/api/characters/search?q=${query}`);
      slot === 1 ? setResults1(res.data) : setResults2(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectCharacter = (name: string, slot: 1 | 2) => {
    fetchCharacter(name, slot);
    slot === 1 ? setResults1([]) : setResults2([]);
    slot === 1 ? setSearch1('') : setSearch2('');
  };

  const getConnectionsCount = (char: Character | null) => {
    if (!char) return 0;
    return (char.allies?.length || 0) + (char.enemies?.length || 0);
  };

  const connections1 = getConnectionsCount(char1);
  const connections2 = getConnectionsCount(char2);

  const CharacterCard = ({ char, slot }: { char: Character | null, slot: 1 | 2 }) => {
    if (!char) {
      return (
        <div className="glass-card p-12 flex flex-col items-center justify-center border-dashed border-2 border-white/10 min-h-[600px]">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-muted-text" />
          </div>
          <p className="text-muted-text font-bold uppercase tracking-widest mb-8">Select Character {slot}</p>
          <div className="w-full max-w-xs relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-text" />
              <input 
                type="text"
                placeholder="Search character..."
                value={slot === 1 ? search1 : search2}
                onChange={(e) => {
                  const val = e.target.value;
                  slot === 1 ? setSearch1(val) : setSearch2(val);
                  handleSearch(val, slot);
                }}
                className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent-red outline-none font-bold transition-all"
              />
            </div>
            <AnimatePresence>
              {(slot === 1 ? results1 : results2).length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-bg-card border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
                >
                  {(slot === 1 ? results1 : results2).map((res) => (
                    <button
                      key={res.name}
                      onClick={() => selectCharacter(res.name, slot)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                    >
                      <img src={res.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-sm">{res.name}</p>
                        <p className="text-[10px] text-muted-text uppercase font-black tracking-widest">{res.universe}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    }

    const isWinner = slot === 1 ? connections1 > connections2 : connections2 > connections1;
    const isTie = connections1 === connections2 && char1 && char2;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card overflow-hidden relative transition-all duration-500 ${isWinner ? 'ring-2 ring-accent-red shadow-[0_0_30px_rgba(226,54,54,0.2)]' : ''}`}
      >
        <button 
          onClick={() => slot === 1 ? setChar1(null) : setChar2(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-accent-red rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isWinner && (
          <div className="absolute top-4 left-4 z-10 bg-accent-red text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest flex items-center gap-1 shadow-lg">
            <Award className="w-3 h-3" /> MOST CONNECTED
          </div>
        )}

        <div className="aspect-video relative">
          <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
          <div className="absolute bottom-6 left-8">
            <p className="text-[10px] font-black text-accent-red uppercase tracking-[0.3em] mb-1">{char.universe}</p>
            <h2 className="text-4xl font-black tracking-tighter uppercase">{char.name}</h2>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-muted-text uppercase tracking-widest mb-1">Role</p>
              <div className="flex items-center gap-2">
                {char.role === 'Hero' ? <Shield className="w-4 h-4 text-blue-500" /> : <Swords className="w-4 h-4 text-red-500" />}
                <p className="font-bold">{char.role}</p>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-muted-text uppercase tracking-widest mb-1">Team</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-red" />
                <p className="font-bold truncate">{char.team}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-muted-text uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-accent-red" /> POWERS
            </h4>
            <div className="flex flex-wrap gap-2">
              {(char.powers ? (Array.isArray(char.powers) ? char.powers : char.powers.split(', ')) : []).slice(0, 5).map(p => (
                <span key={p} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-muted-text uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-accent-red" /> ORIGIN
            </h4>
            <p className="text-sm text-muted-text leading-relaxed line-clamp-3">{char.bio}</p>
            <p className="text-xs font-bold italic text-accent-red">First Appearance: {char.firstAppearance}</p>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="text-center flex-1">
              <p className="text-[10px] font-black text-muted-text uppercase tracking-widest mb-1">Allies</p>
              <p className="text-2xl font-black">{char.allies?.length || 0}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center flex-1">
              <p className="text-[10px] font-black text-muted-text uppercase tracking-widest mb-1">Enemies</p>
              <p className="text-2xl font-black">{char.enemies?.length || 0}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center flex-1">
              <p className="text-[10px] font-black text-muted-text uppercase tracking-widest mb-1">Connections</p>
              <p className={`text-2xl font-black ${isWinner ? 'text-accent-red' : ''}`}>{getConnectionsCount(char)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-black tracking-tighter mb-4">CHARACTER CLASH</h1>
        <p className="text-muted-text text-xl font-bold uppercase tracking-widest">Compare powers, origins, and connections</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
        <CharacterCard char={char1} slot={1} />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-accent-red rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(226,54,54,0.4)] z-10">
            <ArrowLeftRight className="w-8 h-8 text-white" />
          </div>
          <div className="h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block min-h-[400px]" />
        </div>

        <CharacterCard char={char2} slot={2} />
      </div>

      {char1 && char2 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <button 
            onClick={() => {
              setChar1(null);
              setChar2(null);
              navigate('/compare');
            }}
            className="btn-primary"
          >
            START NEW COMPARISON
          </button>
        </motion.div>
      )}
    </div>
  );
}
