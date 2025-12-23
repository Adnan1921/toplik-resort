import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import villa images
import plaviLotos from "@/assets/villas/plavi-lotos.png";
import bijeligJasmin from "@/assets/villas/bijeli-jasmin.png";
import crnaOrhideja from "@/assets/villas/crna-orhideja.png";
import crvenaMagnolija from "@/assets/villas/crvena-magnolija.png";
import zeleniTulipan from "@/assets/villas/zeleni-tulipan.png";
import vilaVranac from "@/assets/villas/vila-vranac.png";

interface Villa {
  id: number;
  type: string;
  name: string;
  price: string;
  checkIn: string;
  checkOut: string;
  breakfast: string;
  description: string;
  image: string;
  capacity: string;
  features: string[];
  href: string;
}

const villas: Villa[] = [
  {
    id: 1,
    type: "Apartman",
    name: "Plavi Lotos",
    price: "160,00 EUR",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08:00h - 10:00h",
    description: "Ova luksuzna, prostrana vila za odmor učiniće vaš boravak posebnim. Moderno osmišljen enterijer, sa velikim staklenim portalima, jacuzzijem, galerijom sa bračnim krevetom.",
    image: plaviLotos,
    capacity: "2-4 osobe",
    features: ["Jacuzzi", "Galerija", "Terasa", "Dvoriište"],
    href: "/apartmani#plavi-lotos"
  },
  {
    id: 2,
    type: "Apartman",
    name: "Bijeli Jasmin",
    price: "160,00 EUR",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08:00h - 10:00h",
    description: "Elegantan prostor sa modernim sadržajima i prelepim pogledom. Idealan za opuštajući odmor u prirodi.",
    image: bijeligJasmin,
    capacity: "2-4 osobe",
    features: ["Kamin", "Balkon", "Smart TV", "Kuhinja"],
    href: "/apartmani#bijeli-jasmin"
  },
  {
    id: 3,
    type: "Apartman",
    name: "Crna Orhideja",
    price: "180,00 EUR",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08:00h - 10:00h",
    description: "Luksuzni apartman sa ekskluzivnim sadržajima i vrhunskim komforom za nezaboravan boravak.",
    image: crnaOrhideja,
    capacity: "2-6 osoba",
    features: ["Jacuzzi", "Sauna", "Kamin", "Terasa"],
    href: "/apartmani#crna-orhideja"
  },
  {
    id: 4,
    type: "Apartman",
    name: "Crvena Magnolija",
    price: "160,00 EUR",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08:00h - 10:00h",
    description: "Šarmantna vila sa toplom atmosferom i svim potrebnim sadržajima za savršen porodični odmor.",
    image: crvenaMagnolija,
    capacity: "2-4 osobe",
    features: ["Kuhinja", "Terasa", "Parking", "WiFi"],
    href: "/apartmani#crvena-magnolija"
  },
  {
    id: 5,
    type: "Apartman",
    name: "Zeleni Tulipan",
    price: "160,00 EUR",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08:00h - 10:00h",
    description: "Udoban prostor okružen zelenilom, savršen za ljubitelje prirode i mira.",
    image: zeleniTulipan,
    capacity: "2-4 osobe",
    features: ["Bašta", "Roštilj", "Terasa", "Parking"],
    href: "/apartmani#zeleni-tulipan"
  },
  {
    id: 6,
    type: "Apartman",
    name: "Vila Vranac",
    price: "200,00 EUR",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08:00h - 10:00h",
    description: "Premium vila sa svim luksuznim sadržajima za najzahtevnije goste.",
    image: vilaVranac,
    capacity: "4-6 osoba",
    features: ["Jacuzzi", "Sauna", "Fitness", "Pool"],
    href: "/apartmani#vila-vranac"
  },
];

const VillasCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      skipSnaps: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background via-secondary/10 to-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-golden rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-golden/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-golden/20 to-green-accent/20 backdrop-blur-sm border border-golden/30">
            <Sparkles className="w-4 h-4 text-golden animate-pulse" />
            <p className="text-golden font-martel text-sm tracking-wider">PREMIUM SMJEŠTAJ</p>
            <Sparkles className="w-4 h-4 text-golden animate-pulse" />
          </div>
          <h2 className="font-clash-display text-4xl md:text-5xl lg:text-6xl font-medium text-green-accent mb-6">
            Naše Luksuzne Vile
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-martel text-lg">
            Izaberite savršenu vilu za vaš nezaboravan boravak
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {villas.map((villa, index) => (
                <div 
                  key={villa.id} 
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_70%] md:flex-[0_0_45%] lg:flex-[0_0_31%] pl-3 pr-3 lg:pl-4 lg:pr-4"
                >
                  <div className="relative h-[510px] lg:h-[560px] rounded-2xl overflow-hidden group transition-all duration-500">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={villa.image}
                        alt={villa.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Price Label - Top Left */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20">
                      <p className="text-white font-martel text-sm">
                        <span className="text-golden font-medium">{villa.price}</span>
                        <span className="text-white/60 text-xs ml-1">/ noć</span>
                      </p>
                    </div>
                    
                    {/* Capacity Label - Top Right */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20">
                      <p className="text-white font-martel text-sm">{villa.capacity}</p>
                    </div>
                    
                    {/* Lighter Gradient Overlay - Only at Bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                    
                    {/* Compact Glassmorphism Info Bar */}
                    <div className="absolute bottom-0 left-0 right-0 m-4 lg:m-6 p-4 lg:p-6 rounded-xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/30">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-golden/10 via-transparent to-green-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
                      
                      <div className="relative">
                        {/* Villa Info */}
                        <div>
                          <h3 className="text-golden font-martel text-2xl lg:text-3xl mb-3 transition-all duration-300">
                            {villa.name}
                          </h3>
                          
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {villa.features.slice(0, 4).map((feature, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-0.5 bg-gradient-to-r from-golden/15 to-green-accent/15 backdrop-blur-sm text-white text-xs font-martel rounded-full border border-white/20 hover:border-golden/50 transition-all duration-300"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          <Button asChild className="bg-gradient-to-r from-golden to-golden/80 hover:from-golden/90 hover:to-golden text-black font-martel text-sm h-10 lg:h-11 w-full shadow-lg shadow-golden/30 transition-all duration-300 group/btn hover:shadow-xl hover:shadow-golden/50 hover:scale-[1.02]">
                            <a href={villa.href}>
                              <span className="relative z-10">Rezerviši</span>
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 items-center justify-center text-golden hover:bg-golden/20 hover:border-golden/50 transition-all duration-300 hover:scale-110 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 items-center justify-center text-golden hover:bg-golden/20 hover:border-golden/50 transition-all duration-300 hover:scale-110 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {villas.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'w-8 bg-gradient-to-r from-golden to-green-accent' 
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VillasCarousel;
