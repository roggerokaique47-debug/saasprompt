import Link from 'next/link';
import { ArrowRight, BadgeCheck, Download, Star } from 'lucide-react';

const automations = [
  {
    name: 'Anthropic / PDF & Docs',
    rating: 4.9,
    installs: '12.5k',
    tag: 'Documentos',
    verified: true,
  },
  {
    name: 'Stripe / Best Practices',
    rating: 4.8,
    installs: '9.2k',
    tag: 'Pagamentos',
    verified: true,
  },
  {
    name: 'Vercel / Next.js Upgrade',
    rating: 4.9,
    installs: '15.1k',
    tag: 'Deploy',
    verified: true,
  },
  {
    name: 'Cloudflare / Workers SDK',
    rating: 4.8,
    installs: '11.3k',
    tag: 'Edge',
    verified: true,
  },
  {
    name: 'Hugging Face / Trainer',
    rating: 4.9,
    installs: '14.2k',
    tag: 'IA & ML',
    verified: true,
  },
  {
    name: 'Google / Gemini API Dev',
    rating: 4.9,
    installs: '22.1k',
    tag: 'GenAI',
    verified: true,
  },
  {
    name: 'Supabase / Postgres',
    rating: 4.9,
    installs: '18.4k',
    tag: 'Database',
    verified: true,
  },
  {
    name: 'Sentry / Fix Issues',
    rating: 4.8,
    installs: '10.5k',
    tag: 'Monitoramento',
    verified: true,
  },
];

export function Marketplace() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-5 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
            <BadgeCheck className="h-4 w-4 text-indigo-600" />
            Skills Oficiais Verificadas
          </div>
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            1497+ Skills Prontas para Instalar
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Instale habilidades das maiores empresas de tecnologia em 1 clique. Totalmente testadas e verificadas pela comunidade.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {automations.map((item) => (
            <div
              key={item.name}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {item.tag}
                </span>
                {item.verified && (
                  <BadgeCheck className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900 line-clamp-1">{item.name}</h3>
              <div className="mb-5 flex items-center gap-4 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {item.rating}
                </span>
                <span className="flex items-center gap-1.5">
                  <Download className="h-4 w-4 text-slate-400" />
                  {item.installs}
                </span>
              </div>
              <button className="w-full rounded-xl border-2 border-slate-100 bg-white py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-primary hover:bg-primary hover:text-white hover:shadow-md">
                Instalar Skill
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/workflows"
            className="group inline-flex items-center gap-2 text-base font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Explorar todas as 1497+ Skills
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
