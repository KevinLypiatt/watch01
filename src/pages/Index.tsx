import { NavigationMenu } from "@/components/ui/navigation-menu";
import { HeroSection } from "@/components/HeroSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { FeatureCard } from "@/components/FeatureCard";
import { Footer } from "@/components/Footer";
import { MigrationTrigger } from "@/components/MigrationTrigger";

const Index = () => {
  return (
    <div className="min-h-screen bg-soft-white">
      <NavigationMenu />
      <HeroSection />
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-center">
            <MigrationTrigger />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Thoughtful Design",
                description:
                  "Every detail carefully considered for the perfect experience.",
                icon: "✧",
              },
              {
                title: "Premium Quality",
                description:
                  "Crafted with the finest materials and attention to detail.",
                icon: "◆",
              },
              {
                title: "Lasting Impact",
                description:
                  "Created to stand the test of time, both in style and function.",
                icon: "○",
              },
            ].map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
      <ProductShowcase />
      <Footer />
    </div>
  );
};

export default Index;