import evChargingStation from "@/assets/ev-charging-station.jpg";

const EVChargingSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="lg:w-1/2">
            <h2 className="text-primary font-clash-display text-[32px] lg:text-[48px] font-normal leading-[150%] mb-6">
              Punjač za električna vozila
            </h2>
            <p className="text-primary font-serif text-base lg:text-lg font-normal leading-[170%]">
              Brinemo o svakom detalju – i vašem vozilu. Za goste koji dolaze električnim automobilom, obezbijedili smo savremen EV punjač direktno u sklopu resorta. Dok vi uživate u odmoru, vaše vozilo puni energiju – sigurno, brzo i jednostavno.
            </p>
          </div>

          {/* Right: Image */}
          <div className="lg:w-1/2">
            <img 
              src={evChargingStation} 
              alt="EV punjač za električna vozila" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EVChargingSection;
