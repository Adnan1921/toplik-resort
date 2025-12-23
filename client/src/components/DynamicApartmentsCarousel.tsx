import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Fallback image
import plaviLotosImage from "@/assets/plavi-lotos-interior.png";

interface Apartment {
  id: string;
  slug: string;
  type: string;
  name: string;
  description: string;
  check_in: string;
  check_out: string;
  breakfast: string;
  price: string | null;
  capacity: string | null;
  amenities: string[];
  is_published: boolean;
  display_order: number;
  featured_image_url: string | null;
}

const DynamicApartmentsCarousel = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Load apartments from Supabase
  useEffect(() => {
    const loadApartments = async () => {
      try {
        const { data, error } = await supabase
          .from('apartments')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error loading apartments:', error);
          toast.error('Greška pri učitavanju apartmana');
        } else if (data) {
          setApartments(data);
        }
      } catch (error) {
        console.error('Error loading apartments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApartments();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  if (loading) {
    return (
      <section className="w-full py-8 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">Učitavanje apartmana...</p>
        </div>
      </section>
    );
  }

  if (apartments.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 lg:py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Heading Section - from Figma */}
        <div className="flex flex-col lg:flex-row lg:gap-[115px] mb-12 lg:mb-16">
          {/* Left - Heading */}
          <div className="lg:w-[577px] lg:flex-shrink-0 mb-6 lg:mb-0">
            <h2 className="font-clash-display font-normal text-primary text-[36px] lg:text-[64px] leading-[150%]">
              Dobrodošli u Toplik Village Resort – Vaš miran kutak nadomak Sarajeva
            </h2>
          </div>
          
          {/* Right - Description */}
          <div className="lg:w-[676px]">
            <p className="font-martel text-body-text text-base leading-[170%]">
              Smješten u netaknutoj prirodi, svega nekoliko minuta vožnje od centra Sarajeva, Toplik Village Resort nalazi se na porodičnom imanju porodice Jovančić. Ovaj pažljivo osmišljen kompleks idealno je mjesto za bijeg od svakodnevne užurbanosti, nudeći savršen spoj udobnosti, luksuza i prirodnog mira. Iako okružen prirodom i izolovan od gradske gužve, Resort je odlično povezan – udaljen je samo 10 minuta od centra Sarajeva, 6 km od Međunarodnog aerodroma Sarajevo i 20 km od olimpijske ljepotice Jahorine.
            </p>
            <p className="font-martel text-body-text text-base leading-[170%] mt-4">
              Zahvaljujući ovoj lokaciji, gosti mogu lako kombinovati opuštanje u prirodi s gradskim sadržajima i planinskim avanturama. Toplik Village Resort obuhvata sedam luksuznih vila, od kojih se Villa Vranac i Villa Jovančić ističu kao porodične vile s wellness sadržajima za potpuno opuštanje. Srce Resorta čini restoran s više od 27 godina tradicije, smješten uz ribnjake – inspiraciju cijelog Toplik koncepta.
            </p>
            <p className="font-martel text-body-text text-base leading-[170%] mt-4">
              Gosti mogu uživati u nizu dodatnih sadržaja: prodavnici domaćih proizvoda, elegantnom wine & cigar loungeu, te dječjem igralištu za najmlađe. Šetnje kroz prirodu i tematske staze omogućavaju potpuno povezivanje s okruženjem i savršen su izbor za sve uzraste.
              Rezervišite svoju vilu i priuštite sebi trenutke mira i luksuza.
              Dobro došli!
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {apartments.map((apartment) => {
              // Use featured image if available, otherwise use fallback
              const imageUrl = apartment.featured_image_url || plaviLotosImage;
              
              console.log('Apartment:', apartment.name, 'Image URL:', imageUrl); // Debug log
              
              return (
                <div 
                  key={apartment.id} 
                  className="flex-none w-[85%] lg:w-[45%] xl:w-[32%] min-w-0 pl-4 first:pl-4"
                >
                  {/* Card */}
                  <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl group">
                    {/* Background Image */}
                    <img 
                      src={imageUrl}
                      alt={apartment.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        e.currentTarget.src = plaviLotosImage;
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      {/* Glassmorphism card - simplified */}
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30">
                        {/* Type Badge */}
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-serif rounded-full mb-3">
                          {apartment.type}
                        </span>
                        
                        {/* Apartment Name */}
                        <h3 className="font-serif font-semibold text-2xl text-white mb-4">
                          {apartment.name}
                        </h3>
                        
                        {/* CTA Button */}
                        <a 
                          href={`/apartmani/${apartment.slug}`}
                          className="group/btn inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg w-full justify-center transition-all duration-300 hover:bg-accent hover:text-white"
                        >
                          <span className="font-clash-grotesk font-semibold text-sm text-primary group-hover/btn:text-white">
                            Rezerviši apartman
                          </span>
                          <ArrowRight className="w-4 h-4 text-primary group-hover/btn:text-white transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows - Desktop */}
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-stroke-color items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-stroke-color items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {apartments.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'w-8 bg-accent' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicApartmentsCarousel;

