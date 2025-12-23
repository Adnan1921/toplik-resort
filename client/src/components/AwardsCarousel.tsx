import { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import trophyIcon from "@/assets/nagrade/trophy.svg";
import destinationSarajevo from "@/assets/nagrade/destination-sarajevo.png";
import inhoreca from "@/assets/nagrade/inhoreca.png";
import zoriciJovancic from "@/assets/nagrade/zorici-jovancic.png";
import restaurantGuru from "@/assets/nagrade/restaurant-guru.png";
import hubih from "@/assets/nagrade/hubih.png";
import zlatnaKruna from "@/assets/nagrade/zlatna-kruna.png";

const awards = [
  { id: 1, image: zlatnaKruna, alt: "Zlatna Ugostiteljska Kruna 2008" },
  { id: 2, image: zoriciJovancic, alt: "Priznanje Zorici Jovančić" },
  { id: 3, image: destinationSarajevo, alt: "Destination Sarajevo Partners Club" },
  { id: 4, image: inhoreca, alt: "INHORECA 2018" },
  { id: 5, image: restaurantGuru, alt: "Restaurant Guru 2020 Best Service" },
  { id: 6, image: hubih, alt: "HUBiH Magazine" },
];

const AwardsCarousel = () => {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section className="relative py-16 md:py-24">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-golden rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-accent rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Title with Trophy Icons */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12 md:mb-16 px-4">
          <img 
            src={trophyIcon} 
            alt="Trophy" 
            className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 opacity-50 animate-pulse"
          />
          <h2 className="font-clash-display text-2xl md:text-3xl lg:text-[40px] font-medium text-green-accent text-center leading-[150%]">
            Zahvalnice i Nagrade
          </h2>
          <img 
            src={trophyIcon} 
            alt="Trophy" 
            className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 opacity-50 animate-pulse"
          />
        </div>

        {/* Full Width Carousel - No Horizontal Padding */}
        <div className="w-full overflow-visible">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full overflow-visible"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-2 md:-ml-4 overflow-visible">
              {awards.map((award, index) => (
                <CarouselItem 
                  key={award.id} 
                  className="pl-2 md:pl-4 basis-[85%] sm:basis-[45%] md:basis-[35%] lg:basis-[28%] xl:basis-[22%]"
                >
                  <div 
                    className="group relative py-12 px-4 md:px-6"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Image Container with Fixed Aspect Ratio */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded border border-golden bg-white shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-golden/40 group-hover:scale-[1.03] group-hover:-translate-y-1 group-hover:border-golden/80">
                      <img
                        src={award.image}
                        alt={award.alt}
                        className="w-full h-full object-contain p-2"
                        loading="lazy"
                      />
                      
                      {/* Shine Effect on Hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-golden/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Buttons with Custom Styling */}
            <CarouselPrevious className="hidden lg:flex left-4 h-12 w-12 border-2 border-golden bg-white/90 hover:bg-golden hover:text-white transition-all duration-300 shadow-lg z-10" />
            <CarouselNext className="hidden lg:flex right-4 h-12 w-12 border-2 border-golden bg-white/90 hover:bg-golden hover:text-white transition-all duration-300 shadow-lg z-10" />
          </Carousel>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center gap-2 mt-8 lg:hidden">
          <div className="w-2 h-2 rounded-full bg-golden animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-golden/50 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 rounded-full bg-golden/30 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </section>
  );
};

export default AwardsCarousel;
