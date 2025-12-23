import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import TestimonialSlider from "@/components/ui/testimonial-slider";
import { Star, ArrowRight } from "lucide-react";
import toplikLogoGolden from "@/assets/toplik-logo-golden.svg";
import { supabase } from "@/lib/supabase";
import plaviLotosImage from "@/assets/plavi-lotos-interior.png";
import bijeliJasminImage from "@/assets/bijeli-jasmin-bedroom.png";
import crvenaMagnolijaImage from "@/assets/crvena-magnolija.png";
import crnaOrhidejaImage from "@/assets/crna-orhideja.png";
import zeleniTulipanImage from "@/assets/zeleni-tulipan.png";
import zlatnaBrezaImage from "@/assets/zlatna-breza.png";
import divljaTresnjaImage from "@/assets/divlja-tresnja.png";
import vranacApartman1Image from "@/assets/vranac-apartman-1.png";
import vranacApartman2Image from "@/assets/vranac-apartman-2.png";
import copperSuiteImage from "@/assets/copper-suite.jpg";
import goldenSuiteImage from "@/assets/golden-suite.jpg";
import useEmblaCarousel from "embla-carousel-react";

// Toggle between carousel and scroll view for mobile
// Set to true for carousel, false for scroll
const USE_MOBILE_CAROUSEL = true;

// Apartman data type (from Supabase)
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

// Legacy apartman data type (for fallback)
interface ApartmanData {
  type: string; // "Vila" or "Apartman"
  name: string;
  checkIn: string;
  checkOut: string;
  breakfast: string;
  description: string;
  image: string;
  slug: string;
}

// Hero background - aerial view of villas
const heroImageUrl = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/f5324bf6-40f0-4cf3-9ac2-28b13607b15c";

// Sample apartman data - Plavi Lotos
const plaviLotosData: ApartmanData = {
  type: "Vila",
  name: "Plavi Lotos",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Ova luksuzna, prostrana vila za odmor učiniće vaš boravak posebnim. Moderno osmišljen enterijer, sa velikim staklenim portalima, jacuzzijem, galerijom sa bračnim krevetom, ono je što će vas zasigurno osvojiti i olakšati vam izbor vaše savršene destinacije za odmor. Namijenjena je za boravak 2-4 osobe i sadrži galeriju sa velikim bračnim krevetom i krevet na razvlačenje u dnevnom boravku. Terasa ispred vile sa velikim dvorištem idealna je za uživanje u jutarnjoj kafi.",
  image: plaviLotosImage,
  slug: "plavi-lotos"
};

// Sample apartman data - Bijeli Jasmin
const bijeliJasminData: ApartmanData = {
  type: "Apartman",
  name: "Bijeli Jasmin",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Apartman Bijeli Jasmin pruža savršen spoj udobnosti i elegancije. Prostrani interijer sa toplim drvenim detaljima, udobnim bračnim krevetom i pogledom na okolnu prirodu čini ga idealnim izborom za romantični bijeg ili mirno opuštanje. Apartman je opremljen svim potrebnim sadržajima za ugodan boravak.",
  image: bijeliJasminImage,
  slug: "bijeli-jasmin"
};

// Sample apartman data - Crvena Magnolija
const crvenaMagnolijaData: ApartmanData = {
  type: "Vila",
  name: "Crvena Magnolija",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Vila Crvena Magnolija nudi jedinstveno iskustvo boravka u prirodi. Sa prostornom dnevnom sobom, luksuznim kupatilom i privatnom terasom, ova vila je idealna za porodice ili grupe prijatelja. Elegantni dizajn i pažnja posvećena detaljima čine svaki trenutak posebnim.",
  image: crvenaMagnolijaImage,
  slug: "crvena-magnolija"
};

// Sample apartman data - Crna Orhideja
const crnaOrhidejaData: ApartmanData = {
  type: "Apartman",
  name: "Crna Orhideja",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Apartman Crna Orhideja kombinuje moderan dizajn sa toplinom doma. Prostrani interijer, udoban namještaj i pogled na okolnu prirodu čine ga savršenim mjestom za odmor. Apartman je idealan za parove koji traže mir i intimnost.",
  image: crnaOrhidejaImage,
  slug: "crna-orhideja"
};

// Sample apartman data - Zeleni Tulipan
const zeleniTulipanData: ApartmanData = {
  type: "Vila",
  name: "Zeleni Tulipan",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Vila Zeleni Tulipan je savršen izbor za one koji cijene prostor i luksuz. Sa velikim dnevnim boravkom, potpuno opremljenom kuhinjom i prostranom spavaćom sobom, ova vila pruža sve što vam je potrebno za nezaboravan boravak. Terasa sa pogledom na vrt idealna je za opuštanje.",
  image: zeleniTulipanImage,
  slug: "zeleni-tulipan"
};

// Vila Jovančić Apartments
const zlatnaBrezaData: ApartmanData = {
  type: "Apartman",
  name: "Zlatna Breza",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Apartman Zlatna Breza odiše toplinom i elegancijom. Prostrani interijer sa drvenim gredama na stropu, udobnim bračnim krevetom i modernim kupatilom pruža savršen ambijent za opuštanje. Veliki prozori donose prirodno svjetlo i pogled na okolnu prirodu.",
  image: zlatnaBrezaImage,
  slug: "zlatna-breza"
};

const divljaTresnjaData: ApartmanData = {
  type: "Apartman",
  name: "Divlja Trešnja",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Apartman Divlja Trešnja kombinuje rustikalni šarm sa modernim udobnostima. Ukrašen jedinstvenom cvjetnom dekoracijom, ovaj apartman nudi ugodan boravak sa pogledom na vrt. Idealan izbor za parove koji traže romantičan bijeg.",
  image: divljaTresnjaImage,
  slug: "divlja-tresnja"
};

// Villa Vranac Apartments
const vranacApartman1Data: ApartmanData = {
  type: "Apartman",
  name: "Apartman 1",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Prostrani apartman u potkrovlju Vile Vranac nudi savršen spoj rustikalnog šarma i modernog komfora. Sa udobnim krevetom, prostranim dnevnim boravkom sa kaučem i tradicionalnim kilimom, ovaj apartman je idealan za porodice ili grupe prijatelja.",
  image: vranacApartman1Image,
  slug: "vranac-apartman-1"
};

const vranacApartman2Data: ApartmanData = {
  type: "Apartman",
  name: "Apartman 2",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Drugi apartman u Vili Vranac odlikuje se autentičnim ciglenim zidom i drvenim gredama koje stvaraju toplu, rustikalnu atmosferu. Opremljen udobnim krevetom i radnim stolom, pruža savršen ambijent za odmor.",
  image: vranacApartman2Image,
  slug: "vranac-apartman-2"
};

// All apartments array for carousel (Vile section)
const allApartmani: ApartmanData[] = [
  plaviLotosData,
  bijeliJasminData,
  crvenaMagnolijaData,
  crnaOrhidejaData,
  zeleniTulipanData
];

// Villa Vranac apartments array for carousel
const villaVranacApartmani: ApartmanData[] = [
  vranacApartman1Data,
  vranacApartman2Data
];

// Vila Jovančić apartments array for carousel
const vilaJovancicApartmani: ApartmanData[] = [
  zlatnaBrezaData,
  divljaTresnjaData
];

// Our Suites data
const copperSuiteData: ApartmanData = {
  type: "Suite",
  name: "Copper Suite",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Copper Suite je elegantna soba smještena neposredno pored VIP salona restorana Toplik. Sa velikim bračnim krevetom, toplim drvenim detaljima i rustikalnim dekorativnim elementima, ova soba pruža savršen ambijent za kratki odmor ili poslovni put.",
  image: copperSuiteImage,
  slug: "copper-suite"
};

const goldenSuiteData: ApartmanData = {
  type: "Suite",
  name: "Golden Suite",
  checkIn: "14:00h - 21:30h",
  checkOut: "11:00h",
  breakfast: "08.00h - 10.00 h",
  description: "Golden Suite kombinuje luksuz i udobnost u jedinstven prostor. Sa prostranom sobom, kamenim zidom, staklenom tuš kabinom i elegantnim drvenim namještajem, ova soba nudi nezaboravan boravak za 1-2 osobe.",
  image: goldenSuiteImage,
  slug: "golden-suite"
};

// Our Suites array for carousel
const ourSuites: ApartmanData[] = [
  copperSuiteData,
  goldenSuiteData
];

// Mobile Carousel Component
const MobileApartmaniCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <section className="lg:hidden w-full py-8 bg-background">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {allApartmani.map((apartman, index) => (
            <div 
              key={apartman.slug} 
              className="flex-none w-[85%] min-w-0 pl-4 first:pl-4"
            >
              {/* Card */}
              <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl">
                {/* Background Image */}
                <img 
                  src={apartman.image}
                  alt={apartman.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Glassmorphism card - more compact */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    {/* Type badge */}
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-serif rounded-full mb-2">
                      {apartman.type}
                    </span>
                    
                    {/* Name */}
                    <h3 className="font-serif font-semibold text-2xl text-white mb-3">
                      {apartman.name}
                    </h3>
                    
                    {/* Button */}
                    <a 
                      href={`/apartmani/${apartman.slug}`}
                      className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg w-full justify-center transition-all duration-300 hover:bg-accent hover:text-white"
                    >
                      <span className="font-clash-grotesk font-semibold text-sm text-primary group-hover:text-white">
                        Rezerviši {apartman.type.toLowerCase() === 'vila' ? 'vilu' : 'apartman'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {allApartmani.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-primary w-6' 
                : 'bg-primary/30 hover:bg-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Swipe hint */}
      <p className="text-center text-body-text/50 text-xs mt-3 font-serif">
        Prevucite za više smještaja
      </p>
    </section>
  );
};

// Mobile Carousel Component for Villa Vranac
const MobileVillaVranacCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <section className="lg:hidden w-full py-8 bg-background">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {villaVranacApartmani.map((apartman, index) => (
            <div key={apartman.slug} className="flex-none w-[85%] min-w-0 pl-4 first:pl-4">
              <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl">
                <img src={apartman.image} alt={apartman.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-serif rounded-full mb-2">{apartman.type}</span>
                    <h3 className="font-serif font-semibold text-2xl text-white mb-3">{apartman.name}</h3>
                    <a href={`/apartmani/${apartman.slug}`} className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg w-full justify-center transition-all duration-300 hover:bg-accent hover:text-white">
                      <span className="font-clash-grotesk font-semibold text-sm text-primary group-hover:text-white">Rezerviši apartman</span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {villaVranacApartmani.map((_, index) => (
          <button key={index} onClick={() => scrollTo(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-primary w-6' : 'bg-primary/30 hover:bg-primary/50'}`} aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
      <p className="text-center text-body-text/50 text-xs mt-3 font-serif">Prevucite za više smještaja</p>
    </section>
  );
};

// Mobile Carousel Component for Vila Jovančić
const MobileVilaJovancicCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <section className="lg:hidden w-full py-8 bg-background">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {vilaJovancicApartmani.map((apartman, index) => (
            <div 
              key={apartman.slug} 
              className="flex-none w-[85%] min-w-0 pl-4 first:pl-4"
            >
              {/* Card */}
              <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl">
                {/* Background Image */}
                <img 
                  src={apartman.image}
                  alt={apartman.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Glassmorphism card - more compact */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    {/* Type badge */}
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-serif rounded-full mb-2">
                      {apartman.type}
                    </span>
                    
                    {/* Name */}
                    <h3 className="font-serif font-semibold text-2xl text-white mb-3">
                      {apartman.name}
                    </h3>
                    
                    {/* Button */}
                    <a 
                      href={`/apartmani/${apartman.slug}`}
                      className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg w-full justify-center transition-all duration-300 hover:bg-accent hover:text-white"
                    >
                      <span className="font-clash-grotesk font-semibold text-sm text-primary group-hover:text-white">
                        Rezerviši apartman
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {vilaJovancicApartmani.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-primary w-6' 
                : 'bg-primary/30 hover:bg-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Swipe hint */}
      <p className="text-center text-body-text/50 text-xs mt-3 font-serif">
        Prevucite za više smještaja
      </p>
    </section>
  );
};

// Mobile Carousel Component for Our Suites
const MobileSuitesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <section className="lg:hidden w-full py-8 bg-background">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {ourSuites.map((suite) => (
            <div key={suite.slug} className="flex-none w-[85%] min-w-0 pl-4 first:pl-4">
              <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl">
                <img src={suite.image} alt={suite.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-serif rounded-full mb-2">{suite.type}</span>
                    <h3 className="font-serif font-semibold text-2xl text-white mb-3">{suite.name}</h3>
                    <a href={`/apartmani/${suite.slug}`} className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg w-full justify-center transition-all duration-300 hover:bg-accent hover:text-white">
                      <span className="font-clash-grotesk font-semibold text-sm text-primary group-hover:text-white">Rezerviši suite</span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {ourSuites.map((_, index) => (
          <button key={index} onClick={() => scrollTo(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-primary w-6' : 'bg-primary/30 hover:bg-primary/50'}`} aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
      <p className="text-center text-body-text/50 text-xs mt-3 font-serif">Prevucite za više smještaja</p>
    </section>
  );
};

const Apartmani = () => {
  // State for apartments from Supabase
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Helper function to get apartment image (featured or fallback)
  const getApartmentImage = (apartment: Apartment, fallbackImage: string) => {
    return apartment.featured_image_url || fallbackImage;
  };

  // Helper function to convert Supabase apartment to ApartmanData format
  const toApartmanData = (apartment: Apartment, fallbackImage: string): ApartmanData => ({
    type: apartment.type,
    name: apartment.name,
    checkIn: apartment.check_in,
    checkOut: apartment.check_out,
    breakfast: apartment.breakfast,
    description: apartment.description,
    image: getApartmentImage(apartment, fallbackImage),
    slug: apartment.slug,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Banner - matching Figma design */}
      <section className="relative h-[510px] lg:h-[440px] w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        />
        
        {/* Dark Overlay - 50% opacity as per Figma */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content Container */}
        <div className="relative z-10 h-full container mx-auto px-4 lg:px-6">
          <div className="h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between py-8 lg:py-0">
            
            {/* Center/Main - Title, Subtitle and Logo Badge */}
            <div className="flex flex-col items-start lg:items-center text-left lg:text-center w-full lg:max-w-[972px] lg:mx-auto">
              {/* Title - 48px on mobile, 84px on desktop, font-normal (400) like homepage */}
              <h1 className="text-white font-clash-display text-[48px] lg:text-[84px] font-normal leading-[1.23] mb-4">
                Ponuda našeg smještaja
              </h1>
              
              {/* Subtitle - 16px on mobile, 20px on desktop */}
              <p className="text-white font-serif text-base lg:text-[20px] leading-[170%] mb-8 lg:mb-0 max-w-[361px] lg:max-w-none">
                Toplik je nešto više od odredišta – to je osjećaj, iskustvo, dom.
              </p>
              
              {/* Logo Badge - visible on mobile, hidden on desktop (shown separately) */}
              <div className="flex lg:hidden flex-row items-center gap-[18px] mt-4">
                {/* Golden Logo from SVG */}
                <img 
                  src={toplikLogoGolden} 
                  alt="Toplik Logo" 
                  className="w-[54.75px] h-[54px]"
                />
                
                {/* Stars and Text */}
                <div className="flex flex-col items-start gap-3">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5 fill-[#CCA460] text-[#CCA460]" 
                      />
                    ))}
                  </div>
                  
                  {/* Text */}
                  <p className="text-white font-serif text-[10px] uppercase text-left leading-[150%]">
                    luxury hotel<br />
                    in the heart of<br />
                    the nature
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right - Logo Badge (Desktop only) */}
            <div className="hidden lg:flex flex-col items-center gap-4">
              {/* Golden Logo from SVG */}
              <img 
                src={toplikLogoGolden} 
                alt="Toplik Logo" 
                className="w-[73px] h-[72px]"
              />
              
              {/* Stars */}
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-6 h-6 fill-[#CCA460] text-[#CCA460]" 
                  />
                ))}
              </div>
              
              {/* Text */}
              <p className="text-white font-serif text-[12px] uppercase text-center leading-[150%] max-w-[120px]">
                luxury hotel in the heart of the nature
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dobrodošli Section */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:gap-[115px]">
            {/* Left - Heading */}
            <div className="lg:w-[577px] lg:flex-shrink-0 mb-6 lg:mb-0">
              <h2 className="font-clash-display font-normal text-primary text-[36px] lg:text-[64px] leading-[150%]">
                Dobrodošli u Toplik Village Resort – Vaš miran kutak nadomak Sarajeva
              </h2>
            </div>
            
            {/* Right - Description */}
            <div className="lg:flex-1 lg:max-w-[676px]">
              <div className="text-body-text font-serif text-sm lg:text-base leading-[170%] space-y-6">
                <p>
                  Smješten u netaknutoj prirodi, svega nekoliko minuta vožnje od centra Sarajeva, 
                  Toplik Village Resort nalazi se na porodičnom imanju porodice Jovančić. Ovaj pažljivo 
                  osmišljen kompleks idealno je mjesto za bijeg od svakodnevne užurbanosti, nudeći 
                  savršen spoj udobnosti, luksuza i prirodnog mira. Iako okružen prirodom i izolovan 
                  od gradske gužve, Resort je odlično povezan – udaljen je samo 10 minuta od centra 
                  Sarajeva, 6 km od Međunarodnog aerodroma Sarajevo i 20 km od olimpijske ljepotice 
                  Jahorine.
                </p>
                <p>
                  Zahvaljujući ovoj lokaciji, gosti mogu lako kombinovati opuštanje u prirodi s 
                  gradskim sadržajima i planinskim avanturama. Toplik Village Resort obuhvata 
                  sedam luksuznih vila, od kojih se Villa Vranac i Villa Jovančić ističu kao porodične 
                  vile s wellness sadržajima za potpuno opuštanje. Srce Resorta čini restoran s više od 
                  27 godina tradicije, smješten uz ribnjake – inspiraciju cijelog Toplik koncepta.
                </p>
                <p>
                  Gosti mogu uživati u nizu dodatnih sadržaja: prodavnici domaćih proizvoda, 
                  elegantnom wine &amp; cigar loungeu, te dječjem igralištu za najmlađe. Šetnje kroz 
                  prirodu i tematske staze omogućavaju potpuno povezivanje s okruženjem i savršen 
                  su izbor za sve uzraste.
                </p>
                <p>
                  Rezervišite svoju vilu i priuštite sebi trenutke mira i luksuza.<br />
                  Dobro došli!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Carousel Version */}
      {USE_MOBILE_CAROUSEL && <MobileApartmaniCarousel />}

      {/* Apartman Section - Plavi Lotos */}
      <section className="w-full">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-[720px]">
          {/* Left - Content with dark overlay */}
          <div className="relative w-1/2 h-full">
            {/* Background Image (same as right side but darker) */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${plaviLotosData.image})` }}
            />
            
            {/* Dark Overlay with blur */}
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              {/* Top Content */}
              <div className="flex flex-col">
                {/* Type & Name */}
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">
                    {plaviLotosData.type}
                  </span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">
                    {plaviLotosData.name}
                  </h3>
                </div>
                
                {/* Check In/Out Info */}
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {plaviLotosData.checkIn}</p>
                  <p>Check Out: {plaviLotosData.checkOut}</p>
                  <p>Doručak: {plaviLotosData.breakfast}</p>
                </div>
              </div>
              
              {/* Bottom Content */}
              <div className="flex flex-col gap-6">
                {/* Description */}
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">
                  {plaviLotosData.description}
                </p>
                
                {/* Button with slick hover effect */}
                <a 
                  href={`/apartmani/${plaviLotosData.slug}`}
                  className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20"
                >
                  <span className="font-clash-grotesk font-semibold text-base text-primary">
                    Rezerviši vilu
                  </span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Right - Image */}
          <div className="w-1/2 h-full">
            <img 
              src={plaviLotosData.image} 
              alt={plaviLotosData.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Mobile Layout - Hidden when carousel is active */}
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            {/* Background Image */}
            <img 
              src={plaviLotosData.image}
              alt={plaviLotosData.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Bottom Overlay with content */}
            <div className="absolute bottom-0 left-0 right-0">
              {/* Blur background */}
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              
              {/* Content */}
              <div className="relative z-10 px-4 py-5">
                {/* Type & Name */}
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">
                    Apartman
                  </span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">
                    {plaviLotosData.name}
                  </h3>
                </div>
                
                {/* Button with slick hover effect */}
                <a 
                  href={`/apartmani/${plaviLotosData.slug}`}
                  className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20"
                >
                  <span className="font-clash-grotesk font-semibold text-base text-primary">
                    Rezerviši vilu
                  </span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Apartman Section - Bijeli Jasmin (REVERSED - Image Left, Text Right) */}
      <section className="w-full">
        {/* Desktop Layout - Reversed */}
        <div className="hidden lg:flex h-[720px]">
          {/* Left - Image */}
          <div className="w-1/2 h-full">
            <img 
              src={bijeliJasminData.image} 
              alt={bijeliJasminData.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right - Content with dark overlay */}
          <div className="relative w-1/2 h-full">
            {/* Background Image (same as left side but darker) */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${bijeliJasminData.image})` }}
            />
            
            {/* Dark Overlay with blur */}
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              {/* Top Content */}
              <div className="flex flex-col">
                {/* Type & Name */}
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">
                    {bijeliJasminData.type}
                  </span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">
                    {bijeliJasminData.name}
                  </h3>
                </div>
                
                {/* Check In/Out Info */}
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {bijeliJasminData.checkIn}</p>
                  <p>Check Out: {bijeliJasminData.checkOut}</p>
                  <p>Doručak: {bijeliJasminData.breakfast}</p>
                </div>
              </div>
              
              {/* Bottom Content */}
              <div className="flex flex-col gap-6">
                {/* Description */}
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">
                  {bijeliJasminData.description}
                </p>
                
                {/* Button with slick hover effect */}
                <a 
                  href={`/apartmani/${bijeliJasminData.slug}`}
                  className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20"
                >
                  <span className="font-clash-grotesk font-semibold text-base text-primary">
                    Rezerviši apartman
                  </span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Layout - Hidden when carousel is active */}
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            {/* Background Image */}
            <img 
              src={bijeliJasminData.image}
              alt={bijeliJasminData.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Bottom Overlay with content */}
            <div className="absolute bottom-0 left-0 right-0">
              {/* Blur background */}
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              
              {/* Content */}
              <div className="relative z-10 px-4 py-5">
                {/* Type & Name */}
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">
                    {bijeliJasminData.type}
                  </span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">
                    {bijeliJasminData.name}
                  </h3>
                </div>
                
                {/* Button with slick hover effect */}
                <a 
                  href={`/apartmani/${bijeliJasminData.slug}`}
                  className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20"
                >
                  <span className="font-clash-grotesk font-semibold text-base text-primary">
                    Rezerviši apartman
                  </span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Apartman Section - Crvena Magnolija (Text Left, Image Right) */}
      <section className="w-full">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-[720px]">
          {/* Left - Content with dark overlay */}
          <div className="relative w-1/2 h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${crvenaMagnolijaData.image})` }}
            />
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">
                    {crvenaMagnolijaData.type}
                  </span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">
                    {crvenaMagnolijaData.name}
                  </h3>
                </div>
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {crvenaMagnolijaData.checkIn}</p>
                  <p>Check Out: {crvenaMagnolijaData.checkOut}</p>
                  <p>Doručak: {crvenaMagnolijaData.breakfast}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">
                  {crvenaMagnolijaData.description}
                </p>
                <a 
                  href={`/apartmani/${crvenaMagnolijaData.slug}`}
                  className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20"
                >
                  <span className="font-clash-grotesk font-semibold text-base text-primary">
                    Rezerviši vilu
                  </span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full">
            <img src={crvenaMagnolijaData.image} alt={crvenaMagnolijaData.name} className="w-full h-full object-cover" />
          </div>
        </div>
        {/* Mobile Layout - Hidden when carousel is active */}
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            <img src={crvenaMagnolijaData.image} alt={crvenaMagnolijaData.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              <div className="relative z-10 px-4 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{crvenaMagnolijaData.type}</span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">{crvenaMagnolijaData.name}</h3>
                </div>
                <a href={`/apartmani/${crvenaMagnolijaData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši vilu</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Apartman Section - Crna Orhideja (REVERSED - Image Left, Text Right) */}
      <section className="w-full">
        {/* Desktop Layout - Reversed */}
        <div className="hidden lg:flex h-[720px]">
          <div className="w-1/2 h-full">
            <img src={crnaOrhidejaData.image} alt={crnaOrhidejaData.name} className="w-full h-full object-cover" />
          </div>
          <div className="relative w-1/2 h-full">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${crnaOrhidejaData.image})` }} />
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{crnaOrhidejaData.type}</span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">{crnaOrhidejaData.name}</h3>
                </div>
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {crnaOrhidejaData.checkIn}</p>
                  <p>Check Out: {crnaOrhidejaData.checkOut}</p>
                  <p>Doručak: {crnaOrhidejaData.breakfast}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">{crnaOrhidejaData.description}</p>
                <a href={`/apartmani/${crnaOrhidejaData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Layout - Hidden when carousel is active */}
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            <img src={crnaOrhidejaData.image} alt={crnaOrhidejaData.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              <div className="relative z-10 px-4 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{crnaOrhidejaData.type}</span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">{crnaOrhidejaData.name}</h3>
                </div>
                <a href={`/apartmani/${crnaOrhidejaData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Apartman Section - Zeleni Tulipan (Text Left, Image Right) */}
      <section className="w-full">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-[720px]">
          <div className="relative w-1/2 h-full">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${zeleniTulipanData.image})` }} />
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{zeleniTulipanData.type}</span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">{zeleniTulipanData.name}</h3>
                </div>
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {zeleniTulipanData.checkIn}</p>
                  <p>Check Out: {zeleniTulipanData.checkOut}</p>
                  <p>Doručak: {zeleniTulipanData.breakfast}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">{zeleniTulipanData.description}</p>
                <a href={`/apartmani/${zeleniTulipanData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši vilu</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full">
            <img src={zeleniTulipanData.image} alt={zeleniTulipanData.name} className="w-full h-full object-cover" />
          </div>
        </div>
        {/* Mobile Layout - Hidden when carousel is active */}
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            <img src={zeleniTulipanData.image} alt={zeleniTulipanData.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              <div className="relative z-10 px-4 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{zeleniTulipanData.type}</span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">{zeleniTulipanData.name}</h3>
                </div>
                <a href={`/apartmani/${zeleniTulipanData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši vilu</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========== VILLA VRANAC SECTION ========== */}
      
      {/* Villa Vranac Hero Section - Same style as Dobrodošli */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:gap-[115px]">
            {/* Left - Heading */}
            <div className="lg:w-[577px] lg:flex-shrink-0 mb-6 lg:mb-0">
              <h2 className="font-clash-display font-normal text-primary text-[36px] lg:text-[64px] leading-[150%]">
                Villa Vranac
              </h2>
            </div>
            
            {/* Right - Description */}
            <div className="lg:flex-1 lg:max-w-[676px]">
              <div className="text-body-text font-serif text-sm lg:text-base leading-[170%] space-y-6">
                <p>
                  Ovaj višenamjenski objekt osmišljen je s idejom okupljanja velikih grupa gostiju. 
                  Pruža mogućnost održavanja intimnih okupljanja s voljenima u potpuno opuštenoj atmosferi. 
                  Villa Vranac sastoji se od dva velika apartmana, pogodna za 8-10 osoba. Ima vanjski 
                  roštilj s velikim dvorištem, kao i unutarnju i vanjsku dječju igraonicu.
                </p>
                <p>
                  Vila Vranac nudi ekskluzivni wine and cigar lounge, gdje možete uživati u degustaciji 
                  vrhunskih vina, žestokih pića i premium cigara, što će upotpuniti vaš boravak i pružiti 
                  vam potpuno zadovoljstvo. Za korištenje wine &amp; cigar lounge-a neophodna je prethodna rezervacija.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Carousel for Villa Vranac */}
      {USE_MOBILE_CAROUSEL && <MobileVillaVranacCarousel />}

      {/* Apartman Section - Vranac Apartman 1 (Text Left, Image Right) */}
      <section className="w-full">
        <div className="hidden lg:flex h-[720px]">
          <div className="relative w-1/2 h-full">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${vranacApartman1Data.image})` }} />
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{vranacApartman1Data.type}</span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">{vranacApartman1Data.name}</h3>
                </div>
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {vranacApartman1Data.checkIn}</p>
                  <p>Check Out: {vranacApartman1Data.checkOut}</p>
                  <p>Doručak: {vranacApartman1Data.breakfast}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">{vranacApartman1Data.description}</p>
                <a href={`/apartmani/${vranacApartman1Data.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full">
            <img src={vranacApartman1Data.image} alt={vranacApartman1Data.name} className="w-full h-full object-cover" />
          </div>
        </div>
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            <img src={vranacApartman1Data.image} alt={vranacApartman1Data.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              <div className="relative z-10 px-4 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{vranacApartman1Data.type}</span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">{vranacApartman1Data.name}</h3>
                </div>
                <a href={`/apartmani/${vranacApartman1Data.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Apartman Section - Vranac Apartman 2 (REVERSED - Image Left, Text Right) */}
      <section className="w-full">
        <div className="hidden lg:flex h-[720px]">
          <div className="w-1/2 h-full">
            <img src={vranacApartman2Data.image} alt={vranacApartman2Data.name} className="w-full h-full object-cover" />
          </div>
          <div className="relative w-1/2 h-full">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${vranacApartman2Data.image})` }} />
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{vranacApartman2Data.type}</span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">{vranacApartman2Data.name}</h3>
                </div>
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {vranacApartman2Data.checkIn}</p>
                  <p>Check Out: {vranacApartman2Data.checkOut}</p>
                  <p>Doručak: {vranacApartman2Data.breakfast}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">{vranacApartman2Data.description}</p>
                <a href={`/apartmani/${vranacApartman2Data.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            <img src={vranacApartman2Data.image} alt={vranacApartman2Data.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              <div className="relative z-10 px-4 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{vranacApartman2Data.type}</span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">{vranacApartman2Data.name}</h3>
                </div>
                <a href={`/apartmani/${vranacApartman2Data.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========== VILA JOVANČIĆ SECTION ========== */}
      
      {/* Vila Jovančić Hero Section - Same style as Dobrodošli */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:gap-[115px]">
            {/* Left - Heading */}
            <div className="lg:w-[577px] lg:flex-shrink-0 mb-6 lg:mb-0">
              <h2 className="font-clash-display font-normal text-primary text-[36px] lg:text-[64px] leading-[150%]">
                Vila Jovančić
              </h2>
            </div>
            
            {/* Right - Description */}
            <div className="lg:flex-1 lg:max-w-[676px]">
              <div className="text-body-text font-serif text-sm lg:text-base leading-[170%] space-y-6">
                <p>
                  Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, 
                  graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century 
                  who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a 
                  type specimen book. It usually begins with: Lorem ipsum, or lipsum as it is sometimes known, 
                  is dummy text used in laying out print...
                </p>
                <p className="font-medium text-primary">
                  Sastoji se od Zlatna Breza i Divlja Trešnja
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Carousel for Vila Jovančić */}
      {USE_MOBILE_CAROUSEL && <MobileVilaJovancicCarousel />}

      {/* Apartman Section - Zlatna Breza (Text Left, Image Right) */}
      <section className="w-full">
        {/* Desktop Layout */}
        <div className="hidden lg:flex h-[720px]">
          {/* Left - Content with dark overlay */}
          <div className="relative w-1/2 h-full">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${zlatnaBrezaData.image})` }} />
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{zlatnaBrezaData.type}</span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">{zlatnaBrezaData.name}</h3>
                </div>
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {zlatnaBrezaData.checkIn}</p>
                  <p>Check Out: {zlatnaBrezaData.checkOut}</p>
                  <p>Doručak: {zlatnaBrezaData.breakfast}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">{zlatnaBrezaData.description}</p>
                <a href={`/apartmani/${zlatnaBrezaData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full">
            <img src={zlatnaBrezaData.image} alt={zlatnaBrezaData.name} className="w-full h-full object-cover" />
          </div>
        </div>
        {/* Mobile Layout - Hidden when carousel is active */}
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            <img src={zlatnaBrezaData.image} alt={zlatnaBrezaData.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              <div className="relative z-10 px-4 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{zlatnaBrezaData.type}</span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">{zlatnaBrezaData.name}</h3>
                </div>
                <a href={`/apartmani/${zlatnaBrezaData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Apartman Section - Divlja Trešnja (REVERSED - Image Left, Text Right) */}
      <section className="w-full">
        {/* Desktop Layout - Reversed */}
        <div className="hidden lg:flex h-[720px]">
          <div className="w-1/2 h-full">
            <img src={divljaTresnjaData.image} alt={divljaTresnjaData.name} className="w-full h-full object-cover" />
          </div>
          <div className="relative w-1/2 h-full">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${divljaTresnjaData.image})` }} />
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{divljaTresnjaData.type}</span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">{divljaTresnjaData.name}</h3>
                </div>
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {divljaTresnjaData.checkIn}</p>
                  <p>Check Out: {divljaTresnjaData.checkOut}</p>
                  <p>Doručak: {divljaTresnjaData.breakfast}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">{divljaTresnjaData.description}</p>
                <a href={`/apartmani/${divljaTresnjaData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Layout - Hidden when carousel is active */}
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            <img src={divljaTresnjaData.image} alt={divljaTresnjaData.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              <div className="relative z-10 px-4 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{divljaTresnjaData.type}</span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">{divljaTresnjaData.name}</h3>
                </div>
                <a href={`/apartmani/${divljaTresnjaData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši apartman</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========== OUR SUITES SECTION ========== */}
      
      {/* Our Suites Hero Section - Same style as Dobrodošli */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row lg:gap-[115px]">
            {/* Left - Heading */}
            <div className="lg:w-[577px] lg:flex-shrink-0 mb-6 lg:mb-0">
              <h2 className="font-clash-display font-normal text-primary text-[36px] lg:text-[64px] leading-[150%]">
                Our Suites
              </h2>
            </div>
            
            {/* Right - Description */}
            <div className="lg:flex-1 lg:max-w-[676px]">
              <div className="text-body-text font-serif text-sm lg:text-base leading-[170%] space-y-6">
                <p>
                  Ove basic sobe su smještene neposredno pored VIP salona restorana Toplik, te su 
                  namijenjene za boravak 1-2 osobe. Sadrže veliki bračni krevet, sa kupatilom, tuš 
                  kabinom i toaletom. Pogodne su za osobe koje dolaze na kratki odmor ili poslovni put.
                </p>
                <p className="font-medium text-primary">
                  Imamo Copper suite & Golden suite
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Carousel for Our Suites */}
      {USE_MOBILE_CAROUSEL && <MobileSuitesCarousel />}

      {/* Suite Section - Copper Suite (Text Left, Image Right) */}
      <section className="w-full">
        <div className="hidden lg:flex h-[720px]">
          <div className="relative w-1/2 h-full">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${copperSuiteData.image})` }} />
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{copperSuiteData.type}</span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">{copperSuiteData.name}</h3>
                </div>
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {copperSuiteData.checkIn}</p>
                  <p>Check Out: {copperSuiteData.checkOut}</p>
                  <p>Doručak: {copperSuiteData.breakfast}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">{copperSuiteData.description}</p>
                <a href={`/apartmani/${copperSuiteData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši suite</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full">
            <img src={copperSuiteData.image} alt={copperSuiteData.name} className="w-full h-full object-cover" />
          </div>
        </div>
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            <img src={copperSuiteData.image} alt={copperSuiteData.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              <div className="relative z-10 px-4 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{copperSuiteData.type}</span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">{copperSuiteData.name}</h3>
                </div>
                <a href={`/apartmani/${copperSuiteData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši suite</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Suite Section - Golden Suite (REVERSED - Image Left, Text Right) */}
      <section className="w-full">
        <div className="hidden lg:flex h-[720px]">
          <div className="w-1/2 h-full">
            <img src={goldenSuiteData.image} alt={goldenSuiteData.name} className="w-full h-full object-cover" />
          </div>
          <div className="relative w-1/2 h-full">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${goldenSuiteData.image})` }} />
            <div className="absolute inset-0 bg-[#272727]/50 backdrop-blur-[20px]" />
            <div className="relative z-10 h-full flex flex-col justify-between py-[100px] px-8 lg:px-16 xl:px-24">
              <div className="flex flex-col">
                <div className="flex flex-col gap-4 mb-0">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{goldenSuiteData.type}</span>
                  <h3 className="font-serif font-bold text-[64px] text-accent leading-none">{goldenSuiteData.name}</h3>
                </div>
                <div className="mt-0 font-serif text-base text-white leading-[135%] tracking-[0.48px]">
                  <p>Check In: {goldenSuiteData.checkIn}</p>
                  <p>Check Out: {goldenSuiteData.checkOut}</p>
                  <p>Doručak: {goldenSuiteData.breakfast}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <p className="font-serif text-base text-white leading-[150%] tracking-[0.48px] max-w-[562px]">{goldenSuiteData.description}</p>
                <a href={`/apartmani/${goldenSuiteData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši suite</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {!USE_MOBILE_CAROUSEL && (
          <div className="lg:hidden relative h-[581px]">
            <img src={goldenSuiteData.image} alt={goldenSuiteData.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0">
              <div className="absolute inset-0 bg-[#272727]/30 backdrop-blur-[20px]" />
              <div className="relative z-10 px-4 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <span className="font-serif text-base text-accent tracking-[0.48px] leading-[135%]">{goldenSuiteData.type}</span>
                  <h3 className="font-serif font-normal text-[36px] text-accent leading-none">{goldenSuiteData.name}</h3>
                </div>
                <a href={`/apartmani/${goldenSuiteData.slug}`} className="group inline-flex items-center gap-[6px] px-[18px] py-3 bg-white border border-[#EFE5DB] rounded-[2px] shadow-sm w-fit transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/20">
                  <span className="font-clash-grotesk font-semibold text-base text-primary">Rezerviši suite</span>
                  <ArrowRight className="w-6 h-6 text-primary transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Testimonials / Reviews Section */}
      <TestimonialSlider />

      <Footer />
    </div>
  );
};

export default Apartmani;
