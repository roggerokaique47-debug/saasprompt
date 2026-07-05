import Link from 'next/link';

export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <nav className="space-y-1">
          <h2 className="mb-4 text-lg font-bold">Painel do Criador</h2>
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
  { label: 'Resumo', href: '/dashboard/criador', icon: '📊' },
  { label: 'Vendas', href: '/dashboard/criador/vendas', icon: '💰' },
  { label: 'Pagamentos', href: '/dashboard/criador/pagamentos', icon: '💳' },
];
