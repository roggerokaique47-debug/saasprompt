const testimonials = [
  {
    quote: 'Reduzimos nosso tempo de resposta no WhatsApp de 2 horas para 30 segundos com o Atendente IA.',
    author: 'Carlos Silva',
    role: 'CEO, TechStore Brasil',
    rating: 5,
  },
  {
    quote: 'O editor visual é incrível. Montei um workflow completo de CRM em menos de 10 minutos sem escrever uma linha de código.',
    author: 'Ana Oliveira',
    role: 'Head de Marketing, DigitalBoost',
    rating: 5,
  },
  {
    quote: 'Economizamos mais de R$ 15 mil por mês automatizando nosso financeiro. O ROI foi imediato.',
    author: 'Ricardo Mendes',
    role: 'CFO, InovaCorp',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold">
            Quem usa recomenda
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Mais de 500 empresas já transformaram seus processos com NovaFlow AI.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="rounded-xl border border-border bg-white p-6"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="text-sm font-semibold">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
