import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NavMenu } from './nav-menu';
import { LogoutButton } from './logout-button';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-xl font-bold text-primary">
            PromptHub
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavMenu />

            <Link
              href="/biblioteca?sort=newest"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Novidades
            </Link>

            <Link
              href="/biblioteca?isFeatured=true"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Em Destaque
            </Link>

            <Link href="/preco" className="text-sm text-muted-foreground hover:text-primary">
              Preços
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/admin"
                className="hidden text-sm text-muted-foreground hover:text-primary md:block"
              >
                Admin
              </Link>
              <span className="hidden text-sm text-muted-foreground md:block">
                {user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
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
                Cadastre-se Grátis
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
