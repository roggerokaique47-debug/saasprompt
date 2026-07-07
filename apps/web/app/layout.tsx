import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NovaFlow AI - Automatize sua Empresa com Inteligência Artificial',
  description: 'Crie workflows, instale automações prontas ou contrate Funcionários de IA em poucos minutos. A plataforma completa de automação para negócios.',
  keywords: ['automação', 'ia', 'workflow', 'agentes de ia', 'produtividade', 'novaflow', 'zapier alternative', 'n8n alternative'],
  authors: [{ name: 'NovaFlow AI Team' }],
  openGraph: {
    title: 'NovaFlow AI - Automatize qualquer processo da sua empresa',
    description: 'Economize horas e dinheiro com automações inteligentes. Comece grátis.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
