import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { LogoutButton } from './logout-button';
import { LogoLink } from './logo-link';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="topnav relative z-50">
      <div className="container topnav-inner flex items-center justify-between">
        <div className="brand">
          <LogoLink />
        </div>
        
        <nav className="nav-links hidden md:flex items-center gap-6 text-[14px] font-medium text-[var(--fg-secondary)]">
          <Link href="/workflows" className="transition-colors hover:text-[var(--fg)]">Workflows</Link>
          <Link href="/biblioteca" className="transition-colors hover:text-[var(--fg)]">Biblioteca</Link>
          <Link href="/integracoes" className="transition-colors hover:text-[var(--fg)]">Integrações</Link>
          <Link href="/preco" className="transition-colors hover:text-[var(--fg)]">Planos</Link>
        </nav>
        
        <div className="nav-actions flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-[var(--primary)]">Dashboard</Link>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white text-xs font-bold">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
