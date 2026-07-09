import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// Imports removed
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'NovaFlow AI — Plataforma de Automação com IA',
    template: '%s | NovaFlow AI',
  },
  description:
    'Automatize qualquer processo da sua empresa com IA. Crie workflows, instale automações prontas ou contrate Funcionários de IA em poucos minutos.',
  keywords: [
    'automação', 'IA', 'workflows', 'n8n', 'zapier',
    'funcionários de IA', 'automação empresarial', 'NovaFlow',
    'agentes de ia', 'produtividade',
  ],
  authors: [{ name: 'NovaFlow AI Team' }],
  openGraph: {
    title: 'NovaFlow AI — Automatize qualquer processo da sua empresa',
    description:
      'Economize horas e dinheiro com automações inteligentes. Crie workflows, instale automações prontas ou contrate Funcionários de IA.',
    siteName: 'NovaFlow AI',
    locale: 'pt_BR',
    type: 'website',
  },
};

import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} flex min-h-screen flex-col antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
