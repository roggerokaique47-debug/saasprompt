import { Hero } from '@/components/landing/hero';
import { AiInput } from '@/components/landing/ai-input';
import { Categories } from '@/components/landing/categories';
import { AiEmployees } from '@/components/landing/ai-employees';
import { Marketplace } from '@/components/landing/marketplace';
import { WorkflowAICreator } from '@/components/workflow-ai-creator';
import { EditorPreview } from '@/components/landing/editor-preview';
import { Integrations } from '@/components/landing/integrations';
import { Stats } from '@/components/landing/stats';
import { Testimonials } from '@/components/landing/testimonials';
import { Pricing } from '@/components/landing/pricing';
import { Cta } from '@/components/landing/cta';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AiInput />
      <Categories />
      <AiEmployees />
      <Marketplace />

      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <WorkflowAICreator />
        </div>
      </section>

      <EditorPreview />
      <Integrations />
      <Stats />
      <Testimonials />
      <Pricing />
      <Cta />
    </main>
  );
}
