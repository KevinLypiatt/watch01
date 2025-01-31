import { NavigationMenu } from "@/components/NavigationMenu";
import { HeroSection } from "@/components/HeroSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-soft-white">
      <NavigationMenu />
      <HeroSection />
      <ProductShowcase />
      <Footer />
    </div>
  );
};

export default Index;