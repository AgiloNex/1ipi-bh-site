import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ministryIconMap } from "@/lib/site-content";
import { useSiteContent } from "@/context/site-content-context";

const MinistriesSection = () => {
  const { ministries } = useSiteContent();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="ministerios" className="section-padding bg-secondary">
      <div className="container-church">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-body text-sm uppercase tracking-[0.2em] mb-2">Sirva Conosco</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Nossos Ministérios</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry, index) => {
            const Icon = ministryIconMap[ministry.iconName];
            return (
              <motion.div
                key={ministry.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">{ministry.title}</h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">{ministry.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MinistriesSection;
