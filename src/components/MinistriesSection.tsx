import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ministryIconMap } from "@/lib/site-content";
import { useSiteContent } from "@/context/site-content-context";

const roseAngles = [0, 60, 120, 180, 240, 300];

const MinistriesSection = () => {
  const { ministries } = useSiteContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="ministerios" className="section-padding bg-secondary relative overflow-hidden">
      <div className="container-church relative">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Nossos Ministérios
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-border/20 pointer-events-none" />
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-border/15 pointer-events-none" />
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border border-border/10 pointer-events-none" />
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold/30 pointer-events-none shadow-[0_0_12px_4px_hsl(var(--gold)/0.2)]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0 lg:grid-cols-none lg:block lg:relative">
            {ministries.map((ministry, index) => {
              const Icon = ministryIconMap[ministry.iconName];
              const angle = roseAngles[index] ?? (index * 30);

              return (
                <motion.div
                  key={ministry.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="lg:absolute lg:top-1/2 lg:left-1/2"
                  style={{
                    transform: isInView
                      ? `translate(-50%, -50%) rotate(${angle}deg) translateY(-175px) rotate(-${angle}deg)`
                      : "translate(-50%, -50%)",
                  }}
                >
                  <div className="group w-full lg:w-56 bg-card/80 backdrop-blur-sm rounded-xl p-5 border border-border/40 hover:border-gold/30 transition-all duration-500 hover:shadow-[0_0_12px_-2px_hsl(var(--gold)/0.15)]">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/20 transition-colors duration-500">
                      <Icon className="h-6 w-6 text-primary group-hover:text-gold-ink transition-colors duration-500" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-card-foreground mb-1.5 text-center">
                      {ministry.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed text-center">
                      {ministry.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="h-8 lg:h-[520px]" />
        </div>
      </div>
    </section>
  );
};

export default MinistriesSection;