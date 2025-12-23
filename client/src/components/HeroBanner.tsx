import { ArrowUpRight, Facebook, Instagram, Star } from "lucide-react";
import logo from "@/assets/logo.png";
import heroOverlay from "@/assets/hero-overlay.png";
import { AuroraBackground } from "@/components/ui/aurora-background";

const HeroBanner = () => {
  return (
    <AuroraBackground>
      <section className="relative overflow-hidden">
      <div className="container mx-auto px-6 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left social icons - Desktop only */}
          <div className="hidden lg:flex flex-col gap-4 col-span-1 pt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <Facebook className="w-5 h-5 text-primary" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <Instagram className="w-5 h-5 text-primary" />
            </a>
            <a
              href="https://tripadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              {/* TripAdvisor icon */}
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.976 5.976 0 0 0 4.075 1.598 5.997 5.997 0 0 0 4.04-10.43L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM6.003 17.206a3.993 3.993 0 1 1 0-7.986 3.993 3.993 0 0 1 0 7.986zm11.994 0a3.993 3.993 0 1 1 0-7.986 3.993 3.993 0 0 1 0 7.986zM6.003 11.213a2.004 2.004 0 1 0 0 4.008 2.004 2.004 0 0 0 0-4.008zm11.994 0a2.004 2.004 0 1 0 0 4.008 2.004 2.004 0 0 0 0-4.008z"/>
              </svg>
            </a>
          </div>

          {/* Main content */}
          <div className="lg:col-span-6 relative z-10">
            {/* Mobile social icons - absolutely positioned right */}
            <div className="absolute right-0 top-0 flex lg:hidden flex-col gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
              >
                <Facebook className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
              >
                <Instagram className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://tripadvisor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.976 5.976 0 0 0 4.075 1.598 5.997 5.997 0 0 0 4.04-10.43L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM6.003 17.206a3.993 3.993 0 1 1 0-7.986 3.993 3.993 0 0 1 0 7.986zm11.994 0a3.993 3.993 0 1 1 0-7.986 3.993 3.993 0 0 1 0 7.986zM6.003 11.213a2.004 2.004 0 1 0 0 4.008 2.004 2.004 0 0 0 0-4.008zm11.994 0a2.004 2.004 0 1 0 0 4.008 2.004 2.004 0 0 0 0-4.008z"/>
                </svg>
              </a>
            </div>

            {/* Tag */}
            <div className="inline-flex items-center justify-center px-4 py-1 lg:w-auto lg:h-[34px] rounded bg-white/45 mb-2 lg:mb-6">
              <span className="text-base lg:text-[20px] text-primary font-clash font-medium leading-[150%] whitespace-nowrap">
                U harmoniji sa prirodom
              </span>
            </div>

            {/* Title */}
            <h1 className="text-[42px] lg:text-[96px] font-medium text-primary leading-[1.1] lg:leading-none mb-6 lg:mb-8 font-clash-display pr-16 lg:pr-0">
              Toplik Village Resort
            </h1>

            {/* Description */}
            <p className="text-body-text text-sm lg:text-base font-serif leading-[170%] mb-8 lg:mb-10 max-w-xl">
              Smješten u netaknutoj prirodi, svega nekoliko minuta vožnje od centra Sarajeva, 
              Toplik Village Resort nalazi se na porodičnom imanju porodice Jovančić. Ovaj 
              pažljivo osmišljen kompleks idealno je mjesto za bijeg od svakodnevne 
              užurbanosti, nudeći savršen spoj udobnosti, luksuza i prirodnog mira.
            </p>

            {/* Mobile: Navigation links */}
            <div className="lg:hidden space-y-4 mb-8">
              <a 
                href="/apartmani" 
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="text-[36px] font-normal text-primary font-clash-display uppercase leading-[150%]">
                  SMJEŠTAJ
                </span>
              </a>
              <a 
                href="#restoran" 
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="text-[36px] font-normal text-primary font-clash-display uppercase leading-[150%]">
                  RESTORAN
                </span>
              </a>
            </div>

            {/* Badge with stars */}
            <div className="flex items-center gap-4">
              <img src={logo} alt="Toplik Logo" className="w-16 h-16 object-contain" />
              <div>
                <div className="flex gap-1 mb-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-xs uppercase tracking-wider text-primary font-medium leading-tight">
                  Luxury Hotel<br />
                  In the Heart of<br />
                  the Nature
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Links (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center">
            {/* Navigation links */}
            <div className="space-y-6">
              <a 
                href="/apartmani" 
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="text-[64px] font-normal text-primary font-clash-display uppercase leading-[150%]">
                  SMJEŠTAJ
                </span>
              </a>
              <a 
                href="#restoran" 
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowUpRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="text-[64px] font-normal text-primary font-clash-display uppercase leading-[150%]">
                  RESTORAN
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    </AuroraBackground>
  );
};

export default HeroBanner;
