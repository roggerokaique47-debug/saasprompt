import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ParticleBackground } from '@/components/particle-background';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ParticleBackground />
      <Header />
      <div className="flex-1 relative z-10">{children}</div>
      <Footer />
    </>
  );
}
