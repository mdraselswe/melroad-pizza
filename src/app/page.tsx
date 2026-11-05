import { DealSheet, DealsMarquee, DealsSection } from "@/features/deals";
import { Hero } from "@/features/hero";
import { StudioSection } from "@/features/pizza-builder";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DealsMarquee />
      <DealsSection />
      <StudioSection />
      <DealSheet />
    </>
  );
}
