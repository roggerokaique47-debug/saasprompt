import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'PromptHub — Biblioteca de Prompts para IA',
    template: '%s | PromptHub',
  },
  description:
    'Encontre, copie e baixe prompts prontos para ChatGPT, Claude, Gemini e mais. A maior biblioteca inteligente de prompts de IA.',
  keywords: [
    'prompts',
    'IA',
    'ChatGPT',
    'Claude',
    'Gemini',
    'biblioteca de prompts',
    'prompt library',
  ],
  openGraph: {
    title: 'PromptHub — Biblioteca de Prompts para IA',
    description:
      'Encontre, copie e baixe prompts prontos para ChatGPT, Claude, Gemini e mais.',
    siteName: 'PromptHub',
    locale: 'pt_BR',
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
      <body className={`${inter.variable} flex min-h-screen flex-col antialiased`}>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
