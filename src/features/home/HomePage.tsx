import { Reveal } from '../../components/Reveal';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { NoticeStrip } from './components/NoticeStrip';
import { Catalog } from './components/Catalog';
import { Brands } from './components/Brands';
import { ImportBanner } from './components/ImportBanner';
import { Testimonials } from './components/Testimonials';
import { Benefits } from './components/Benefits';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsappButton } from './components/WhatsappButton';

export function HomePage() {
  return (
    <div className="min-h-screen bg-canvas text-fg">
      <Header />
      <Hero />
      <Reveal>
        <StatsBar />
      </Reveal>
      <NoticeStrip />
      <Reveal>
        <Catalog />
      </Reveal>
      <Reveal>
        <Brands />
      </Reveal>
      <Reveal>
        <ImportBanner />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Benefits />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
      <Footer />
      <WhatsappButton />
    </div>
  );
}