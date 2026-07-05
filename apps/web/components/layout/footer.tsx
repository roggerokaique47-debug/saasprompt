import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-primary">PromptHub</h3>
            <p className="text-sm text-muted-foreground">
              Sua biblioteca inteligente de prompts de IA. Milhares de prompts
              testados e prontos para usar.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Navegar</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/biblioteca" className="hover:text-primary">Biblioteca</Link></li>
              <li><Link href="/preco" className="hover:text-primary">Planos</Link></li>
              <li><Link href="/login" className="hover:text-primary">Entrar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Categorias</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/biblioteca/${cat.slug}`}
                    className="hover:text-primary"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-primary cursor-pointer">Termos de Uso</span></li>
              <li><span className="hover:text-primary cursor-pointer">Privacidade</span></li>
              <li><span className="hover:text-primary cursor-pointer">Contato</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 PromptHub. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}

const footerCategories = [
  { name: 'Marketing', slug: 'marketing', icon: '📢' },
  { name: 'Programação', slug: 'programacao', icon: '💻' },
  { name: 'Design', slug: 'design', icon: '🎨' },
  { name: 'Educação', slug: 'educacao', icon: '📚' },
  { name: 'Negócios', slug: 'negocios', icon: '💼' },
  { name: 'Criação', slug: 'criacao-conteudo', icon: '✍️' },
];
