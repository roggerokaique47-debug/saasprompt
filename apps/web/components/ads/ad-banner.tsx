export function AdBanner({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-border bg-muted/30 py-8 text-center ${className ?? ''}`}
    >
      <div className="text-sm text-muted-foreground">
        <p className="text-xs uppercase tracking-wide">Publicidade</p>
        <p className="mt-1">Anúncio AdSense</p>
      </div>
    </div>
  );
}

export function AdNative({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground ${className ?? ''}`}
    >
      <p className="mb-1 text-xs uppercase tracking-wide">Conteúdo Patrocinado</p>
      <p>Aprenda a criar automações com n8n — curso completo</p>
    </div>
  );
}

export function AdSidebar({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-border bg-muted/30 py-12 text-center ${className ?? ''}`}
    >
      <div className="text-sm text-muted-foreground">
        <p className="text-xs uppercase tracking-wide">Ad</p>
        <p className="mt-1">Anúncio</p>
      </div>
    </div>
  );
}
