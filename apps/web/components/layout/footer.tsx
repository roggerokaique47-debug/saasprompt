import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-primary">
              <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="currentColor"/>
                <path d="M10 22V10l6 6 6-6v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              NovaFlow AI
            </h3>
            <p className="text-sm text-muted-foreground">
              Plataforma de automação com IA para empresas. Crie workflows,
              instale automações prontas ou contrate Funcionários de IA.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/workflows" className="hover:text-primary">Workflows</Link></li>
              <li><Link href="/biblioteca" className="hover:text-primary">Biblioteca</Link></li>
              <li><Link href="/preco" className="hover:text-primary">Planos</Link></li>
              <li><Link href="/login" className="hover:text-primary">Entrar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Funcionalidades</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/workflows" className="hover:text-primary">Editor Visual</Link></li>
              <li><span className="cursor-pointer hover:text-primary">Marketplace</span></li>
              <li><span className="cursor-pointer hover:text-primary">Funcionários de IA</span></li>
              <li><span className="cursor-pointer hover:text-primary">Integrações</span></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-pointer hover:text-primary">Termos de Uso</span></li>
              <li><span className="cursor-pointer hover:text-primary">Privacidade</span></li>
              <li><span className="cursor-pointer hover:text-primary">Contato</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 NovaFlow AI. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
