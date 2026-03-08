import { motion } from "framer-motion";
import { useInView } from "framer-motion";
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
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`flex items-center gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-col md:flex-row`}
    >
      <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"} text-center`}>
        <span className="text-gold font-display text-2xl font-bold">{item.year}</span>
        <h3 className="font-display text-xl font-semibold text-foreground mt-1">{item.title}</h3>
        <p className="font-body text-muted-foreground mt-2 max-w-sm mx-auto md:mx-0">{item.description}</p>
      </div>

      {/* Center dot */}
      <div className="relative flex-shrink-0">
        <div className="w-4 h-4 rounded-full bg-gold border-4 border-background shadow-lg" />
      </div>

      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="sobre" className="section-padding bg-background">
      <div className="container-church">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-body text-sm uppercase tracking-[0.2em] mb-2">Nossa Jornada</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Nossa História</h2>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <TimelineItem key={item.year} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
