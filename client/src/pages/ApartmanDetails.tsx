import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import ReservationForm from "@/components/ReservationForm";
import { Star, X, ChevronLeft, ChevronRight, Euro, Calendar, ChefHat, Users, Square, Thermometer, Wifi, Wine, Utensils, Tv, Bath, Flame, Home as HomeIcon, Car, ParkingCircle, CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import toplikLogoGolden from "@/assets/toplik-logo-golden.svg";
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
import { useParams } from "wouter";
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

// Legacy hardcoded data type
interface ApartmanData {
  type: string;
  name: string;
  checkIn: string;
  checkOut: string;
  breakfast: string;
  description: string;
  image: string;
  slug: string;
  gallery?: string[];
  price?: string;
  capacity?: string;
  amenities?: string[];
}

// Gallery images for Plavi Lotos (from Figma)
const plaviLotosGallery = [
  "https://s3-alpha-sig.figma.com/img/a33b/eb35/8013662a0a795deb7731b35bf5adf108?Expires=1766361600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mXsVHQJ62BEHqFOdu9aMdxZublEnjcHn6Y50uya22wUwzxa06zKxVUnavowQzJLxxcrzXd7IqOiVwIAtXgyf95-s4pdyG1X6M~Qk3LXfu1Mq2q59Q-5FFshwlkFmIEQGwEAk4vL7vEaKLh-FO3u0NEx9Y4MXUvhpdoCy1l5ruhxT7OCreWBlCiZq1CO~VnOxdSKHxNsC5ea46q5YZWnDqbHEuoBTPLyT8EqG~J27BVlLZgWV0jJM~KdA65ileJ7QpX992~q-6qvzekJSvKPOuuO3RT5hwgPfRDsPl0s40v6DD~WJZUQ4V31X3c~VG-gfJJzwbzehXSLE8YNSYAi6GA__",
  "https://s3-alpha-sig.figma.com/img/9ef8/3bc6/4a9af7892274989450f41970d3531abf?Expires=1766361600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=UkW2kyRIljgGncsBVE~bFhVNapuSDXyunNVIwbJh5GrIWuy0~zivuvmkDvworY8QENARgLgTvEWvtl9XJRAXzU2QBQGYw554EH~7UCD0X50fxOZy4ukBJIWHRGyFgSf7oOl9UmG0JojvnYQkLgof-iTrHHicrf8ErWiCALyn7j33NLe3nZ-diaPIMIXpdXr~JlZ2mJJFuPS3HENbc3qeMWQKZ1mZDtjp5nuqoC2BlHgdXecfl~aeKhvK6pssdIDphXv6gIcR8s72n1VWZKvhotL7ZeQ0dJLqNXJAyYN5rwFQJV0WQVucjICbhsXp12B4EhlVoeaRim4KBcS3TBOvtA__",
  "https://s3-alpha-sig.figma.com/img/d660/2049/b110d7717c8f0e6d585388b305ab0a1e?Expires=1766361600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=H-sJD2UpXIR4~Y7XwPIxNYINzJwemiXBqq3IjjRrcaUl1DR6zNb~GpMR~7~S~gETToSyBMYNnX~tlKOAewwhGRtY5v~v-2lbGpThJV37zWpfkyidQ2wt-ylKAoPqqyxBWZI6QRlruwVk9VaDX5e1Naxo8SqS-npPAOheHjJUtX28B~KOFU~6ZDGzb8Ds1AVGgz~~c17hEeezEQ-KabmRhuHQHBshznZI8y5pfm5OA~r2nH7FWzp1eZ1~5wU~Jt2kQV4wzjhWzL5vTawn6isyzBFD32SZpM9M2YPVNBsqgV8yPYBseXZmky1tDtdJuThdIrptLztB5Qtlz83XPBw1Cg__",
  "https://s3-alpha-sig.figma.com/img/a42d/4d25/8cbfdf7c45cdebbeaba07af2907492c4?Expires=1766361600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=XhEmwlfh0FFnWZ5OvYK7Wgi9jHy8XYuXeV0~79TsXz9mCOTOCL1w-GPdd5eyt2zvG8EtI598SxzgwYbJ4OviL5uxzoNTw4T~WkwE9VCPhqmecxpxTyqZeGU-eubkI7FYuPtpaur62CWJOg9O5xok~uN-gnYz9gMbfwhCJGkgFWHDonBxlpbqm7bbiAlz7a~VpUszvQ2Tot0xkn8UI-04SII6gAPHvBFx0ASBuV-r5sDZiyiUaNGvYe4OpKCnDs7ayN0~FYADMgeQOk7rYRPNAAwmYwKkQ1UERWfQrChNZWMp5HWvekMlLXY8xcph4GJ9HokgILQSngktRMFveqtftA__",
  "https://s3-alpha-sig.figma.com/img/6dde/32ad/015121452171713e614590c0daf5ad0e?Expires=1766361600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=hJCHNE3xic4q69jfo-~~JVkt1ClZFvzfufyU2byNsIfrmk9JbTUPWqRE~1vpXAp3XYqvCPP8IziNx7vHCoPpqQuLK5Qjc5bDCUThXvHry8UV8Q2iNViOKe~jvYe7A5M30iOf-KixYd804zfbRRMMGo03a9z-hkjZ6BKcnUH9d8UdFObcdRI45KuPAvUFpb7hAEem-v7W40ape2uQLhd8VDcZaKv14J7nUOeYxV0Ya1ICtTzhra740Kc3PB68hKfxJKH3jajkrC~WkJKtGj9JeUyXeEtOgJ0wE5WgdA8V3iInrzCbbiWi75MtRt8EFxjV0UVvGFeRfNwe8qpTV43nkg__",
  "https://s3-alpha-sig.figma.com/img/f67d/ff4e/01bd6e59e9bd7d462002597a8fa4d50b?Expires=1766361600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=FhxdMOtdCoHfUxzPfqeAxBpALQt9jvbomN~gjBhuC3Gb0~C4pokVUyrm0jXuhstZmMQLFN9EE8Oubi8cRPKsaj5D-lJLEqA2QEqL1MqdBL~TPa5DJqZOBKflsxMKY5-BKuqmiCJVCdcVf04l-zM2iHFnCJbeLyaLT~RV1kQxy4woTMhtKUL29TpLK3eRVs8911~o27FNMgh65qnUWQi0x5BkO6ws2jmHsInaczASDgero8hZMS5SwingMP3o9CCsZ5dZyR~rMZtDbWV5SorMgy0zbVYKpfa99IXdNnNKeboMoRW5k90PmY2bu8f1Uih32egPtlT7AZSLDGDditBndQ__",
  "https://s3-alpha-sig.figma.com/img/b63c/6b46/542a95e3931f653c93aec577f3c4e911?Expires=1766361600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZA05VT16WMtNJAAuffY9YTJbf8lStcqw28nZCBosASECo0sRy5112GuOLKvamKErAER5xFyEx3ztDj77JepTCqAbshmlq06eNsUunqJ1k5huV2N-lqvkjJ81w~c8Nzto5Mx-itHOb0Bsexd3E6TYiofnFagaX6cfM5qdWTHWE~mFP-adlvGonX36dcXn7wT4fXSWeXenxkWnhxckooh0iQShVXaPpwrMzQsnD-JBLgZbqQ5TSklx~4QMfEjS0WJOaAMw85YGlgpGNs85XOIS6xB5M0PMAX60xrp8d3OktLDOmfXruBW14QPlzozkWS~Z8785CM2wc19BpidCiNpfvA__",
  "https://s3-alpha-sig.figma.com/img/c276/ef46/8318cc87a574607f6e1c2c0402f8addb?Expires=1766361600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=tNpQMdd9Tfll2JAMMKlX9SyYyfbBL0EZPKdkJsl61UGH60WvaHWYqSgIiyLjCvo0HAYAhdsEbhJzdERsagM4e~PC8y6Al~QCXjh~6LkhtuYq5Jo6Iw1r6bNB~F2ff~qug7Hve8s~9ANQWBjSvW7TCOM6gkYa4djKkfZ4ghQu8HrFwKipLjcqxBcGrPFnsSuJ~UVvSB1mlpl~lme53-FwlJEQAj2wLXI1Xj0BedS52X4fZd7lasQwtqyp2KbELpoqJkScpY1hibo4OK4Iqce0~fJiCIV7OQx2AsRY5lprvJS9FaD0ncRY~yRkM5j34ahp1NCFcdRsuNyMDPY300pmuA__",
];

// All apartments data
const apartmaniData: Record<string, ApartmanData> = {
  "plavi-lotos": {
    type: "Vila",
    name: "Plavi Lotos",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Ova luksuzna, prostrana vila za odmor učiniće vaš boravak posebnim. Moderno osmišljen enterijer, sa velikim staklenim portalima, jacuzzijem, galerijom sa bračnim krevetom, ono je što će vas zasigurno osvojiti i olakšati vam izbor vaše savršene destinacije za odmor. Namijenjena je za boravak 2-4 osobe i sadrži galeriju sa velikim bračnim krevetom i krevet na razvlačenje u dnevnom boravku. Terasa ispred vile sa velikim dvorištem idealna je za uživanje u jutarnjoj kafi.",
    image: plaviLotosImage,
    slug: "plavi-lotos",
    gallery: plaviLotosGallery,
    price: "160,00 EUR sa uključenim doručkom",
    capacity: "2 - 4 osobe",
    amenities: ["54 m²", "Klima + centralno grijanje", "Internet", "Mini bar", "Room Services", "Smart TV", "Jacuzzi", "Kamin", "Smart Home", "Recepcija 24/7", "Parking", "Rent a car"]
  },
  "bijeli-jasmin": {
    type: "Apartman",
    name: "Bijeli Jasmin",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Apartman Bijeli Jasmin pruža savršen spoj udobnosti i elegancije. Prostrani interijer sa toplim drvenim detaljima, udobnim bračnim krevetom i pogledom na okolnu prirodu čini ga idealnim izborom za romantični bijeg ili mirno opuštanje. Apartman je opremljen svim potrebnim sadržajima za ugodan boravak.",
    image: bijeliJasminImage,
    slug: "bijeli-jasmin",
    price: "120,00 EUR sa uključenim doručkom",
    capacity: "2 osobe",
    amenities: ["40 m²", "Klima", "Internet", "Mini bar", "Room Services", "Smart TV", "Parking"]
  },
  "crvena-magnolija": {
    type: "Vila",
    name: "Crvena Magnolija",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Vila Crvena Magnolija nudi jedinstveno iskustvo boravka u prirodi. Sa prostornom dnevnom sobom, luksuznim kupatilom i privatnom terasom, ova vila je idealna za porodice ili grupe prijatelja. Elegantni dizajn i pažnja posvećena detaljima čine svaki trenutak posebnim.",
    image: crvenaMagnolijaImage,
    slug: "crvena-magnolija"
  },
  "crna-orhideja": {
    type: "Apartman",
    name: "Crna Orhideja",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Apartman Crna Orhideja kombinuje moderan dizajn sa toplinom doma. Prostrani interijer, udoban namještaj i pogled na okolnu prirodu čine ga savršenim mjestom za odmor. Apartman je idealan za parove koji traže mir i intimnost.",
    image: crnaOrhidejaImage,
    slug: "crna-orhideja"
  },
  "zeleni-tulipan": {
    type: "Vila",
    name: "Zeleni Tulipan",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Vila Zeleni Tulipan je savršen izbor za one koji cijene prostor i luksuz. Sa velikim dnevnim boravkom, potpuno opremljenom kuhinjom i prostranom spavaćom sobom, ova vila pruža sve što vam je potrebno za nezaboravan boravak. Terasa sa pogledom na vrt idealna je za opuštanje.",
    image: zeleniTulipanImage,
    slug: "zeleni-tulipan"
  },
  "zlatna-breza": {
    type: "Apartman",
    name: "Zlatna Breza",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Apartman Zlatna Breza odiše toplinom i elegancijom. Prostrani interijer sa drvenim gredama na stropu, udobnim bračnim krevetom i modernim kupatilom pruža savršen ambijent za opuštanje. Veliki prozori donose prirodno svjetlo i pogled na okolnu prirodu.",
    image: zlatnaBrezaImage,
    slug: "zlatna-breza"
  },
  "divlja-tresnja": {
    type: "Apartman",
    name: "Divlja Trešnja",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Apartman Divlja Trešnja kombinuje rustikalni šarm sa modernim udobnostima. Ukrašen jedinstvenom cvjetnom dekoracijom, ovaj apartman nudi ugodan boravak sa pogledom na vrt. Idealan izbor za parove koji traže romantičan bijeg.",
    image: divljaTresnjaImage,
    slug: "divlja-tresnja"
  },
  "vranac-apartman-1": {
    type: "Apartman",
    name: "Apartman 1",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Prostrani apartman u potkrovlju Vile Vranac nudi savršen spoj rustikalnog šarma i modernog komfora. Sa udobnim krevetom, prostranim dnevnim boravkom sa kaučem i tradicionalnim kilimom, ovaj apartman je idealan za porodice ili grupe prijatelja.",
    image: vranacApartman1Image,
    slug: "vranac-apartman-1"
  },
  "vranac-apartman-2": {
    type: "Apartman",
    name: "Apartman 2",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Drugi apartman u Vili Vranac odlikuje se autentičnim ciglenim zidom i drvenim gredama koje stvaraju toplu, rustikalnu atmosferu. Opremljen udobnim krevetom i radnim stolom, pruža savršen ambijent za odmor.",
    image: vranacApartman2Image,
    slug: "vranac-apartman-2"
  },
  "copper-suite": {
    type: "Suite",
    name: "Copper Suite",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Copper Suite je elegantna soba smještena neposredno pored VIP salona restorana Toplik. Sa velikim bračnim krevetom, toplim drvenim detaljima i rustikalnim dekorativnim elementima, ova soba pruža savršen ambijent za kratki odmor ili poslovni put.",
    image: copperSuiteImage,
    slug: "copper-suite"
  },
  "golden-suite": {
    type: "Suite",
    name: "Golden Suite",
    checkIn: "14:00h - 21:30h",
    checkOut: "11:00h",
    breakfast: "08.00h - 10.00 h",
    description: "Golden Suite kombinuje luksuz i udobnost u jedinstven prostor. Sa prostranom sobom, kamenim zidom, staklenom tuš kabinom i elegantnim drvenim namještajem, ova soba nudi nezaboravan boravak za 1-2 osobe.",
    image: goldenSuiteImage,
    slug: "golden-suite"
  }
};

// Lightbox Component
interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }: LightboxProps) => {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Previous Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      {/* Image */}
      <div 
        className="max-w-[90vw] max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
        
        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 rounded-full">
          <span className="text-white font-serif text-sm">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Next Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};

// Gallery Component
interface GalleryProps {
  images: string[];
  apartmentName: string;
}

// Gallery Component
interface GalleryProps {
  images: string[];
  apartmentName: string;
}

const ImageGallery = ({ images, apartmentName }: GalleryProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <section className="py-8 lg:py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Gallery Grid - Matching Figma Design */}
          <div className="flex flex-col gap-4">
            {/* Top Row - Large image + 2 stacked images */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Main Large Image */}
              <div
                className="lg:w-[66%] aspect-[905/500] rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(0)}
              >
                <img
                  src={images[0]}
                  alt={`${apartmentName} - Main`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Right Column - 2 stacked images */}
              <div className="lg:w-[34%] flex flex-row lg:flex-col gap-4">
                {images[1] && (
                  <div
                    className="w-1/2 lg:w-full aspect-[447/242] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(1)}
                  >
                    <img
                      src={images[1]}
                      alt={`${apartmentName} - Image 2`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                {images[2] && (
                  <div
                    className="w-1/2 lg:w-full aspect-[447/242] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(2)}
                  >
                    <img
                      src={images[2]}
                      alt={`${apartmentName} - Image 3`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row - 5 smaller images */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.slice(3, 8).map((image, index) => (
                <div
                  key={index}
                  className="aspect-[260/235] rounded-lg overflow-hidden cursor-pointer group relative"
                  onClick={() => openLightbox(index + 3)}
                >
                  <img
                    src={image}
                    alt={`${apartmentName} - Image ${index + 4}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {index === 4 && images.length > 8 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-lg font-bold">
                      +{images.length - 8} photos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white hover:bg-white/20"
            onClick={goToPrev}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white hover:bg-white/20"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
          <img
            src={images[currentImageIndex]}
            alt={`${apartmentName} - ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
};

const ApartmanDetails = () => {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "plavi-lotos";
  
  // State for apartment data (from Supabase)
  const [apartmentData, setApartmentData] = useState<Apartment | null>(null);
  const [apartman, setApartman] = useState<ApartmanData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // State for R2 images
  const [r2Images, setR2Images] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);

  // Load apartment data from database
  useEffect(() => {
    const loadApartment = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('apartments')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) {
          console.error('Error loading apartment:', error);
          // Fallback to hardcoded data
          setApartman(apartmaniData[slug] || apartmaniData["plavi-lotos"]);
        } else if (data) {
          // Store full apartment data from Supabase
          setApartmentData(data);
          
          // Map database fields to component structure
          setApartman({
            type: data.type,
            name: data.name,
            checkIn: data.check_in,
            checkOut: data.check_out,
            breakfast: data.breakfast,
            description: data.description,
            image: data.featured_image_url || apartmaniData[slug]?.image || plaviLotosImage, // Use featured image first
            slug: data.slug,
            gallery: apartmaniData[slug]?.gallery,
            price: data.price || undefined,
            capacity: data.capacity || undefined,
            amenities: data.amenities || [],
          });
        }
      } catch (error) {
        console.error('Error loading apartment:', error);
        // Fallback to hardcoded data
        setApartman(apartmaniData[slug] || apartmaniData["plavi-lotos"]);
      } finally {
        setLoading(false);
      }
    };

    loadApartment();
  }, [slug]);

  // Load images from Supabase (R2 URLs stored in database)
  useEffect(() => {
    const loadImagesFromSupabase = async () => {
      if (!slug) return;
      
      setLoadingImages(true);
      try {
        const { data, error } = await supabase
          .from('apartments')
          .select('image_urls')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) {
          console.error('Error loading images from Supabase:', error);
          setR2Images([]);
        } else if (data?.image_urls && Array.isArray(data.image_urls)) {
          setR2Images(data.image_urls);
        } else {
          setR2Images([]);
        }
      } catch (error) {
        console.error('Error loading images:', error);
        setR2Images([]);
      } finally {
        setLoadingImages(false);
      }
    };

    loadImagesFromSupabase();
  }, [slug]);

  // Use R2 images from Supabase if available, otherwise fallback to hardcoded gallery or main image
  const galleryImages = r2Images.length > 0 ? r2Images : (apartman?.gallery || (apartman?.image ? [apartman.image] : []));

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Učitavanje...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show not found if apartment doesn't exist
  if (!apartman) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-clash text-primary mb-4">Apartman nije pronađen</h1>
            <p className="text-gray-600">Traženi apartman ne postoji ili nije dostupan.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Banner for individual apartment */}
      <section className="relative h-[510px] lg:h-[440px] w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${apartman.image})` }}
        />

        {/* Dark Overlay - 50% opacity as per Figma */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content Container */}
        <div className="relative z-10 h-full container mx-auto px-4 lg:px-6">
          <div className="h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between py-8 lg:py-0">

            {/* Center/Main - Title and Logo Badge */}
            <div className="flex flex-col items-start lg:items-center text-left lg:text-center w-full lg:max-w-[972px] lg:mx-auto">
              {/* Title - 48px on mobile, 84px on desktop */}
              <h1 className="text-white font-clash-display text-[48px] lg:text-[84px] font-normal leading-[1.23] mb-4">
                {apartman.type} {apartman.name}
              </h1>

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

      {/* Image Gallery */}
      <ImageGallery images={galleryImages} apartmentName={apartman.name} />

      {/* Heading and Description Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-6 flex flex-col lg:flex-row gap-8 lg:gap-[115px] items-start">
          {/* Left: Apartment Name */}
          <div className="lg:w-1/2">
            <h2 className="font-clash text-primary text-[48px] lg:text-[64px] font-normal leading-[1.2] uppercase">
              {apartman.name}
            </h2>
          </div>
          {/* Right: Description */}
          <div className="lg:w-1/2">
            <p className="font-martel text-body-text text-base leading-[170%]">
              {apartman.description}
            </p>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="pb-16 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-[14px]">
            {/* Price Card */}
            {apartman.price && (
              <div className="flex items-center gap-2 p-4 border border-stroke-color rounded-md bg-white">
                <Euro className="h-6 w-6 text-primary" />
                <p className="font-martel font-semibold text-primary text-[15px] leading-[170%]">
                  Cijena: {apartman.price}
                </p>
              </div>
            )}
            {/* Check In Card */}
            <div className="flex items-center gap-2 p-4 border border-stroke-color rounded-md bg-white">
              <Calendar className="h-6 w-6 text-primary" />
              <p className="font-martel font-semibold text-primary text-[15px] leading-[170%]">
                Check In: {apartman.checkIn}
              </p>
            </div>
            {/* Check Out Card */}
            <div className="flex items-center gap-2 p-4 border border-stroke-color rounded-md bg-white">
              <Calendar className="h-6 w-6 text-primary" />
              <p className="font-martel font-semibold text-primary text-[15px] leading-[170%]">
                Check Out: {apartman.checkOut}
              </p>
            </div>
            {/* Breakfast Card */}
            <div className="flex items-center gap-2 p-4 border border-stroke-color rounded-md bg-white">
              <ChefHat className="h-6 w-6 text-primary" />
              <p className="font-martel font-semibold text-primary text-[15px] leading-[170%]">
                Doručak: {apartman.breakfast}
              </p>
            </div>
            {/* Capacity Card */}
            {apartman.capacity && (
              <div className="flex items-center gap-2 p-4 border border-stroke-color rounded-md bg-white">
                <Users className="h-6 w-6 text-primary" />
                <p className="font-martel font-semibold text-primary text-[15px] leading-[170%]">
                  Kapacitet: {apartman.capacity}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Amenities & Reservation Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Amenities */}
            <div>
              <h3 className="font-clash font-normal text-[32px] lg:text-[48px] leading-[150%] uppercase text-primary mb-8">
                Sadržaji
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {apartman.amenities && apartman.amenities.map((amenity, index) => {
                  // Map amenities to icons
                  let Icon = Square;
                  
                  const amenityLower = amenity.toLowerCase();
                  
                  if (amenityLower.includes('m²') || amenityLower.includes('m2')) Icon = Square;
                  else if (amenityLower.includes('klima') || amenityLower.includes('grijanje')) Icon = Thermometer;
                  else if (amenityLower.includes('internet') || amenityLower.includes('wifi')) Icon = Wifi;
                  else if (amenityLower.includes('bar')) Icon = Wine;
                  else if (amenityLower.includes('room service')) Icon = Utensils;
                  else if (amenityLower.includes('tv')) Icon = Tv;
                  else if (amenityLower.includes('jacuzzi') || amenityLower.includes('bath')) Icon = Bath;
                  else if (amenityLower.includes('kamin')) Icon = Flame;
                  else if (amenityLower.includes('smart home') || amenityLower.includes('home')) Icon = HomeIcon;
                  else if (amenityLower.includes('recepcija')) Icon = Utensils;
                  else if (amenityLower.includes('parking')) Icon = ParkingCircle;
                  else if (amenityLower.includes('rent a car') || amenityLower.includes('car')) Icon = Car;

                  return (
                    <div 
                      key={index} 
                      className="flex items-center gap-4 p-4 bg-[#F8F5F0] rounded-lg hover:bg-[#EFE5DB] transition-colors duration-300 hover:shadow-md"
                    >
                      <Icon className="h-6 w-6 text-primary flex-shrink-0" strokeWidth={2} />
                      
                      {/* Text - Using Martel Bold as in Figma */}
                      <p className="font-martel font-bold text-[16px] text-primary">
                        {amenity}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Reservation Form (Form-Only Mode) */}
            <ReservationForm 
              mode="form-only" 
              defaultAccommodation={apartman.slug} 
              apartmentName={apartman.name} 
            />
          </div>
        </div>
      </section>

      {/* Placeholder for additional content - will be added later */}
      <div className="flex-grow bg-background" />

      <Footer />
    </div>
  );
};

export default ApartmanDetails;
