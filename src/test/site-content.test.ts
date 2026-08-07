import { describe, it, expect } from "vitest";
import { defaultSiteContent, siteContentStorageKey, ministryIconOptions } from "@/lib/site-content";

describe("defaultSiteContent", () => {
  it("should have 6 default ministries", () => {
    expect(defaultSiteContent.ministries).toHaveLength(6);
  });

  it("should have 6 default gallery images", () => {
    expect(defaultSiteContent.galleryImages).toHaveLength(6);
  });

  it("each ministry should have id, title, description, iconName", () => {
    for (const m of defaultSiteContent.ministries) {
      expect(m).toHaveProperty("id");
      expect(typeof m.id).toBe("string");
      expect(m).toHaveProperty("title");
      expect(typeof m.title).toBe("string");
      expect(m).toHaveProperty("description");
      expect(typeof m.description).toBe("string");
      expect(m).toHaveProperty("iconName");
      expect(typeof m.iconName).toBe("string");
    }
  });

  it("each gallery image should have id, src, alt, enabled", () => {
    for (const img of defaultSiteContent.galleryImages) {
      expect(img).toHaveProperty("id");
      expect(img).toHaveProperty("src");
      expect(img).toHaveProperty("alt");
      expect(img).toHaveProperty("enabled");
      expect(typeof img.enabled).toBe("boolean");
    }
  });

  it("all gallery images should start enabled", () => {
    for (const img of defaultSiteContent.galleryImages) {
      expect(img.enabled).toBe(true);
    }
  });

  it("all gallery images should have valid https URLs", () => {
    for (const img of defaultSiteContent.galleryImages) {
      expect(img.src).toMatch(/^https:\/\//);
    }
  });

  it("all ministry iconNames should be valid ministry icon options", () => {
    const validValues = ministryIconOptions.map((o) => o.value);
    for (const m of defaultSiteContent.ministries) {
      expect(validValues).toContain(m.iconName);
    }
  });

  it("siteContentStorageKey should be defined", () => {
    expect(siteContentStorageKey).toBe("1ipi-bh-site-content");
  });
});

describe("ministryIconOptions", () => {
  it("should have 6 icon options", () => {
    expect(ministryIconOptions).toHaveLength(6);
  });

  it("each option should have value and label", () => {
    for (const opt of ministryIconOptions) {
      expect(opt).toHaveProperty("value");
      expect(opt).toHaveProperty("label");
      expect(typeof opt.value).toBe("string");
      expect(typeof opt.label).toBe("string");
    }
  });

  it("should include all required icon names", () => {
    const values = ministryIconOptions.map((o) => o.value);
    expect(values).toEqual(
      expect.arrayContaining(["Users", "Music", "BookOpen", "Heart", "Baby", "Globe"]),
    );
  });
});

describe("default content invariants", () => {
  it("default content should not be modified by tests", () => {
    expect(defaultSiteContent.ministries.length).toBe(6);
    expect(defaultSiteContent.galleryImages.length).toBe(6);
  });

  it("default ministries should have non-empty titles", () => {
    for (const m of defaultSiteContent.ministries) {
      expect(m.title.trim().length).toBeGreaterThan(0);
    }
  });

  it("default gallery images should have non-empty alt text", () => {
    for (const img of defaultSiteContent.galleryImages) {
      expect(img.alt.trim().length).toBeGreaterThan(0);
    }
  });
});