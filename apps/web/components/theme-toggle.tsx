'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  
  // Mounted check to prevent hydration mismatch for UI that depends on the theme state
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="theme-toggle" role="radiogroup" aria-label="Tema">
        <button className="theme-btn active" title="Original" role="radio" aria-checked="true">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 2L2 22h20L12 2zm0 3.83L19.17 20H4.83L12 5.83z"/></svg>
        </button>
        <button className="theme-btn" title="Claro" role="radio" aria-checked="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>
        <button className="theme-btn" title="Escuro" role="radio" aria-checked="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        </button>
      </div>
    );
  }

  const currentTheme = theme || resolvedTheme || 'original';

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Tema">
      <button 
        className={`theme-btn ${currentTheme === 'original' ? 'active' : ''}`} 
        onClick={() => setTheme('original')}
        title="Original" 
        role="radio" 
        aria-checked={currentTheme === 'original'}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 2L2 22h20L12 2zm0 3.83L19.17 20H4.83L12 5.83z"/></svg>
      </button>
      <button 
        className={`theme-btn ${currentTheme === 'claro' ? 'active' : ''}`} 
        onClick={() => setTheme('claro')}
        title="Claro" 
        role="radio" 
        aria-checked={currentTheme === 'claro'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      </button>
      <button 
        className={`theme-btn ${currentTheme === 'escuro' ? 'active' : ''}`} 
        onClick={() => setTheme('escuro')}
        title="Escuro" 
        role="radio" 
        aria-checked={currentTheme === 'escuro'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      </button>
    </div>
  );
}
