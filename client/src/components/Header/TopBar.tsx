import { useState, useEffect } from "react";

const TopBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const contactInfo = (
    <>
      <span className="whitespace-nowrap">Vuka Karadžića 250, 71123 Istočno Novo Sarajevo, BiH</span>
      <span className="mx-2">•</span>
      <a href="mailto:villageresort@toplik.ba" className="hover:opacity-80 transition-opacity whitespace-nowrap">
        villageresort@toplik.ba
      </a>
      <span className="mx-2">•</span>
      <a href="mailto:restoran@toplik.ba" className="hover:opacity-80 transition-opacity whitespace-nowrap">
        restoran@toplik.ba
      </a>
      <span className="mx-2">•</span>
      <a href="tel:+38757321455" className="hover:opacity-80 transition-opacity whitespace-nowrap">
        +387 (0) 57 32 14 55
      </a>
    </>
  );

  return (
    <div className={`bg-primary text-primary-foreground transition-all duration-300 overflow-hidden ${
      isVisible ? 'py-2.5 lg:py-2.5' : 'py-0 h-0'
    }`}>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 text-sm">
            {contactInfo}
          </div>
        </div>
      </div>
      
      {/* Mobile - Scrolling marquee */}
      <div className="lg:hidden h-5 overflow-hidden relative">
        <div className="absolute whitespace-nowrap animate-marquee flex items-center text-xs h-full">
          {contactInfo}
          <span className="mx-4">•</span>
          {contactInfo}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
