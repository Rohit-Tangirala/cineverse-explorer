import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const THEMES: Record<string, any> = {
  Marvel: {
    accent: '#E23636',
    accentRgb: '226, 54, 54',
    bgDark: '#0A0A0F',
    bgCard: '#1A0A0A',
    bgMid: '#2A0A0A',
    gradient: 'radial-gradient(circle at top right, rgba(226, 54, 54, 0.15), transparent), radial-gradient(circle at bottom left, rgba(226, 54, 54, 0.05), transparent)'
  },
  DC: {
    accent: '#0047AB',
    accentRgb: '0, 71, 171',
    bgDark: '#05050A',
    bgCard: '#0A0A1A',
    bgMid: '#0A0A2A',
    gradient: 'radial-gradient(circle at top right, rgba(0, 71, 171, 0.15), transparent), radial-gradient(circle at bottom left, rgba(0, 71, 171, 0.05), transparent)'
  },
  Naruto: {
    accent: '#FF9F00',
    accentRgb: '255, 159, 0',
    bgDark: '#0A0805',
    bgCard: '#1A120A',
    bgMid: '#2A1A0A',
    gradient: 'radial-gradient(circle at top right, rgba(255, 159, 0, 0.15), transparent), radial-gradient(circle at bottom left, rgba(255, 159, 0, 0.05), transparent)'
  },
  'One Piece': {
    accent: '#00BFFF',
    accentRgb: '0, 191, 255',
    bgDark: '#050A0A',
    bgCard: '#0A161A',
    bgMid: '#0A262A',
    gradient: 'radial-gradient(circle at top right, rgba(0, 191, 255, 0.15), transparent), radial-gradient(circle at bottom left, rgba(0, 191, 255, 0.05), transparent)'
  },
  default: {
    accent: '#E23636',
    accentRgb: '226, 54, 54',
    bgDark: '#0A0A0F',
    bgCard: '#12122A',
    bgMid: '#16163A',
    gradient: 'radial-gradient(circle at top right, rgba(226, 54, 54, 0.05), transparent), radial-gradient(circle at bottom left, rgba(226, 54, 54, 0.02), transparent)'
  }
};

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const updateTheme = (universe: string) => {
    const theme = THEMES[universe] || THEMES.default;
    const root = document.documentElement;
    root.style.setProperty('--accent-red', theme.accent);
    root.style.setProperty('--accent-rgb', theme.accentRgb);
    root.style.setProperty('--bg-dark', theme.bgDark);
    root.style.setProperty('--bg-card', theme.bgCard);
    root.style.setProperty('--bg-mid', theme.bgMid);
    root.style.setProperty('--bg-gradient', theme.gradient);
  };

  useEffect(() => {
    let universe = 'default';
    
    // Check if we are on a universe page
    const universeMatch = location.pathname.match(/\/universe\/([^/]+)/);
    if (universeMatch) {
      universe = decodeURIComponent(universeMatch[1]);
      updateTheme(universe);
    } else if (location.pathname.startsWith('/character/')) {
      // Character detail handles its own theme update
    } else {
      updateTheme('default');
    }
    
    // For character pages, the component itself will call updateTheme
    // when data is loaded.
  }, [location.pathname]);

  return <>{children}</>;
}

export const setUniverseTheme = (universe: string) => {
  const theme = THEMES[universe] || THEMES.default;
  const root = document.documentElement;
  root.style.setProperty('--accent-red', theme.accent);
  root.style.setProperty('--accent-rgb', theme.accentRgb);
  root.style.setProperty('--bg-dark', theme.bgDark);
  root.style.setProperty('--bg-card', theme.bgCard);
  root.style.setProperty('--bg-mid', theme.bgMid);
  root.style.setProperty('--bg-gradient', theme.gradient);
};
