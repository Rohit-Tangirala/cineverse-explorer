import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 px-8 py-5 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'bg-[#050508]/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
      <Link to="/" className="flex items-center gap-2 text-2xl font-black text-accent-red group">
        <Zap className="fill-accent-red group-hover:scale-110 transition-transform" />
        CINEVERSE EXPLORER
      </Link>
      <div className="flex items-center gap-8 font-black text-xs uppercase tracking-widest">
        <Link to="/" className="hover:text-accent-red transition-colors relative group">
          HOME
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-red transition-all group-hover:w-full"></span>
        </Link>
        <Link to="/path" className="hover:text-accent-red transition-colors relative group">
          PATH FINDER
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-red transition-all group-hover:w-full"></span>
        </Link>
        <Link to="/stats" className="hover:text-accent-red transition-colors relative group">
          STATS
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-red transition-all group-hover:w-full"></span>
        </Link>
        <Link to="/compare" className="hover:text-accent-red transition-colors relative group">
          COMPARE
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-red transition-all group-hover:w-full"></span>
        </Link>
        {user?.role === 'ADMIN' && <Link to="/admin" className="hover:text-accent-red transition-colors">ADMIN</Link>}
        
        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <Link to="/profile" className="flex items-center gap-2 text-accent-red hover:scale-105 transition-transform">
              <User className="w-4 h-4" />
              <span className="uppercase tracking-tighter">{user.username}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-muted-text hover:text-accent-red transition-colors flex items-center gap-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-accent-red transition-colors">LOGIN</Link>
            <Link to="/register" className="bg-accent-red hover:bg-red-700 text-white py-2 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105">JOIN</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
