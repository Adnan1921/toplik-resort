import { ArrowRight } from "lucide-react";

import mainDish from "@/assets/restoran/main-dish.png";
import porodica from "@/assets/restoran/porodica.jpg";
import vipSalon from "@/assets/restoran/vip-salon.jpg";
import ribnjak from "@/assets/restoran/ribnjak.png";

interface SideItem {
  title: string;
  description: string;
  image: string;
  href: string;
}

const sideItems: SideItem[] = [
  {
    title: "PRIČA PORODICE JOVANČIĆA OD 1997",
    description: "Kompleks Toplik Village Resort smješten je u srcu prirode, u neposrednoj blizini grada Sarajeva, na imanju porodice Jovančić. Resort je pažljivo o...",
    image: porodica,
    href: "#prica-porodice",
  },
  {
    title: "VIP SALON ZA PRIVATNE PROSLAVE",
    description: "Kompleks Toplik Village Resort smješten je u srcu prirode, u neposrednoj blizini grada Sarajeva, na imanju porodice Jovančić. Resort je pažljivo o...",
    image: vipSalon,
    href: "#vip-salon",
  },
  {
    title: "RIBNJAK",
    description: "U našem ribnjaku možete pronaći tri vrste pastrmke koje se također serviraju na našem stolu: kalifornijsku pastrmku (Salmo gairdneri), potočnu pastrmku (Salvelinus fontinalis) i našu domaću potočnu pastr...",
    image: ribnjak,
    href: "#ribnjak",
  },
];

const RestoranDropdown = () => {
  return (
    <div className="py-6">
      <div className="container mx-auto px-6">
        <div className="bg-[#F8F5F0] rounded-[4px] shadow-[0_12px_16px_-4px_rgba(92,70,38,0.08),0_4px_6px_-2px_rgba(106,98,54,0.03)] p-8">
          <div className="grid grid-cols-[1fr_1fr] gap-8">
            {/* Left - Main restaurant content */}
            <div className="flex flex-col">
              <div className="overflow-hidden rounded-[4px] mb-6">
                <img
                  src={mainDish}
                  alt="Restoran Toplik"
                  className="w-full h-[280px] object-cover"
                />
              </div>
              
              <h2 className="font-clash text-[20px] font-medium text-title-text uppercase mb-4">
                SVJEŽINA I KVALITET NA VAŠEM STOLU
              </h2>
              
              <h3 className="font-serif text-[16px] font-normal text-title-text mb-3">
                A La carte restoran
              </h3>
              
              <p className="font-serif text-[13px] font-normal text-body-text leading-normal mb-6 line-clamp-4">
                Veliki dio ukupne ponude povrća dolazi iz našeg vlastitog uzgoja, što je garancija kvalitete i posvećenosti domaćoj proizvodnji. Naš cilj je ponuditi ono što sve više zaboravljamo u vrijeme brzog načina života - zdravu domaću hranu. Ne možete zamisliti radost naših gostiju kada dobiju pravi domaći ajvar ili lukmir s svježim mladim lukom iz našeg vrta uz glavno jelo.
              </p>
              
              <div className="flex gap-4">
                <a
                  href="#menu"
                  className="inline-flex justify-center items-center w-[181px] gap-1.5 py-3 px-[18px] border border-button-border bg-white text-primary font-clash text-base font-semibold leading-6 rounded-sm shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] hover:border-primary transition-colors"
                >
                  Menu
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="#rezervisi-stol"
                  className="inline-flex justify-center items-center w-[181px] gap-1.5 py-3 px-[18px] border border-button-border bg-white text-primary font-clash text-base font-semibold leading-6 rounded-sm shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] hover:border-primary transition-colors"
                >
                  Rezerviši stol
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right - Side items */}
            <div className="flex flex-col gap-4">
              {sideItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0 overflow-hidden rounded-[4px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-[120px] h-[120px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-clash text-[20px] font-medium text-primary uppercase mb-2 group-hover:underline">
                      {item.title}
                    </h4>
                    <p className="font-serif text-[13px] font-normal text-body-text leading-normal line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestoranDropdown;
