import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop", alt: "Culto de adoração" },
  { src: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&h=400&fit=crop", alt: "Grupo de jovens" },
  { src: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop", alt: "Estudo bíblico" },
  { src: "https://images.unsplash.com/photo-1560439513-74b037a25d84?w=600&h=400&fit=crop", alt: "Ação social" },
  { src: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop", alt: "Batismo" },
  { src: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&h=400&fit=crop", alt: "Interior do templo" },
];

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="galeria" className="section-padding bg-background">
      <div className="container-church">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-body text-sm uppercase tracking-[0.2em] mb-2">Momentos Especiais</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Galeria</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group cursor-pointer overflow-hidden rounded-lg aspect-[3/2]"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-navy-deep/0 group-hover:bg-navy-deep/40 transition-colors duration-300 flex items-center justify-center">
                <span className="text-primary-foreground font-body text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
          {selectedImage && (
            <img
              src={selectedImage.src.replace("w=600&h=400", "w=1200&h=800")}
              alt={selectedImage.alt}
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;
