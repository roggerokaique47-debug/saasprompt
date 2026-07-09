export function EditorPreview() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Editor Visual
          </div>
          <h2 className="mb-3 text-3xl font-bold">
            Arraste e conecte seus fluxos
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Crie automações poderosas com nosso editor visual drag & drop.
            Conecte APIs, bancos de dados e serviços em minutos.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-error" />
            <span className="h-3 w-3 rounded-full bg-warning" />
            <span className="h-3 w-3 rounded-full bg-success" />
            <span className="ml-4 text-xs text-muted-foreground">Novo Workflow — Editor Visual</span>
          </div>

          <div className="grid grid-cols-[200px_1fr]">
            <div className="border-r border-border bg-muted/10 p-4">
              <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Nodes
              </div>
              {['Webhook', 'OpenAI', 'Google Sheets', 'WhatsApp', 'Slack', 'E-mail', 'Filtro', 'Delay'].map((node) => (
                <div
                  key={node}
                  className="mb-1 flex cursor-grab items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                >
                  <div className="h-2 w-2 rounded-full bg-primary/60" />
                  {node}
                </div>
              ))}
            </div>

            <div className="relative flex h-[400px] items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-primary bg-white shadow-lg">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-secondary bg-white shadow-lg">
                      <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-amber-500 bg-white shadow-lg">
                      <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-6 text-center sm:grid-cols-3">
          {[
            { value: '100+', label: 'Templates prontos' },
            { value: '250+', label: 'Nodes disponíveis' },
            { value: '80+', label: 'Integrações nativas' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-white p-6">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
