import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LiveCountdown from "@/components/LiveCountdown";
import AboutSection from "@/components/AboutSection";
import MinistriesSection from "@/components/MinistriesSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import PrayerRequestSection from "@/components/PrayerRequestSection";
import Footer from "@/components/Footer";

const SectionDivider = () => (
  <div className="relative h-16 sm:h-20 overflow-hidden bg-background">
    <div className="absolute inset-0 arch-divider" />
  </div>
);

const AltSectionDivider = () => (
  <div className="relative h-16 sm:h-20 overflow-hidden bg-secondary">
    <div className="absolute inset-0 arch-divider-alt" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <section className="relative z-20 -mt-16 pb-8">
        <div className="container-church px-4">
          <div className="max-w-lg mx-auto bg-card/90 backdrop-blur-md rounded-xl p-5 shadow-md border border-border/40">
            <LiveCountdown />
          </div>
        </div>
      </section>

      <AltSectionDivider />
      <AboutSection />
      <SectionDivider />
      <MinistriesSection />
      <AltSectionDivider />
      <GallerySection />
      <SectionDivider />
      <ContactSection />
      <AltSectionDivider />
      <PrayerRequestSection />
      <SectionDivider />
      <Footer />
    </div>
  );
};

export default Index;