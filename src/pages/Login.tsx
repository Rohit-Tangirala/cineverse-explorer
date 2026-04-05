import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name || 'Explorer'}!`, {
        duration: 3000,
        position: 'top-right',
        style: { background: '#12122A', color: '#fff', border: '1px solid #E23636' },
      });
      navigate('/');
    } catch (err: any) {
      if (Array.isArray(err.response?.data?.errors)) {
        setError(err.response.data.errors.map((e: any) => e.msg).join(', '));
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-red/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-red/20">
            <LogIn className="text-accent-red w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">WELCOME BACK</h1>
          <p className="text-muted-text">Login to your Cineverse account</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-villain-red/10 border border-villain-red/30 text-villain-red p-4 rounded-lg flex items-center gap-3 mb-6"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-muted-text uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text w-4 h-4" />
              <input 
                type="email" 
                required
                className="bg-bg-mid border border-white/10 rounded-lg pl-10 pr-4 py-3 w-full focus:border-accent-red outline-none transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-muted-text uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text w-4 h-4" />
              <input 
                type="password" 
                required
                className="bg-bg-mid border border-white/10 rounded-lg pl-10 pr-4 py-3 w-full focus:border-accent-red outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <p className="text-center mt-8 text-muted-text text-sm">
          Don't have an account? <Link to="/register" className="text-accent-red font-bold hover:underline">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
}
