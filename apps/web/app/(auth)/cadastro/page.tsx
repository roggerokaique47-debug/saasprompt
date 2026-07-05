import type { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/signup-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Criar Conta',
};

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">Criar Conta</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Crie sua conta gratuita no PromptHub
        </p>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <a href="/login" className="text-primary hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </main>
  );
}
