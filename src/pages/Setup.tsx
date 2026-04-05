import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, Shield } from 'lucide-react';

export default function Setup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', secret: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get('/api/auth/admin-exists');
        if (res.data.exists) {
          navigate('/');
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.post('/api/auth/register/admin', formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card p-8 max-w-md w-full space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-accent-red" />
          <h1 className="text-2xl font-black">INITIAL SETUP</h1>
        </div>
        <p className="text-muted-text text-sm">Create the first administrator account.</p>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" className="w-full bg-white/5 p-3 rounded-xl" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
          <input type="email" placeholder="Email" className="w-full bg-white/5 p-3 rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full bg-white/5 p-3 rounded-xl" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          <input type="password" placeholder="Admin Key" className="w-full bg-white/5 p-3 rounded-xl" value={formData.secret} onChange={e => setFormData({...formData, secret: e.target.value})} required />
          <button type="submit" disabled={submitting} className="w-full bg-accent-red py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'CREATE ADMIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
