import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Stats } from '@/components/landing/stats';
import { Features } from '@/components/landing/features';
import { Pricing } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0A0F1E]">
      <div className="bg-grid">
        <Header />
        <Hero />
        <Stats />
        <Features />
        <Pricing />
        <Footer />
      </div>
    </div>
  );
}
