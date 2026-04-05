import React, { useState } from 'react';
import axios from 'axios';
import { Search, ArrowRight, Loader2, Zap, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export default function PathFinder() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [path, setPath] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const summarizePath = async (pathArray: string[]) => {
    setAiLoading(true);
    setAiSummary('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Summarize the relationship and connection path between these characters in a short, natural-language sentence (max 30 words): ${pathArray.join(' -> ')}. Focus on why they are connected in their respective universes (Marvel, DC, Naruto, One Piece). Be concise and engaging.`,
      });
      setAiSummary(response.text || '');
    } catch (err) {
      console.error("AI Summary Error:", err);
      setAiSummary("Could not generate AI summary at this time.");
    } finally {
      setAiLoading(false);
    }
  };

  const findPath = async () => {
    if (!from || !to) return;
    setLoading(true);
    setError('');
    setPath(null);
    setAiSummary('');
    try {
      const res = await axios.get(`/api/characters/path?from=${from}&to=${to}`);
      const foundPath = res.data;
      setPath(foundPath);
      setLoading(false);
      
      if (foundPath && foundPath.length > 0) {
        summarizePath(foundPath);
      }
    } catch (err) {
      setError('No connection found between these characters in the database.');
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-12 max-w-4xl mx-auto min-h-[80vh]">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black mb-4 tracking-tighter">PATH <span className="text-accent-red">FINDER</span></h1>
        <p className="text-muted-text">Discover how characters are connected across the multiverse.</p>
      </div>

      <div className="glass-card p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-text">FROM CHARACTER</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text w-4 h-4" />
              <input 
                type="text" 
                placeholder="e.g. Iron Man"
                className="bg-bg-mid border border-white/10 rounded-lg pl-10 pr-4 py-3 w-full focus:border-accent-red outline-none"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-text">TO CHARACTER</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text w-4 h-4" />
              <input 
                type="text" 
                placeholder="e.g. Thanos"
                className="bg-bg-mid border border-white/10 rounded-lg pl-10 pr-4 py-3 w-full focus:border-accent-red outline-none"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={findPath}
          disabled={loading || !from || !to}
          className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Zap className="fill-white" />}
          {loading ? 'SEARCHING...' : 'FIND CONNECTION'}
        </button>
      </div>

      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <Loader2 className="w-12 h-12 animate-spin text-accent-red mb-4" />
          <p className="text-xl font-bold animate-pulse">Searching the Multiverse...</p>
          <p className="text-muted-text text-sm mt-2">Tracing relationships through the Cineverse graph</p>
        </motion.div>
      )}

      {error && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-villain-red/10 border border-villain-red/30 p-4 rounded-xl text-center text-villain-red font-bold"
        >
          {error}
        </motion.div>
      )}

      {path && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <h3 className="text-center text-xl font-black">CONNECTION FOUND! ({path.length - 1} STEPS)</h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {path.map((name, i) => (
                <React.Fragment key={i}>
                  <div className="px-6 py-3 bg-accent-red text-white font-black rounded-full shadow-lg">
                    {name}
                  </div>
                  {i < path.length - 1 && <ArrowRight className="text-muted-text" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {(aiLoading || aiSummary) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 border-accent-red/30 bg-accent-red/5"
            >
              <div className="flex items-center gap-2 mb-3 text-accent-red">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-black text-sm uppercase tracking-widest">AI Relationship Summary</h4>
              </div>
              {aiLoading ? (
                <div className="flex items-center gap-3 text-muted-text italic">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating multiverse insights...</span>
                </div>
              ) : (
                <p className="text-lg font-medium leading-relaxed italic">
                  "{aiSummary}"
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      )}

      <div className="mt-20">
        <h4 className="text-xs font-black text-muted-text mb-4 uppercase tracking-widest">Suggested Connections</h4>
        <div className="flex flex-wrap gap-3">
          {[
            ['Iron Man', 'Spider-Man'],
            ['Naruto Uzumaki', 'Sasuke Uchiha'],
            ['Batman', 'Joker'],
            ['Monkey D. Luffy', 'Roronoa Zoro']
          ].map(([f, t], i) => (
            <button 
              key={i}
              onClick={() => { setFrom(f); setTo(t); }}
              className="px-4 py-2 bg-bg-mid border border-white/5 rounded-lg text-sm hover:border-accent-red transition-colors"
            >
              {f} → {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
