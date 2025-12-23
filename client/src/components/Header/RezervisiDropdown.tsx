import { ArrowRight } from "lucide-react";

import restoranImg from "@/assets/rezervisi/restoran.png";
import resortImg from "@/assets/rezervisi/resort.png";

interface ReservationCard {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  href: string;
}

const cards: ReservationCard[] = [
  {
    title: "RESTORAN TOPLIK",
    subtitle: "Jedite lokalno, svježe i zdravo",
    description: "Restoran Toplik sa tradicijom dugom preko 26 godina je idilično mjesto koje nudi izvrsnu gastronomsku ponudu. Smješten usred zelenila, restoran vam pruža prekrasan pogled na prirodu i mirno okruženje. Ovdje možete uživati u vrhunskim jelima...",
    image: restoranImg,
    buttonText: "Rezerviši stol",
    href: "#rezervisi-stol",
  },
  {
    title: "TOPLIK VILLAGE RESORT",
    subtitle: "U harmoniji s prirodom",
    description: "Kompleks Toplik Village Resort smješten je u srcu prirode, u neposrednoj blizini grada Sarajeva, na imanju porodice Jovančić. Resort je pažljivo osmišljen kako bi pružio miran bijeg od užurbanog gradskog života te vam omogućio savršeno is...",
    image: resortImg,
    buttonText: "Rezerviši vilu",
    href: "/apartmani",
  },
];

const RezervisiDropdown = () => {
  return (
    <div className="py-6">
      <div className="container mx-auto px-6">
        <div className="bg-[#F8F5F0] rounded-[4px] shadow-[0_12px_16px_-4px_rgba(92,70,38,0.08),0_4px_6px_-2px_rgba(106,98,54,0.03)] p-8">
          <div className="grid grid-cols-2 gap-8">
            {cards.map((card) => (
              <div key={card.title} className="flex gap-6">
                {/* Image */}
                <div className="flex-shrink-0 overflow-hidden rounded-[4px]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-[320px] h-[280px] object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <h2 className="font-clash text-[20px] font-medium text-title-text uppercase mb-3">
                    {card.title}
                  </h2>
                  
                  <h3 className="font-serif text-[16px] font-normal text-primary mb-3">
                    {card.subtitle}
                  </h3>
                  
                  <p className="font-serif text-[13px] font-normal text-body-text leading-normal mb-6 line-clamp-5">
                    {card.description}
                  </p>
                  
                  <a
                    href={card.href}
                    className="inline-flex justify-center items-center w-[181px] gap-1.5 py-3 px-[18px] border border-button-border bg-white text-primary font-clash text-base font-semibold leading-6 rounded-sm shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] hover:border-primary transition-colors mt-auto"
                  >
                    {card.buttonText}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RezervisiDropdown;
