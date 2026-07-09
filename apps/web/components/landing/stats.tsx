import { Box, Code2, Globe, Users } from 'lucide-react';

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#0A0A0B] py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: '1497+', label: 'Agent Skills', desc: 'Prontas para uso', icon: <Box className="h-6 w-6 text-primary" /> },
            { value: '60+', label: 'Empresas Oficiais', desc: 'Stripe, Vercel, Google...', icon: <Globe className="h-6 w-6 text-secondary" /> },
            { value: '10K+', label: 'Desenvolvedores', desc: 'Construindo com IA', icon: <Users className="h-6 w-6 text-indigo-400" /> },
            { value: '100%', label: 'Open Source', desc: 'Acesso total ao código', icon: <Code2 className="h-6 w-6 text-emerald-400" /> },
          ].map((stat) => (
            <div key={stat.label} className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 shadow-inner">
                  {stat.icon}
                </div>
                <div className="animate-count-up text-4xl font-extrabold md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-3 text-lg font-semibold text-slate-200">{stat.label}</div>
                <div className="mt-1 text-sm text-slate-400">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
