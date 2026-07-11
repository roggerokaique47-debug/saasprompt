import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
// Imports removed
import './globals.css';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-display',
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
import { FadeUpObserver } from '@/components/fade-up-observer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Script do PostHog usando next/script para evitar erros no React: */}
        {/* <Script id="posthog" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],...);}` }} /> */}
      </head>
      <body className={`${inter.variable} ${lora.variable} flex min-h-screen flex-col antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="original"
          enableSystem={false}
          themes={['original', 'claro', 'escuro']}
          disableTransitionOnChange
        >
          <FadeUpObserver />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
