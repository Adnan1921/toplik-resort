import { Header } from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import VideoSection from "@/components/VideoSection";
import AboutSection from "@/components/AboutSection";
import EVChargingSection from "@/components/EVChargingSection";
import AwardsCarousel from "@/components/AwardsCarousel";
import DynamicApartmentsCarousel from "@/components/DynamicApartmentsCarousel";
import ToplikTimeline from "@/components/ToplikTimeline";
import CommunitySection from "@/components/CommunitySection";
import TestimonialSlider from "@/components/ui/testimonial-slider";
import ReservationForm from "@/components/ReservationForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Header />
      <main>
        <HeroBanner />
        <VideoSection />
        <AboutSection />
        <AwardsCarousel />
        <DynamicApartmentsCarousel />
        <ToplikTimeline />
        <CommunitySection />
        <EVChargingSection />
        <TestimonialSlider />
        <div id="rezervacija">
          <ReservationForm />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Index;
