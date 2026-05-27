import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSiteContent } from "@/context/site-content-context";
import type { GalleryItem } from "@/lib/site-content";

const GallerySection = () => {
  const { galleryImages } = useSiteContent();
  const visibleImages = galleryImages.filter((image) => image.enabled);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
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
          {visibleImages.length > 0 ? (
            visibleImages.map((image, index) => (
              <motion.div
                key={image.id}
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
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
              Nenhuma foto ativa na galeria no momento.
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
          {selectedImage && (
            <img
              src={
                selectedImage.src.includes("w=600&h=400")
                  ? selectedImage.src.replace("w=600&h=400", "w=1200&h=800")
                  : selectedImage.src
              }
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
