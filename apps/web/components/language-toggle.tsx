'use client';

import * as React from 'react';

export function LanguageToggle() {
  const [lang, setLang] = React.useState('pt-BR');
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('user-lang');
    if (savedLang) {
      setLang(savedLang);
      document.documentElement.setAttribute('data-lang', savedLang);
    }
  }, []);

  const changeLanguage = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem('user-lang', newLang);
    document.documentElement.setAttribute('data-lang', newLang);
    
    // Dispara evento global para caso haja algum script de tradução ouvindo
    window.dispatchEvent(new Event('languagechange'));
  };

  if (!mounted) {
    return (
      <div className="lang-toggle" role="radiogroup" aria-label="Idioma">
        <button className="lang-btn active" role="radio" aria-checked="true">PT</button>
        <button className="lang-btn" role="radio" aria-checked="false">EN</button>
        <button className="lang-btn" role="radio" aria-checked="false">ES</button>
      </div>
    );
  }

  return (
    <div className="lang-toggle" role="radiogroup" aria-label="Idioma">
      <button 
        className={`lang-btn ${lang === 'pt-BR' ? 'active' : ''}`} 
        onClick={() => changeLanguage('pt-BR')}
        role="radio" 
        aria-checked={lang === 'pt-BR'}
      >
        PT
      </button>
      <button 
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
        onClick={() => changeLanguage('en')}
        role="radio" 
        aria-checked={lang === 'en'}
      >
        EN
      </button>
      <button 
        className={`lang-btn ${lang === 'es' ? 'active' : ''}`} 
        onClick={() => changeLanguage('es')}
        role="radio" 
        aria-checked={lang === 'es'}
      >
        ES
      </button>
    </div>
  );
}
