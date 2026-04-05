import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { motion } from 'motion/react';
import { Loader2, TrendingUp, Users, Zap, Award, Shield, Swords } from 'lucide-react';

const COLORS = ['#E23636', '#0047AB', '#FF9F00', '#00BFFF', '#8A2BE2'];

export default function Stats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/characters/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent-red" />
      </div>
    );
  }

  if (!stats) return null;

  const universeDistData = stats.global.universeDistribution.map((d: any) => ({
    name: d.universe,
    value: d.count
  }));

  const heroesVsVillainsData = stats.universes.map((u: any) => ({
    name: u.universe,
    Heroes: u.heroes,
    Villains: u.villains
  }));

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl font-black tracking-tighter mb-4">CINEVERSE ANALYTICS</h1>
        <p className="text-muted-text text-xl font-bold uppercase tracking-widest">Deep insights into the multiverse</p>
      </motion.div>

      {/* Global Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 flex items-center gap-6 border-accent-red/20 hover:border-accent-red/50 transition-all"
        >
          <div className="w-16 h-16 bg-accent-red/10 rounded-2xl flex items-center justify-center border border-accent-red/20 shadow-[0_0_15px_rgba(226,54,54,0.2)]">
            <Users className="text-accent-red w-8 h-8" />
          </div>
          <div>
            <p className="text-muted-text font-black text-xs uppercase tracking-widest">Total Characters</p>
            <p className="text-4xl font-black tracking-tighter text-white">{stats.global.totalCharacters}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 flex items-center gap-6 border-accent-red/20 hover:border-accent-red/50 transition-all"
        >
          <div className="w-16 h-16 bg-accent-red/10 rounded-2xl flex items-center justify-center border border-accent-red/20 shadow-[0_0_15px_rgba(226,54,54,0.2)]">
            <Zap className="text-accent-red w-8 h-8" />
          </div>
          <div>
            <p className="text-muted-text font-black text-xs uppercase tracking-widest">Total Connections</p>
            <p className="text-4xl font-black tracking-tighter text-white">{stats.global.totalRelationships}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 flex items-center gap-6 border-accent-red/20 hover:border-accent-red/50 transition-all"
        >
          <div className="w-16 h-16 bg-accent-red/10 rounded-2xl flex items-center justify-center border border-accent-red/20 shadow-[0_0_15px_rgba(226,54,54,0.2)]">
            <TrendingUp className="text-accent-red w-8 h-8" />
          </div>
          <div>
            <p className="text-muted-text font-black text-xs uppercase tracking-widest">Avg. Connections</p>
            <p className="text-4xl font-black tracking-tighter text-white">
              {(stats.global.totalRelationships / stats.global.totalCharacters).toFixed(1)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Global Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8"
        >
          <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-2">
            <Award className="text-accent-red" />
            UNIVERSE DISTRIBUTION
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={universeDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {universeDistData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12122A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8"
        >
          <h3 className="text-2xl font-black mb-8 tracking-tight flex items-center gap-2">
            <Shield className="text-accent-red" />
            HEROES VS VILLAINS
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heroesVsVillainsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} fontWeight="bold" />
                <YAxis stroke="#666" fontSize={12} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12122A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Heroes" fill="#0047AB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Villains" fill="#E23636" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Universe Details */}
      <div className="space-y-8">
        <h2 className="text-4xl font-black tracking-tighter flex items-center gap-3">
          <TrendingUp className="text-accent-red" />
          UNIVERSE DEEP DIVE
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.universes.map((u: any, i: number) => (
            <motion.div 
              key={u.universe}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 border-l-4"
              style={{ borderLeftColor: COLORS[i % COLORS.length] }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-black tracking-tighter">{u.universe.toUpperCase()}</h3>
                <div className="text-right">
                  <p className="text-muted-text text-[10px] font-black uppercase tracking-widest">Most Connected</p>
                  <p className="text-accent-red font-black">{u.mostConnected?.name || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-black text-muted-text uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-blue-500" />
                    TOP HEROES
                  </h4>
                  <ul className="space-y-2">
                    {u.topHeroes.map((h: any) => (
                      <li key={h.name} className="flex justify-between items-center text-sm">
                        <span className="font-bold">{h.name}</span>
                        <span className="text-muted-text text-xs">{h.connections} pts</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black text-muted-text uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Swords className="w-3 h-3 text-red-500" />
                    TOP VILLAINS
                  </h4>
                  <ul className="space-y-2">
                    {u.topVillains.map((v: any) => (
                      <li key={v.name} className="flex justify-between items-center text-sm">
                        <span className="font-bold">{v.name}</span>
                        <span className="text-muted-text text-xs">{v.connections} pts</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
