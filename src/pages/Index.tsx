import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MinistriesSection from "@/components/MinistriesSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import PrayerRequestSection from "@/components/PrayerRequestSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutSection />
      <MinistriesSection />
      <GallerySection />
      <ContactSection />
      <PrayerRequestSection />
      <Footer />
    </div>
  );
};

export default Index;
