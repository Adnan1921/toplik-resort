import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import restoranRibnjak from "@/assets/about/restoran-ribnjak.jpg";
import vileExterior from "@/assets/about/vile-exterior.jpg";
const AboutSection = () => {
  return <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Top content */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            {/* Subtitle */}
            <p className="text-primary font-clash text-lg font-normal leading-[150%] mb-4">
              Od izvora do resorta
            </p>
            
            {/* Main text */}
            <h2 className="text-primary font-serif lg:text-[28px] font-normal leading-[150%] text-lg">
              Toplik je nastao zahvaljujući izvoru čiste, pitke vode smještenom uz naš 
              ribnjak – simbolu života, prirode i jednostavnosti. Taj izvor bio je početna 
              iskra naše vizije i inspiracija za sve što je uslijedilo.
            </h2>
          </div>
          
          {/* Button */}
          <div className="lg:pt-8">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-6 py-3 h-auto font-clash">
              Rezerviši sada
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Images row */}
        <div className="flex flex-col lg:flex-row gap-6 items-end">
          {/* Left caption */}
          <div className="lg:w-48 shrink-0 order-2 lg:order-1">
            <p className="text-body-text font-clash-display text-xl font-normal leading-[150%]">
              Svježina prirode u<br />
              modernom ambijentu.
            </p>
          </div>
          
          {/* Images */}
          <div className="flex flex-col md:flex-row gap-6 flex-1 order-1 lg:order-2">
            <div className="md:w-1/2">
              <img src={restoranRibnjak} alt="Restoran pored ribnjaka" className="w-full h-[400px] lg:h-[500px] object-cover" />
            </div>
            <div className="md:w-1/2">
              <img src={vileExterior} alt="Eksterijer vila" className="w-full h-[400px] lg:h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;