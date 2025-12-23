import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { motion, useScroll, useTransform } from "framer-motion";
import toplikLogo from "@/assets/toplik-logo-outline.svg";

const ToplikTimeline = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.5, 0.3]);

  const data = [
    {
      title: "1997",
      content: (
        <div className="space-y-4">
          <h4 className="text-2xl md:text-3xl font-bold text-foreground font-martel mb-3">
            Skromni počeci
          </h4>
          <p className="text-muted-foreground text-base md:text-lg font-martel leading-relaxed">
            Naša priča počinje s malom natkrivenom kolibom i četiri stola. U toploj, domaćinskoj atmosferi, počinjemo graditi ono što će postati jedno od najprepoznatljivijih mjesta za istinsko uživanje u hrani i prirodi.
          </p>
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-golden/10 to-green-accent/10 border border-golden/20 backdrop-blur-sm">
            <p className="text-golden font-martel text-sm italic">
              "Svaki veliki san počinje malim korakom."
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "2000-te",
      content: (
        <div className="space-y-4">
          <h4 className="text-2xl md:text-3xl font-bold text-foreground font-martel mb-3">
            Godine rasta i posvećenosti
          </h4>
          <p className="text-muted-foreground text-base md:text-lg font-martel leading-relaxed mb-4">
            Kroz predan rad i stalno unapređenje, Toplik restoran raste u kapacitetu, kvalitetu i prepoznatljivosti. Danas s ponosom dočekujemo goste u prostoru s više od 250 sjedećih mjesta, uz bogat meni i tim koji istinski voli to što radi.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-golden/5 to-green-accent/5 border border-golden/20">
              <div className="text-3xl font-bold text-golden font-clash-display">250+</div>
              <div className="text-sm text-muted-foreground font-martel mt-1">Sjedećih mjesta</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-golden/5 to-green-accent/5 border border-golden/20">
              <div className="text-3xl font-bold text-golden font-clash-display">20+</div>
              <div className="text-sm text-muted-foreground font-martel mt-1">Godina iskustva</div>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-golden/5 to-green-accent/5 border border-golden/20 col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-golden font-clash-display">∞</div>
              <div className="text-sm text-muted-foreground font-martel mt-1">Zadovoljnih gostiju</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div className="space-y-4">
          <h4 className="text-2xl md:text-3xl font-bold text-foreground font-martel mb-3">
            Izgradnja Toplik Village Resorta
          </h4>
          <p className="text-muted-foreground text-base md:text-lg font-martel leading-relaxed">
            Vođeni željom da gostima pružimo još više, pokrećemo projekat izgradnje Toplik Village Resorta. Nastaju luksuzne vile, wellness sadržaji i nova dimenzija odmora u prirodi – sve osmišljeno kako bi svaki gost doživio mir, udobnost i autentično gostoprimstvo.
          </p>
          <div className="mt-6 grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-golden/10 to-green-accent/10 border border-golden/30">
              <div className="w-2 h-2 rounded-full bg-golden"></div>
              <span className="text-foreground font-martel text-sm md:text-base">Luksuzne vile sa premium sadržajima</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-golden/10 to-green-accent/10 border border-golden/30">
              <div className="w-2 h-2 rounded-full bg-golden"></div>
              <span className="text-foreground font-martel text-sm md:text-base">Wellness centar i spa</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-golden/10 to-green-accent/10 border border-golden/30">
              <div className="w-2 h-2 rounded-full bg-golden"></div>
              <span className="text-foreground font-martel text-sm md:text-base">Nova dimenzija autentičnog gostoprimstva</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative">
      {/* Parallax Logo Background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute bottom-20 left-4 md:left-10 lg:left-20 pointer-events-none z-10"
      >
        <img
          src={toplikLogo}
          alt="Toplik Logo"
          className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"
        />
      </motion.div>
      
      <Timeline data={data} />
    </div>
  );
};

export default ToplikTimeline;
