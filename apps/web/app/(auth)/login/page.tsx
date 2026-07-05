import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Entrar',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold">Entrar</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Acesse sua conta PromptHub
        </p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem conta?{' '}
          <a href="/cadastro" className="text-primary hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </main>
  );
}
