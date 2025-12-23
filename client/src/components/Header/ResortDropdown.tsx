import { ArrowRight } from "lucide-react";

import vilaVranac from "@/assets/villas/vila-vranac.png";
import crvenaMagnolija from "@/assets/villas/crvena-magnolija.png";
import bijelijasmin from "@/assets/villas/bijeli-jasmin.png";
import plaviLotos from "@/assets/villas/plavi-lotos.png";
import crnaOrhideja from "@/assets/villas/crna-orhideja.png";
import zeleniTulipan from "@/assets/villas/zeleni-tulipan.png";

interface Villa {
  name: string;
  image: string;
  href: string;
}

const villas: Villa[] = [
  { name: "VILA VRANAC", image: vilaVranac, href: "/apartmani/vila-vranac" },
  { name: "CRVENA MAGNOLIJA", image: crvenaMagnolija, href: "/apartmani/crvena-magnolija" },
  { name: "BIJELI JASMIN", image: bijelijasmin, href: "/apartmani/bijeli-jasmin" },
  { name: "PLAVI LOTOS", image: plaviLotos, href: "/apartmani/plavi-lotos" },
  { name: "CRNA ORHIDEJA", image: crnaOrhideja, href: "/apartmani/crna-orhideja" },
  { name: "ZELENI TULIPAN", image: zeleniTulipan, href: "/apartmani/zeleni-tulipan" },
];

const ResortDropdown = () => {
  return (
    <div className="py-6">
      <div className="container mx-auto px-6">
        <div className="bg-[#F8F5F0] rounded-[4px] shadow-[0_12px_16px_-4px_rgba(92,70,38,0.08),0_4px_6px_-2px_rgba(106,98,54,0.03)] p-8">
          <div className="grid grid-cols-3 gap-6">
            {villas.map((villa) => (
              <div key={villa.name} className="flex flex-col">
                <a href={villa.href} className="block overflow-hidden rounded-[4px] mb-3">
                  <img
                    src={villa.image}
                    alt={villa.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </a>
                <h3 className="text-foreground font-semibold tracking-wide text-sm mb-3">
                  {villa.name}
                </h3>
                <a
                  href={villa.href}
                  className="inline-flex justify-center items-center w-[181px] gap-1.5 py-3 px-[18px] border border-button-border bg-white text-primary font-clash text-base font-semibold leading-6 rounded-sm shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] hover:border-primary transition-colors"
                >
                  Rezerviši vilu
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortDropdown;
