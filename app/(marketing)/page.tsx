import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Stats } from '@/components/landing/stats';
import { Features } from '@/components/landing/features';
import { Pricing } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
