import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const timeline = [
  { year: "1985", title: "Fundação", description: "Um pequeno grupo de 12 famílias se reuniu pela primeira vez em um salão comunitário." },
  { year: "1995", title: "Primeiro Templo", description: "Inauguração do nosso primeiro templo próprio, com capacidade para 200 pessoas." },
  { year: "2008", title: "Expansão", description: "Abertura de três novas células nos bairros vizinhos e início do projeto social." },
  { year: "2018", title: "Novo Templo", description: "Inauguração do templo atual com 800 lugares e centro de convivência." },
  { year: "2024", title: "Missões", description: "Início do projeto missionário internacional com presença em 5 países." },
];

const TimelineItem = ({ item, index }: { item: typeof timeline[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -50 : 50, filter: "blur(4px)" }}
      animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-center gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-col md:flex-row`}
    >
      <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"} text-center`}>
        <span className="text-gold-ink font-display text-2xl font-bold tabular-nums">{item.year}</span>
        <h3 className="font-display text-xl font-semibold text-foreground mt-1">{item.title}</h3>
        <p className="font-body text-muted-foreground mt-2 max-w-sm mx-auto md:mx-0">{item.description}</p>
      </div>

      <div className="relative flex-shrink-0">
        <div className="w-5 h-5 rounded-full bg-gold border-[5px] border-background shadow-[0_0_0_2px_hsl(var(--gold)/0.3)] transition-shadow duration-500" />
        {index < timeline.length - 1 && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-gold/50 to-transparent" />
        )}
      </div>

      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="sobre" className="section-padding bg-background relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container-church">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Nossa História
          </h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent -translate-x-1/2" />

          <div className="space-y-16">
            {timeline.map((item, index) => (
              <TimelineItem key={item.year} item={item} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 font-body text-sm text-muted-foreground">
            <span className="w-8 h-px bg-border" />
            E a história continua sendo escrita
            <span className="w-8 h-px bg-border" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;