import { Hero, Services, PortfolioPreview, ContactPreview } from '@/components/sections';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Services />
      <PortfolioPreview />
      <ContactPreview />
    </div>
  );
}
