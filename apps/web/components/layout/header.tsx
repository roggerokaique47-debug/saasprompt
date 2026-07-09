import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NavMenu } from './nav-menu';
import { LogoutButton } from './logout-button';

import { Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold text-primary">
            <div className="flex items-center justify-center rounded-lg bg-primary p-1">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            NovaFlow AI
          </Link>

          <nav className="hidden items-center gap-4 lg:gap-6 md:flex shrink-0">
            <NavMenu />

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/workflows/meus"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Meus Workflows
                </Link>
              </>
            )}

            <Link href="/preco" className="text-sm text-muted-foreground hover:text-primary">
              Preços
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/admin"
                className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:block"
              >
                Admin
              </Link>
              
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-foreground leading-tight max-w-[120px] lg:max-w-[150px] truncate" title={user.email}>
                    {user.email?.split('@')[0] || 'Usuário'}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Plano Pro
                  </span>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm ring-2 ring-background">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-1">
                  <LogoutButton />
                </div>
              </div>
            </div>
          ) : (
            <>
              <ThemeToggle />
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Começar Grátis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
