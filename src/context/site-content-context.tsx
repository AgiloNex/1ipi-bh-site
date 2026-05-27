import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { defaultSiteContent, siteContentStorageKey } from "@/lib/site-content";
import type { GalleryItem, MinistryIconName, MinistryItem, SiteContent } from "@/lib/site-content";

type SiteContentContextValue = {
  ministries: MinistryItem[];
  galleryImages: GalleryItem[];
  addMinistry: (ministry: Omit<MinistryItem, "id">) => void;
  updateMinistry: (id: string, updates: Partial<Omit<MinistryItem, "id">>) => void;
  removeMinistry: (id: string) => void;
  moveMinistry: (id: string, direction: "up" | "down") => void;
  addGalleryImage: (image: Omit<GalleryItem, "id">) => void;
  updateGalleryImage: (id: string, updates: Partial<Omit<GalleryItem, "id">>) => void;
  removeGalleryImage: (id: string) => void;
  moveGalleryImage: (id: string, direction: "up" | "down") => void;
  toggleGalleryImage: (id: string) => void;
};

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);

const createId = () => crypto.randomUUID();

const isMinistryIconName = (value: string): value is MinistryIconName =>
  ["Users", "Music", "BookOpen", "Heart", "Baby", "Globe"].includes(value);

const normalizeContent = (raw: unknown): SiteContent => {
  const fallback = defaultSiteContent;

  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const maybeContent = raw as Partial<SiteContent>;

  const ministries = Array.isArray(maybeContent.ministries)
    ? maybeContent.ministries
        .filter((item): item is MinistryItem => {
          return (
            !!item &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.title === "string" &&
            typeof item.description === "string" &&
            typeof item.iconName === "string" &&
            isMinistryIconName(item.iconName)
          );
        })
    : fallback.ministries;

  const galleryImages = Array.isArray(maybeContent.galleryImages)
    ? maybeContent.galleryImages
        .filter((item): item is GalleryItem => {
          return (
            !!item &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.src === "string" &&
            typeof item.alt === "string" &&
            typeof item.enabled === "boolean"
          );
        })
    : fallback.galleryImages;

  return {
    ministries: ministries.length > 0 ? ministries : fallback.ministries,
    galleryImages: galleryImages.length > 0 ? galleryImages : fallback.galleryImages,
  };
};

export const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window === "undefined") {
      return defaultSiteContent;
    }

    const storedValue = window.localStorage.getItem(siteContentStorageKey);
    if (!storedValue) {
      return defaultSiteContent;
    }

    try {
      return normalizeContent(JSON.parse(storedValue));
    } catch {
      return defaultSiteContent;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(siteContentStorageKey, JSON.stringify(content));
  }, [content]);

  const value = useMemo<SiteContentContextValue>(() => {
    const addMinistry = (ministry: Omit<MinistryItem, "id">) => {
      setContent((current) => ({
        ...current,
        ministries: [
          ...current.ministries,
          {
            id: createId(),
            ...ministry,
          },
        ],
      }));
    };

    const updateMinistry = (id: string, updates: Partial<Omit<MinistryItem, "id">>) => {
      setContent((current) => ({
        ...current,
        ministries: current.ministries.map((ministry) =>
          ministry.id === id ? { ...ministry, ...updates } : ministry,
        ),
      }));
    };

    const removeMinistry = (id: string) => {
      setContent((current) => ({
        ...current,
        ministries: current.ministries.filter((ministry) => ministry.id !== id),
      }));
    };

    const moveMinistry = (id: string, direction: "up" | "down") => {
      setContent((current) => {
        const nextMinistries = [...current.ministries];
        const index = nextMinistries.findIndex((item) => item.id === id);
        if (index < 0) {
          return current;
        }

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= nextMinistries.length) {
          return current;
        }

        [nextMinistries[index], nextMinistries[targetIndex]] = [
          nextMinistries[targetIndex],
          nextMinistries[index],
        ];

        return { ...current, ministries: nextMinistries };
      });
    };

    const addGalleryImage = (image: Omit<GalleryItem, "id">) => {
      setContent((current) => ({
        ...current,
        galleryImages: [
          ...current.galleryImages,
          {
            id: createId(),
            ...image,
          },
        ],
      }));
    };

    const updateGalleryImage = (id: string, updates: Partial<Omit<GalleryItem, "id">>) => {
      setContent((current) => ({
        ...current,
        galleryImages: current.galleryImages.map((image) =>
          image.id === id ? { ...image, ...updates } : image,
        ),
      }));
    };

    const removeGalleryImage = (id: string) => {
      setContent((current) => ({
        ...current,
        galleryImages: current.galleryImages.filter((image) => image.id !== id),
      }));
    };

    const moveGalleryImage = (id: string, direction: "up" | "down") => {
      setContent((current) => {
        const nextGalleryImages = [...current.galleryImages];
        const index = nextGalleryImages.findIndex((item) => item.id === id);
        if (index < 0) {
          return current;
        }

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= nextGalleryImages.length) {
          return current;
        }

        [nextGalleryImages[index], nextGalleryImages[targetIndex]] = [
          nextGalleryImages[targetIndex],
          nextGalleryImages[index],
        ];

        return { ...current, galleryImages: nextGalleryImages };
      });
    };

    const toggleGalleryImage = (id: string) => {
      setContent((current) => ({
        ...current,
        galleryImages: current.galleryImages.map((image) =>
          image.id === id ? { ...image, enabled: !image.enabled } : image,
        ),
      }));
    };

    return {
      ministries: content.ministries,
      galleryImages: content.galleryImages,
      addMinistry,
      updateMinistry,
      removeMinistry,
      moveMinistry,
      addGalleryImage,
      updateGalleryImage,
      removeGalleryImage,
      moveGalleryImage,
      toggleGalleryImage,
    };
  }, [content]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }

  return context;
};
