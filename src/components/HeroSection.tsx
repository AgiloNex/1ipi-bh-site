import { useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-church.jpg";

const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        clipPath: isInView
          ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
          : "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
        transition: "clip-path 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Interior da Igreja Vida Nova — luz natural entrando pelas janelas altas do templo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 stained-glass" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      <div className="relative z-20 text-center container-church px-4">
        <AnimatePresence>
          {isInView && (
            <>
              <motion.p
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-gold font-body text-sm uppercase tracking-[0.25em] mb-4"
              >
                Bem-vindo à
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
                style={{ textWrap: "balance" }}
              >
                Igreja
                <br />
                Vida Nova
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-primary-foreground/85 font-body text-lg sm:text-xl max-w-2xl mx-auto mb-10"
              >
                Um lugar de fé, esperança e comunhão. Venha fazer parte da nossa família.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="lg"
                  className="bg-gold text-accent-foreground hover:bg-gold-light font-body font-semibold px-8"
                  asChild
                >
                  <a href="#contato">Entre em Contato</a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-body px-8"
                  asChild
                >
                  <a href="#sobre">Conheça Nossa História</a>
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSection;