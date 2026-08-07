import { describe, it, expect } from "vitest";
import { defaultSiteContent } from "@/lib/site-content";
import type { MinistryItem, GalleryItem } from "@/lib/site-content";

// Inline the normalizeContent logic to test it directly without React dependencies
// This is the pure logic extracted from site-content-context.tsx
type MinistryIconName = "Users" | "Music" | "BookOpen" | "Heart" | "Baby" | "Globe";

const isMinistryIconName = (value: string): value is MinistryIconName =>
  ["Users", "Music", "BookOpen", "Heart", "Baby", "Globe"].includes(value);

type SiteContent = {
  ministries: MinistryItem[];
  galleryImages: GalleryItem[];
};

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

describe("normalizeContent", () => {
  it("should return default content when raw is null", () => {
    const result = normalizeContent(null);
    expect(result).toEqual(defaultSiteContent);
  });

  it("should return default content when raw is undefined", () => {
    const result = normalizeContent(undefined);
    expect(result).toEqual(defaultSiteContent);
  });

  it("should return default content when raw is a string", () => {
    const result = normalizeContent("invalid");
    expect(result).toEqual(defaultSiteContent);
  });

  it("should return default content when raw is a number", () => {
    const result = normalizeContent(42);
    expect(result).toEqual(defaultSiteContent);
  });

  it("should return default content when raw is an array", () => {
    const result = normalizeContent([]);
    expect(result).toEqual(defaultSiteContent);
  });

  it("should preserve valid ministries", () => {
    const validMinistry: MinistryItem = {
      id: "test-1",
      title: "Test Ministry",
      description: "A test ministry",
      iconName: "Heart",
    };

    const result = normalizeContent({
      ministries: [validMinistry],
      galleryImages: [],
    });

    expect(result.ministries).toHaveLength(1);
    expect(result.ministries[0].title).toBe("Test Ministry");
  });

  it("should filter out ministries with invalid iconName", () => {
    const result = normalizeContent({
      ministries: [
        {
          id: "test-1",
          title: "Valid",
          description: "Desc",
          iconName: "Heart",
        },
        {
          id: "test-2",
          title: "Invalid",
          description: "Desc",
          iconName: "InvalidIcon",
        },
      ] as MinistryItem[],
      galleryImages: [],
    });

    expect(result.ministries).toHaveLength(1);
    expect(result.ministries[0].id).toBe("test-1");
  });

  it("should filter out ministries with missing properties but keep valid ones", () => {
    const result = normalizeContent({
      ministries: [
        { id: "test-1", title: "No description" } as MinistryItem,
        { id: "test-2", title: "Valid", description: "Desc", iconName: "Heart" } as MinistryItem,
      ],
      galleryImages: [],
    });

    expect(result.ministries).toHaveLength(1);
    expect(result.ministries[0].id).toBe("test-2");
  });

  it("should filter out gallery images with non-boolean enabled", () => {
    const result = normalizeContent({
      ministries: [],
      galleryImages: [
        {
          id: "img-1",
          src: "https://example.com/img.jpg",
          alt: "Valid",
          enabled: true,
        },
        {
          id: "img-2",
          src: "https://example.com/img2.jpg",
          alt: "Invalid",
          enabled: "yes",
        },
      ] as unknown as GalleryItem[],
    });

    expect(result.galleryImages).toHaveLength(1);
    expect(result.galleryImages[0].id).toBe("img-1");
  });

  it("should filter out gallery images with missing src", () => {
    const result = normalizeContent({
      ministries: [],
      galleryImages: [
        { id: "img-1", alt: "No src", enabled: true } as GalleryItem,
        { id: "img-2", src: "https://valid.com/img.jpg", alt: "Valid", enabled: true } as GalleryItem,
      ],
    });

    expect(result.galleryImages).toHaveLength(1);
    expect(result.galleryImages[0].id).toBe("img-2");
  });

  it("should fall back to defaults when ministries array is empty after filtering", () => {
    const result = normalizeContent({
      ministries: [],
      galleryImages: defaultSiteContent.galleryImages,
    });

    expect(result.ministries).toEqual(defaultSiteContent.ministries);
  });

  it("should fall back to defaults when galleryImages array is empty after filtering", () => {
    const result = normalizeContent({
      ministries: defaultSiteContent.ministries,
      galleryImages: [],
    });

    expect(result.galleryImages).toEqual(defaultSiteContent.galleryImages);
  });

  it("should handle ministry with empty strings for title and description", () => {
    const result = normalizeContent({
      ministries: [
        {
          id: "empty-1",
          title: "",
          description: "",
          iconName: "Music",
        },
      ],
      galleryImages: [],
    });

    expect(result.ministries).toHaveLength(1);
  });

  it("should handle very long strings without crashing", () => {
    const longString = "a".repeat(10000);
    const result = normalizeContent({
      ministries: [
        {
          id: "long-1",
          title: longString,
          description: longString,
          iconName: "Users",
        },
      ],
      galleryImages: [],
    });

    expect(result.ministries).toHaveLength(1);
    expect(result.ministries[0].title).toHaveLength(10000);
  });

  it("should handle special characters and unicode in ministry fields", () => {
    const result = normalizeContent({
      ministries: [
        {
          id: "unicode-1",
          title: "🎉 Ministério 日本語",
          description: "Description with <script>alert('xss')</script> and 汉字",
          iconName: "Globe",
        },
      ],
      galleryImages: [],
    });

    expect(result.ministries).toHaveLength(1);
    expect(result.ministries[0].title).toBe("🎉 Ministério 日本語");
  });

  it("should handle null items in ministries array", () => {
    const result = normalizeContent({
      ministries: [null, undefined, { id: "valid-1", title: "Valid", description: "Desc", iconName: "Baby" }] as unknown as MinistryItem[],
      galleryImages: [],
    });

    expect(result.ministries).toHaveLength(1);
    expect(result.ministries[0].id).toBe("valid-1");
  });

  it("should handle deeply nested prototype pollution attempts", () => {
    const malicious = JSON.parse('{"ministries": [{"id": "x", "title": "x", "description": "x", "iconName": "Users", "__proto__": {"admin": true}}], "galleryImages": []}');
    const result = normalizeContent(malicious);
    expect(result.ministries).toHaveLength(1);
  });

  it("should return fallback for completely empty object", () => {
    const result = normalizeContent({});
    expect(result.ministries).toEqual(defaultSiteContent.ministries);
    expect(result.galleryImages).toEqual(defaultSiteContent.galleryImages);
  });

  it("should handle malicious JSON with getter injection", () => {
    const result = normalizeContent({
      ministries: [
        {
          get id() { return "injected-id"; },
          get title() { return "Injected"; },
          get description() { return "Injected desc"; },
          get iconName() { return "Music"; },
        } as unknown as MinistryItem,
      ],
      galleryImages: [],
    });

    expect(result.ministries[0].id).toBe("injected-id");
  });
});