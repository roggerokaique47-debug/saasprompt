import Link from 'next/link';

const employeeGradients = [
  'linear-gradient(135deg, #8B5CF6, #7C3AED)',
  'linear-gradient(135deg, #10B981, #0D9488)',
  'linear-gradient(135deg, #F97316, #DC2626)',
  'linear-gradient(135deg, #3B82F6, #4F46E5)',
  'linear-gradient(135deg, #EC4899, #E11D48)',
  'linear-gradient(135deg, #06B6D4, #2563EB)',
];

const employees = [
  {
    role: 'SDR IA',
    desc: 'Qualifica leads, agenda reuniões e nutre relacionamentos automaticamente.',
    gradient: employeeGradients[0],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
  {
    role: 'Atendente IA',
    desc: 'Responde clientes 24/7 em WhatsApp, chat e e-mail com conhecimento da sua empresa.',
    gradient: employeeGradients[1],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    ),
  },
  {
    role: 'Marketing IA',
    desc: 'Cria conteúdos, gerencia campanhas e otimiza anúncios automaticamente.',
    gradient: employeeGradients[2],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    ),
  },
  {
    role: 'Financeiro IA',
    desc: 'Concilia transações, envia cobranças e gera relatórios financeiros.',
    gradient: employeeGradients[3],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    role: 'RH IA',
    desc: 'Triagem de currículos, agendamento de entrevistas e onboarding.',
    gradient: employeeGradients[4],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    role: 'E-commerce IA',
    desc: 'Gestão de produtos, pedidos, estoque e suporte ao cliente.',
    gradient: employeeGradients[5],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    ),
  },
];

export function AiEmployees() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Funcionários de IA
          </div>
          <h2 className="mb-3 text-3xl font-bold">
            Contrate Funcionários de IA
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Especialistas virtuais prontos para trabalhar 24/7 na sua empresa.
            Cada um treinado para uma função específica.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp) => (
            <div
              key={emp.role}
              className="group relative overflow-hidden rounded-xl border border-border bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-gradient-to-br opacity-5 transition group-hover:opacity-10" />
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white shadow-sm"
                style={{ background: emp.gradient }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {emp.icon}
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{emp.role}</h3>
              <p className="mb-4 text-sm text-muted-foreground">{emp.desc}</p>
              <Link
                href="/cadastro"
                className="text-sm font-medium text-primary hover:underline"
              >
                Contratar →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
