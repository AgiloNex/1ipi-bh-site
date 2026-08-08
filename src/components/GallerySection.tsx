import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useSiteContent } from "@/context/site-content-context";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%231e2a3a' width='400' height='300'/%3E%3Ctext fill='%23a0aec0' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImagem indisponível%3C/text%3E%3C/svg%3E";

const isValidUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const GallerySection = () => {
  const { galleryImages } = useSiteContent();
  const visibleImages = galleryImages.filter((image) => image.enabled);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [erroredImages, setErroredImages] = useState<Set<string>>(new Set());
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const handleImgError = (id: string) => {
    setErroredImages((prev) => new Set(prev).add(id));
  };

  const goToPrev = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return current > 0 ? current - 1 : visibleImages.length - 1;
    });
  }, [visibleImages.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return current < visibleImages.length - 1 ? current + 1 : 0;
    });
  }, [visibleImages.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape": closeLightbox(); break;
        case "ArrowLeft": goToPrev(); break;
        case "ArrowRight": goToNext(); break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex, closeLightbox, goToPrev, goToNext]);

  useEffect(() => {
    if (selectedIndex === null) return;
    closeButtonRef.current?.focus();
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", handleTab);
    return () => dialog.removeEventListener("keydown", handleTab);
  }, [selectedIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || visibleImages.length <= 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
  };

  return (
    <section id="galeria" className="section-padding bg-background">
      <div className="container-church">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Galeria
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleImages.length > 0 ? (
            visibleImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="gallery-vitral-hover relative group cursor-pointer overflow-hidden rounded-lg aspect-[3/2]"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={erroredImages.has(image.id) ? FALLBACK_IMG : (isValidUrl(image.src) ? image.src : FALLBACK_IMG)}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={() => handleImgError(image.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <span className="text-primary-foreground font-body text-sm font-medium">
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

      <AnimatePresence>
        {selectedIndex !== null && visibleImages[selectedIndex] && (
          <motion.div
            key="lightbox"
            ref={dialogRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={visibleImages[selectedIndex].alt}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {visibleImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-primary-foreground rounded-full p-3 min-h-[48px] min-w-[48px] flex items-center justify-center backdrop-blur-sm transition-colors z-10"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/20 hover:bg-background/40 text-primary-foreground rounded-full p-3 min-h-[48px] min-w-[48px] flex items-center justify-center backdrop-blur-sm transition-colors z-10"
                    aria-label="Próxima"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <img
                src={erroredImages.has(visibleImages[selectedIndex].id) ? FALLBACK_IMG : (isValidUrl(visibleImages[selectedIndex].src) ? visibleImages[selectedIndex].src : FALLBACK_IMG)}
                alt={visibleImages[selectedIndex].alt}
                className="max-w-full max-h-[85vh] w-auto h-auto rounded-lg shadow-2xl"
                onError={() => handleImgError(visibleImages[selectedIndex].id)}
              />
              <button
                ref={closeButtonRef}
                onClick={closeLightbox}
                className="absolute -top-3 -right-3 bg-background rounded-full h-11 w-11 flex items-center justify-center shadow-lg hover:bg-secondary transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground/70 font-body text-sm text-nowrap">
                {visibleImages[selectedIndex].alt}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
