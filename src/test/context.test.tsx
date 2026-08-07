import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { SiteContentProvider, useSiteContent } from "@/context/site-content-context";
import { defaultSiteContent, siteContentStorageKey } from "@/lib/site-content";
import type { MinistryItem, MinistryIconName } from "@/lib/site-content";

describe("SiteContentContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SiteContentProvider>{children}</SiteContentProvider>
  );

  describe("initialization", () => {
    it("should initialize with default content when localStorage is empty", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      expect(result.current.ministries).toEqual(defaultSiteContent.ministries);
      expect(result.current.galleryImages).toEqual(defaultSiteContent.galleryImages);
    });

    it("should initialize with stored content from localStorage", () => {
      const customContent = {
        ministries: [
          {
            id: "custom-1",
            title: "Custom Ministry",
            description: "Custom description",
            iconName: "Users" as MinistryIconName,
          },
        ],
        galleryImages: defaultSiteContent.galleryImages,
      };
      localStorage.setItem(siteContentStorageKey, JSON.stringify(customContent));

      const { result } = renderHook(() => useSiteContent(), { wrapper });
      expect(result.current.ministries).toHaveLength(1);
      expect(result.current.ministries[0].title).toBe("Custom Ministry");
    });

    it("should fall back to defaults if localStorage has invalid JSON", () => {
      localStorage.setItem(siteContentStorageKey, "not valid json");

      const { result } = renderHook(() => useSiteContent(), { wrapper });
      expect(result.current.ministries).toEqual(defaultSiteContent.ministries);
    });

    it("should fall back to defaults if localStorage has invalid structure", () => {
      localStorage.setItem(siteContentStorageKey, JSON.stringify({ invalid: true }));

      const { result } = renderHook(() => useSiteContent(), { wrapper });
      expect(result.current.ministries).toEqual(defaultSiteContent.ministries);
    });
  });

  describe("ministry CRUD", () => {
    it("should add a ministry", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });

      act(() => {
        result.current.addMinistry({
          title: "New Ministry",
          description: "New description",
          iconName: "Music",
        });
      });

      const added = result.current.ministries.find((m) => m.title === "New Ministry");
      expect(added).toBeDefined();
      expect(added?.description).toBe("New description");
      expect(added?.iconName).toBe("Music");
      expect(added?.id).toBeDefined();
    });

    it("should update a ministry", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const firstMinistry = result.current.ministries[0];

      act(() => {
        result.current.updateMinistry(firstMinistry.id, {
          title: "Updated Title",
        });
      });

      expect(result.current.ministries[0].title).toBe("Updated Title");
      expect(result.current.ministries[0].description).toBe(firstMinistry.description);
    });

    it("should remove a ministry", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const initialLength = result.current.ministries.length;
      const targetId = result.current.ministries[0].id;

      act(() => {
        result.current.removeMinistry(targetId);
      });

      expect(result.current.ministries).toHaveLength(initialLength - 1);
      expect(result.current.ministries.find((m) => m.id === targetId)).toBeUndefined();
    });

    it("should move a ministry up", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });

      act(() => {
        result.current.moveMinistry(result.current.ministries[1].id, "up");
      });

      expect(result.current.ministries[0].id).toBe(defaultSiteContent.ministries[1].id);
      expect(result.current.ministries[1].id).toBe(defaultSiteContent.ministries[0].id);
    });

    it("should not move the first ministry up", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const before = [...result.current.ministries];

      act(() => {
        result.current.moveMinistry(result.current.ministries[0].id, "up");
      });

      expect(result.current.ministries).toEqual(before);
    });

    it("should not move the last ministry down", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const lastIndex = result.current.ministries.length - 1;
      const before = [...result.current.ministries];

      act(() => {
        result.current.moveMinistry(result.current.ministries[lastIndex].id, "down");
      });

      expect(result.current.ministries).toEqual(before);
    });

    it("should persist to localStorage after add", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });

      act(() => {
        result.current.addMinistry({
          title: "Persist Test",
          description: "Should be in localStorage",
          iconName: "Heart",
        });
      });

      const stored = JSON.parse(localStorage.getItem(siteContentStorageKey) || "{}");
      expect(stored.ministries.some((m: MinistryItem) => m.title === "Persist Test")).toBe(true);
    });
  });

  describe("gallery CRUD", () => {
    it("should add a gallery image", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });

      act(() => {
        result.current.addGalleryImage({
          src: "https://example.com/new.jpg",
          alt: "New image",
          enabled: true,
        });
      });

      const added = result.current.galleryImages.find((img) => img.src === "https://example.com/new.jpg");
      expect(added).toBeDefined();
      expect(added?.alt).toBe("New image");
      expect(added?.enabled).toBe(true);
    });

    it("should toggle gallery image enabled state", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const targetId = result.current.galleryImages[0].id;
      const wasEnabled = result.current.galleryImages[0].enabled;

      act(() => {
        result.current.toggleGalleryImage(targetId);
      });

      expect(result.current.galleryImages[0].enabled).toBe(!wasEnabled);
    });

    it("should update gallery image", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const firstImage = result.current.galleryImages[0];

      act(() => {
        result.current.updateGalleryImage(firstImage.id, {
          alt: "Updated alt text",
        });
      });

      expect(result.current.galleryImages[0].alt).toBe("Updated alt text");
    });

    it("should remove gallery image", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const initialLength = result.current.galleryImages.length;

      act(() => {
        result.current.removeGalleryImage(result.current.galleryImages[0].id);
      });

      expect(result.current.galleryImages).toHaveLength(initialLength - 1);
    });
  });

  describe("error paths", () => {
    it("should throw error when used outside provider", () => {
      expect(() => {
        renderHook(() => useSiteContent());
      }).toThrow("useSiteContent must be used within SiteContentProvider");
    });

    it("should handle removing non-existent ministry without crashing", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const before = result.current.ministries.length;

      act(() => {
        result.current.removeMinistry("non-existent-id");
      });

      expect(result.current.ministries).toHaveLength(before);
    });

    it("should handle moving non-existent ministry without crashing", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const before = [...result.current.ministries];

      act(() => {
        result.current.moveMinistry("non-existent-id", "up");
      });

      expect(result.current.ministries).toEqual(before);
    });

    it("should handle updating non-existent ministry without crashing", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });
      const before = [...result.current.ministries];

      act(() => {
        result.current.updateMinistry("non-existent-id", { title: "Should not appear" });
      });

      expect(result.current.ministries).toEqual(before);
    });
  });

  describe("concurrency-like scenarios", () => {
    it("should handle multiple rapid adds", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addMinistry({
            title: `Ministry ${i}`,
            description: `Description ${i}`,
            iconName: "Users",
          });
        }
      });

      expect(result.current.ministries).toHaveLength(defaultSiteContent.ministries.length + 10);
    });

    it("should handle add, update, remove sequence on same item", () => {
      const { result } = renderHook(() => useSiteContent(), { wrapper });

      let addedId: string;
      act(() => {
        result.current.addMinistry({
          title: "Temp",
          description: "Temp desc",
          iconName: "Baby",
        });
      });
      addedId = result.current.ministries[result.current.ministries.length - 1].id;

      act(() => {
        result.current.updateMinistry(addedId, { title: "Updated Temp" });
      });
      expect(result.current.ministries.find((m) => m.id === addedId)?.title).toBe("Updated Temp");

      act(() => {
        result.current.removeMinistry(addedId);
      });
      expect(result.current.ministries.find((m) => m.id === addedId)).toBeUndefined();
    });
  });
});