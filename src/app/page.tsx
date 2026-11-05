import { DealSheet, DealsMarquee, DealsSection } from "@/features/deals";
import { Hero } from "@/features/hero";
import { CategoryShowcase } from "@/features/menu";
import { StudioSection } from "@/features/pizza-builder";
import { VisitSection } from "@/features/visit";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DealsMarquee />
      <DealsSection />
      <StudioSection />
      <CategoryShowcase />
      <VisitSection />
      <DealSheet />
    </>
  );
}
