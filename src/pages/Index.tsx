import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
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
    <div id="conteudo-principal" className="min-h-screen bg-background">
      <Header />
      <HeroSection />

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