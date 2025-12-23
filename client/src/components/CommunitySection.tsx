import communityBg from "@/assets/community-bg.png";
import toplikLogoGold from "@/assets/toplik-logo-gold.png";

const CommunitySection = () => {
  return (
    <section 
      className="relative py-20 md:py-32 px-6 md:px-12 lg:px-24"
      style={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${communityBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Mobile Layout */}
      <div className="lg:hidden relative">
        {/* Background Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img 
            src={toplikLogoGold} 
            alt="Toplik 1997 Logo" 
            className="w-full max-w-xs object-contain opacity-20"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <h2 className="font-clash text-white text-4xl font-normal leading-[150%] mb-6">
            Zajedno gradimo magiju
          </h2>
          
          <p className="font-martel text-white text-base leading-[170%]">
            Ono što Toplik čini posebnim nisu samo arhitektura, lokacija ili gastronomska ponuda – to su ljudi. Zahvaljujući podršci porodice Jovančić, prijatelja i naših vjernih gostiju, Toplik je postao više od odredišta – postao je osjećaj, iskustvo, dom.
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid max-w-7xl mx-auto grid-cols-2 gap-6 items-center">
        {/* Text Content - Left Side */}
        <div className="text-left">
          <h2 className="font-clash text-white text-[64px] font-normal leading-[150%] mb-[120px] whitespace-nowrap">
            Zajedno gradimo magiju
          </h2>
          
          <p className="font-martel text-white text-lg leading-[170%]">
            Ono što Toplik čini posebnim nisu samo arhitektura, lokacija ili gastronomska ponuda – to su ljudi. Zahvaljujući podršci porodice Jovančić, prijatelja i naših vjernih gostiju, Toplik je postao više od odredišta – postao je osjećaj, iskustvo, dom.
          </p>
        </div>

        {/* Logo - Right Side */}
        <div className="flex items-center justify-center">
          <img 
            src={toplikLogoGold} 
            alt="Toplik 1997 Logo" 
            className="w-full max-w-md object-contain opacity-20"
          />
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
