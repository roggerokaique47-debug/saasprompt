'use client';

import Link from 'next/link';
import Image from 'next/image';

export function LogoLink() {
  const handleClick = (e: React.MouseEvent) => {
    // Se já estiver na página inicial, apenas rola para o topo suavemente
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Link 
      href="/" 
      onClick={handleClick} 
      className="logo flex items-center gap-2 text-[19px] font-bold tracking-tight" 
      style={{ fontFamily: 'var(--font-display)' }}
    >
      <Image 
        src="/logo.png" 
        alt="NovaFlow AI" 
        width={160} 
        height={40} 
        className="object-contain" 
        priority 
      />
    </Link>
  );
}
