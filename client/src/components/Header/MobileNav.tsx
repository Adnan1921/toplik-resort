import { X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import logo from "@/assets/logo.png";
import TopBar from "./TopBar";

// Villa images
import vilaVranac from "@/assets/villas/vila-vranac.png";
import crvenaMagnolija from "@/assets/villas/crvena-magnolija.png";
import bijeliJasmin from "@/assets/villas/bijeli-jasmin.png";
import plaviLotos from "@/assets/villas/plavi-lotos.png";
import crnaOrhideja from "@/assets/villas/crna-orhideja.png";
import zeleniTulipan from "@/assets/villas/zeleni-tulipan.png";

// Restoran images
import porodicaImg from "@/assets/restoran/porodica.jpg";
import vipSalonImg from "@/assets/restoran/vip-salon.jpg";
import ribnjakImg from "@/assets/restoran/ribnjak.png";

// Rezervisi images
import restoranImg from "@/assets/rezervisi/restoran.png";
import resortImg from "@/assets/rezervisi/resort.png";

const resortItems = [
  { name: "VILA VRANAC", image: vilaVranac, href: "/apartmani/vila-vranac" },
  { name: "CRVENA MAGNOLIJA", image: crvenaMagnolija, href: "/apartmani/crvena-magnolija" },
  { name: "BIJELI JASMIN", image: bijeliJasmin, href: "/apartmani/bijeli-jasmin" },
  { name: "PLAVI LOTOS", image: plaviLotos, href: "/apartmani/plavi-lotos" },
  { name: "CRNA ORHIDEJA", image: crnaOrhideja, href: "/apartmani/crna-orhideja" },
  { name: "ZELENI TULIPAN", image: zeleniTulipan, href: "/apartmani/zeleni-tulipan" },
];

const restoranItems = [
  { name: "PRIČA PORODICE JOVANČIĆA OD 1997", image: porodicaImg, href: "#prica-porodice" },
  { name: "VIP SALON ZA PRIVATNE PROSLAVE", image: vipSalonImg, href: "#vip-salon" },
  { name: "RIBNJAK", image: ribnjakImg, href: "#ribnjak" },
];

const rezervisiItems = [
  { name: "RESTORAN TOPLIK", image: restoranImg, href: "#rezervisi-stol" },
  { name: "TOPLIK VILLAGE RESORT", image: resortImg, href: "#rezervisi-vilu" },
];

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileNav = ({ isOpen, onOpenChange }: MobileNavProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-white [&>button]:hidden">
        {/* TopBar */}
        <TopBar />
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <a href="/" className="flex-shrink-0">
            <img src={logo} alt="Toplik Village Resort" className="h-10 w-auto" />
          </a>
          <div className="flex items-center gap-4">
            <a
              href="#rezervisi"
              className="font-serif text-[16px] text-primary font-semibold"
            >
              Rezerviši
            </a>
            <button onClick={() => onOpenChange(false)}>
              <X className="h-6 w-6 text-title-text" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="py-4 px-4 flex flex-col gap-4">
          {/* Naša Priča - Simple Link */}
          <a 
            href="#nasa-prica" 
            className="block px-4 py-3 font-serif text-[18px] text-body-text font-normal rounded bg-[#F8F5F0]"
          >
            Naša Priča
          </a>

          {/* Resort Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="resort" className="border-0 rounded bg-[#F8F5F0] overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <a href="/apartmani" className="font-serif text-[18px] text-body-text font-normal flex-1 text-left">
                  Resort
                </a>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="border-l-4 border-primary ml-4">
                  {resortItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-white/50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-14 object-cover rounded-sm"
                      />
                      <span className="font-clash text-[14px] font-medium text-title-text uppercase">
                        {item.name}
                      </span>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Restoran Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="restoran" className="border-0 rounded bg-[#F8F5F0] overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="font-serif text-[18px] text-body-text font-normal">
                  Restoran
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="border-l-4 border-primary ml-4">
                  {restoranItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-white/50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-14 object-cover rounded-sm"
                      />
                      <span className="font-clash text-[14px] font-medium text-title-text uppercase">
                        {item.name}
                      </span>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Galerija - Simple Link */}
          <a 
            href="#galerija" 
            className="block px-4 py-3 font-serif text-[18px] text-body-text font-normal rounded bg-[#F8F5F0]"
          >
            Galerija
          </a>

          {/* Rezerviši Accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="rezervisi" className="border-0 rounded bg-[#F8F5F0] overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <span className="font-serif text-[18px] text-body-text font-normal">
                  Rezerviši
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="border-l-4 border-primary ml-4">
                  {rezervisiItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-white/50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-14 object-cover rounded-sm"
                      />
                      <span className="font-clash text-[14px] font-medium text-title-text uppercase">
                        {item.name}
                      </span>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
