import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Comunidade',
  description: 'Participe da comunidade PromptHub. Compartilhe, venda e aprenda.',
};

export default function ComunidadePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">🌍 Comunidade</h1>
        <p className="mt-2 text-muted-foreground">
          Compartilhe seu conhecimento, venda seus conteúdos e aprenda com outros criadores
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-border bg-white p-6 text-center transition hover:border-primary hover:shadow-md"
          >
            <div className="mb-4 text-4xl">{card.icon}</div>
            <h3 className="mb-2 font-semibold group-hover:text-primary">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-xl border border-border bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold">📊 Ranking de Criadores</h2>
        <p className="text-muted-foreground">
          Em breve — criadores com mais downloads, vendas e contribuições aparecerão aqui.
        </p>
      </section>
    </main>
  );
}

const cards = [
  {
    icon: '🤖',
    title: 'Enviar Prompt',
    desc: 'Compartilhe seus prompts com a comunidade',
    href: '/admin/prompts/novo',
  },
  {
    icon: '⚡',
    title: 'Publicar Workflow',
    desc: 'Compartilhe automações n8n prontas',
    href: '/workflows/novo',
  },
  {
    icon: '📝',
    title: 'Escrever Artigo',
    desc: 'Publique tutoriais, guias e documentação',
    href: '/artigos/novo',
  },
  {
    icon: '💰',
    title: 'Vender Conteúdo',
    desc: 'Defina preços e lucre com seus conteúdos premium',
    href: '/comunidade',
  },
  {
    icon: '📈',
    title: 'Dashboard',
    desc: 'Acompanhe suas vendas e métricas',
    href: '/admin',
  },
  {
    icon: '🎓',
    title: 'Aprender',
    desc: 'Tutoriais e guias para criar melhores conteúdos',
    href: '/artigos?type=tutorial',
  },
];
