import { checkPurchase } from '@/features/purchase';
import { BuyButton } from './buy-button';

interface PremiumGateProps {
  contentType: 'prompt' | 'article' | 'workflow';
  contentId: string;
  priceCents: number;
  title: string;
  children: React.ReactNode;
}

export async function PremiumGate({
  contentType,
  contentId,
  priceCents,
  title,
  children,
}: PremiumGateProps) {
  const hasPurchased = await checkPurchase(contentType, contentId);

  if (hasPurchased || priceCents === 0) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none overflow-hidden blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-xl border-2 border-accent bg-accent/5 p-8 text-center">
          <h3 className="mb-2 text-xl font-bold">Conteúdo Premium</h3>
          <p className="mb-4 text-muted-foreground">
            Desbloqueie este conteúdo completo por apenas ${(priceCents / 100).toFixed(2)}
          </p>
          <BuyButton
            contentType={contentType}
            contentId={contentId}
            priceCents={priceCents}
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
