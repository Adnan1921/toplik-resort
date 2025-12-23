import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import logo from "@/assets/logo.png";
import ResortDropdown from "./ResortDropdown";
import RestoranDropdown from "./RestoranDropdown";
import RezervisiDropdown from "./RezervisiDropdown";
import MobileNav from "./MobileNav";

interface NavItem {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Naša Priča", href: "#nasa-prica" },
  { label: "Resort", href: "/apartmani", hasDropdown: true },
  { label: "Restoran", hasDropdown: true },
  { label: "Galerija", href: "#galerija" },
  { label: "Rezerviši", hasDropdown: true },
];

const MainNav = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMouseEnter = (label: string) => {
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <nav 
      className="bg-background/70 backdrop-blur-lg border-b border-border/30"
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex-shrink-0">
            <img src={logo} alt="Toplik Village Resort" className="h-14 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative py-2"
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.label)}
              >
                {item.hasDropdown ? (
                  <a
                    href={item.href}
                    className={`flex items-center gap-1.5 transition-colors font-serif text-[18px] ${
                      openDropdown === item.label 
                        ? 'text-title-text font-extrabold' 
                        : 'text-body-text font-semibold hover:text-title-text hover:font-extrabold'
                    }`}
                  >
                    <span className={openDropdown === item.label ? 'underline underline-offset-4' : ''}>
                      {item.label}
                    </span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`} 
                    />
                  </a>
                ) : (
                  <a
                    href={item.href}
                    className="font-serif text-[18px] text-body-text font-semibold hover:text-title-text hover:font-extrabold transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6 text-title-text" />
          </button>
        </div>
      </div>

      {/* Desktop Mega Menus */}
      <div className="hidden lg:block">
        {/* Resort Mega Menu */}
        {openDropdown === "Resort" && (
          <div onMouseEnter={() => handleMouseEnter("Resort")}>
            <ResortDropdown />
          </div>
        )}

        {/* Restoran Mega Menu */}
        {openDropdown === "Restoran" && (
          <div onMouseEnter={() => handleMouseEnter("Restoran")}>
            <RestoranDropdown />
          </div>
        )}

        {/* Rezerviši Mega Menu */}
        {openDropdown === "Rezerviši" && (
          <div onMouseEnter={() => handleMouseEnter("Rezerviši")}>
            <RezervisiDropdown />
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </nav>
  );
};

export default MainNav;
