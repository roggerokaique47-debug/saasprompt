export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Página não encontrada
      </p>
      <a
        href="/"
        className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
      >
        Voltar ao Início
      </a>
    </main>
  );
}
