import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="space-y-1">
          <h2 className="mb-4 text-lg font-bold">Admin</h2>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Prompts', href: '/admin/prompts', icon: '🤖' },
  { label: 'Artigos', href: '/admin/artigos', icon: '📝' },
  { label: 'Workflows', href: '/admin/workflows', icon: '⚡' },
  { label: 'Categorias', href: '/admin/categorias', icon: '📁' },
  { label: 'Usuários', href: '/admin/usuarios', icon: '👥' },
  { label: 'Vendas', href: '/admin/vendas', icon: '💰' },
];
