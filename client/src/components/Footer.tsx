import toplikLogo from "@/assets/logo.png";
import toplikLogoText from "@/assets/toplik-logo-gold.png";
import toplikLogoOutline from "@/assets/toplik-logo-outline.svg";

const Footer = () => {
  return (
    <footer className="bg-[#1E4528] text-white relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6 lg:px-16 py-12 lg:py-16 relative">
          <div className="flex items-start justify-between">
            {/* Left: Logo and Text */}
            <div className="max-w-[320px]">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src={toplikLogo} 
                  alt="Toplik Village Resort" 
                  className="w-10 h-10 object-contain"
                />
                <div className="w-px h-8 bg-white/30" />
                <img 
                  src={toplikLogoText} 
                  alt="Toplik" 
                  className="h-8 object-contain"
                />
              </div>
              <p className="text-[16px] font-serif leading-[170%] text-white/90">
                Rezervišite svoju vilu i priuštite sebi trenutke mira i luksuza.
                <br />
                Dobro došli!
              </p>
            </div>

            {/* Center: Watermark Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <img 
                src={toplikLogoOutline} 
                alt="" 
                className="w-[140px] h-[140px] object-contain opacity-20"
              />
            </div>

            {/* Right: Links Columns */}
            <div className="flex gap-24">
              {/* Resort Links */}
              <div>
                <h3 className="text-[18px] font-serif font-semibold mb-6">Resort</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="/apartmani#villa-vranac" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Villa Vranac
                    </a>
                  </li>
                  <li>
                    <a href="/apartmani#crvena-mangolija" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Crvena Mangolija
                    </a>
                  </li>
                  <li>
                    <a href="/apartmani#bijeli-jasmin" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Bijeli Jasmin
                    </a>
                  </li>
                  <li>
                    <a href="/apartmani#plavi-lotos" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Plavi Lotos
                    </a>
                  </li>
                  <li>
                    <a href="/apartmani#crna-orhideja" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Crna Orhideja
                    </a>
                  </li>
                  <li>
                    <a href="/apartmani#zeleni-tulipan" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Zeleni Tulipan
                    </a>
                  </li>
                </ul>
              </div>

              {/* Restoran Links */}
              <div>
                <h3 className="text-[18px] font-serif font-semibold mb-6">Restoran</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="#nasa-prica" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Naša Priča
                    </a>
                  </li>
                  <li>
                    <a href="#menu" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Menu
                    </a>
                  </li>
                  <li>
                    <a href="#vip-salon" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      VIP Salon
                    </a>
                  </li>
                  <li>
                    <a href="#ribnjak" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Ribnjak
                    </a>
                  </li>
                  <li>
                    <a href="#rezervacija" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                      Rezerviši stol
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative">
        <div className="px-6 py-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4 h-20">
            <img 
              src={toplikLogo} 
              alt="Toplik Village Resort" 
              className="w-20 h-20 object-contain"
            />
            <div className="w-px h-8 bg-white/30" />
            <img 
              src={toplikLogoText} 
              alt="Toplik" 
              className="w-20 h-8 object-contain"
            />
          </div>

          {/* Description */}
          <p className="text-[16px] font-serif leading-[170%] text-white/90 mb-8">
            Rezervišite svoju vilu i priuštite sebi trenutke mira i luksuza.
            <br />
            Dobro došli!
          </p>

          {/* Links in two columns */}
          <div className="grid grid-cols-2 gap-8 relative">
            {/* Resort Links */}
            <div>
              <h3 className="text-[20px] font-serif font-semibold mb-6">Resort</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/apartmani#villa-vranac" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Villa Vranac
                  </a>
                </li>
                <li>
                  <a href="/apartmani#crvena-mangolija" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Crvena Mangolija
                  </a>
                </li>
                <li>
                  <a href="/apartmani#bijeli-jasmin" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Bijeli Jasmin
                  </a>
                </li>
                <li>
                  <a href="/apartmani#plavi-lotos" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Plavi Lotos
                  </a>
                </li>
                <li>
                  <a href="/apartmani#crna-orhideja" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Crna Orhideja
                  </a>
                </li>
                <li>
                  <a href="/apartmani#zeleni-tulipan" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Zeleni Tulipan
                  </a>
                </li>
              </ul>
            </div>

            {/* Restoran Links */}
            <div>
              <h3 className="text-[20px] font-serif font-semibold mb-6">Restoran</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#nasa-prica" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Naša Priča
                  </a>
                </li>
                <li>
                  <a href="#menu" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Menu
                  </a>
                </li>
                <li>
                  <a href="#vip-salon" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    VIP Salon
                  </a>
                </li>
                <li>
                  <a href="#ribnjak" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Ribnjak
                  </a>
                </li>
                <li>
                  <a href="#rezervacija" className="text-[16px] font-serif text-white/80 hover:text-white transition-colors duration-300">
                    Rezerviši stol
                  </a>
                </li>
              </ul>
            </div>

            {/* Decorative watermark logo - positioned in corner */}
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 pointer-events-none">
              <img 
                src={toplikLogoOutline} 
                alt="" 
                className="w-[100px] h-[100px] object-contain opacity-20"
              />
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-6">
            <p className="text-[14px] font-serif text-white/60">
              2025. All rights reserved Toplik.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
