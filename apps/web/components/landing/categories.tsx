import Link from 'next/link';
import { Mail, ShoppingCart, MessageSquare, Brain, Wallet, Users, Building, PenTool } from 'lucide-react';

const categories = [
  { icon: Mail, name: 'Marketing', desc: 'Automação de campanhas, e-mails e redes sociais', href: '/biblioteca/marketing' },
  { icon: ShoppingCart, name: 'E-commerce', desc: 'Gestão de vendas, estoque e pedidos', href: '/biblioteca/ecommerce' },
  { icon: MessageSquare, name: 'WhatsApp', desc: 'Atendimento automatizado e disparos', href: '/biblioteca/whatsapp' },
  { icon: Brain, name: 'IA & Agentes', desc: 'Agentes inteligentes e processamento de dados', href: '/biblioteca/ia' },
  { icon: Wallet, name: 'Financeiro', desc: 'Faturas, cobranças e conciliação', href: '/biblioteca/financeiro' },
  { icon: Users, name: 'RH', desc: 'Recrutamento, onboarding e avaliações', href: '/biblioteca/rh' },
  { icon: Building, name: 'Operações', desc: 'Soluções completas para o dia a dia', href: '/biblioteca/empresas' },
  { icon: PenTool, name: 'DevOps & Cloud', desc: 'CI/CD, Vercel, Cloudflare e AWS', href: '/workflows' },
];

export function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Categorias de Skills Populares</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Encontre a integração perfeita para o seu stack tecnológico
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group rounded-2xl border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
