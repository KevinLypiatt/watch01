import { NavigationMenu } from "@/components/NavigationMenu";
import { HeroSection } from "@/components/HeroSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { MigrationTrigger } from "@/components/MigrationTrigger";

const Index = () => {
  return (
    <div className="min-h-screen bg-soft-white">
      <NavigationMenu />
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-center">
            <MigrationTrigger />
          </div>
        </div>
      </div>
      <HeroSection />
      <ProductShowcase />
      <Footer />
    </div>
  );
};

export default Index;