/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ThemeWrapper from './components/ThemeWrapper';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import GraphView from './pages/GraphView';
import CharacterDetail from './pages/CharacterDetail';
import PathFinder from './pages/PathFinder';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import Compare from './pages/Compare';
import AdminPanel from './pages/AdminPanel';
import Setup from './pages/Setup';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'ADMIN') return <div className="text-center py-20 text-red-500 font-black text-4xl">403 FORBIDDEN</div>;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeWrapper>
          <div className="min-h-screen bg-bg-dark text-white transition-colors duration-500">
            <Toaster position="bottom-right" />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/universe/:universe" element={<GraphView />} />
                <Route path="/character/:name" element={<CharacterDetail />} />
                <Route path="/path" element={<PathFinder />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                <Route path="/setup" element={<Setup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ThemeWrapper>
      </Router>
    </AuthProvider>
  );
}
