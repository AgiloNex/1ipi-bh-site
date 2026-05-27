import { Baby, BookOpen, Globe, Heart, Music, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type MinistryIconName = "Users" | "Music" | "BookOpen" | "Heart" | "Baby" | "Globe";

export type MinistryItem = {
  id: string;
  title: string;
  description: string;
  iconName: MinistryIconName;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  enabled: boolean;
};

export type SiteContent = {
  ministries: MinistryItem[];
  galleryImages: GalleryItem[];
};

export const ministryIconOptions: Array<{ value: MinistryIconName; label: string }> = [
  { value: "Users", label: "Pessoas / Comunhão" },
  { value: "Music", label: "Louvor" },
  { value: "BookOpen", label: "Escola Bíblica" },
  { value: "Heart", label: "Ação Social" },
  { value: "Baby", label: "Crianças" },
  { value: "Globe", label: "Missões" },
];

export const ministryIconMap: Record<MinistryIconName, LucideIcon> = {
  Users,
  Music,
  BookOpen,
  Heart,
  Baby,
  Globe,
};

export const defaultSiteContent: SiteContent = {
  ministries: [
    {
      id: "jovens",
      iconName: "Users",
      title: "Jovens",
      description: "Encontros semanais com louvor, palavra e comunhão para jovens de 15 a 30 anos.",
    },
    {
      id: "louvor",
      iconName: "Music",
      title: "Louvor",
      description: "Ministério de adoração com ensaios e participação nos cultos e eventos especiais.",
    },
    {
      id: "escola-biblica",
      iconName: "BookOpen",
      title: "Escola Bíblica",
      description: "Estudos aprofundados da Palavra para todas as idades, aos domingos pela manhã.",
    },
    {
      id: "acao-social",
      iconName: "Heart",
      title: "Ação Social",
      description: "Projetos de auxílio a comunidades carentes com alimentos, roupas e capacitação.",
    },
    {
      id: "criancas",
      iconName: "Baby",
      title: "Crianças",
      description: "Programação especial para crianças de 0 a 12 anos durante os cultos.",
    },
    {
      id: "missoes",
      iconName: "Globe",
      title: "Missões",
      description: "Apoio a missionários nacionais e internacionais em 5 países diferentes.",
    },
  ],
  galleryImages: [
    {
      id: "gallery-1",
      src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&h=400&fit=crop",
      alt: "Culto de adoração",
      enabled: true,
    },
    {
      id: "gallery-2",
      src: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=600&h=400&fit=crop",
      alt: "Grupo de jovens",
      enabled: true,
    },
    {
      id: "gallery-3",
      src: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop",
      alt: "Estudo bíblico",
      enabled: true,
    },
    {
      id: "gallery-4",
      src: "https://images.unsplash.com/photo-1560439513-74b037a25d84?w=600&h=400&fit=crop",
      alt: "Ação social",
      enabled: true,
    },
    {
      id: "gallery-5",
      src: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&h=400&fit=crop",
      alt: "Batismo",
      enabled: true,
    },
    {
      id: "gallery-6",
      src: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=600&h=400&fit=crop",
      alt: "Interior do templo",
      enabled: true,
    },
  ],
};

export const siteContentStorageKey = "1ipi-bh-site-content";
