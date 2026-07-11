export function CaseStudies() {
  const cases = [
    {
      company: 'Agência de Marketing XPTO',
      metric: '85h economizadas',
      result: 'Reduzimos o tempo de qualificação de leads em 90% usando o Funcionario de Vendas IA.',
    },
    {
      company: 'E-commerce Moda Rápida',
      metric: '300% ROI',
      result: 'Atendimento 24/7 automático no WhatsApp, dobrando as vendas fora do horário comercial.',
    },
    {
      company: 'Escritório de Advocacia Legal',
      metric: 'R$ 15.000/mês',
      result: 'Economia com a automação de leitura de processos usando GPT-4 e webhook.',
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Estudos de Caso</h2>
          <p className="mt-4 text-muted-foreground">Resultados reais de empresas que usam NovaFlow AI.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {cases.map((c, i) => (
            <div key={i} className="rounded-2xl border border-border bg-slate-50 p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-green-100 px-4 py-1 text-sm font-bold text-green-700">
                {c.metric}
              </div>
              <h3 className="mb-3 text-xl font-bold">{c.company}</h3>
              <p className="text-muted-foreground">{c.result}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
