import Hero from "@/components/Hero";
import FeaturesCards from "@/components/FeaturesCards";
import StatsCounter from "@/components/StatsCounter";
import Reviews from "@/components/Reviews";
import FaqAccordion from "@/components/FaqAccordion";
import Newsletter from "@/components/Newsletter";
import FeaturedCareers from "@/components/features/FeaturedCareers";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCareers />
      <FeaturesCards />
      <StatsCounter />
      <Reviews />
      <FaqAccordion />
      <Newsletter />
    </>
  );
}
