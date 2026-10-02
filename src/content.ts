import {
  Baby,
  BookOpenText,
  Broadcast,
  Check,
  LinkSimple,
  ShareNetwork,
  ShoppingCart,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

import rawContent from "./content.json";

export type IconName = "ShoppingCart" | "Baby" | "Broadcast" | "BookOpenText" | "Check" | "LinkSimple" | "ShareNetwork";

/** Daftar ikon yang bisa dipilih lewat `icon` di content.json. */
export const ICONS: Record<IconName, Icon> = {
  ShoppingCart,
  Baby,
  Broadcast,
  BookOpenText,
  Check,
  LinkSimple,
  ShareNetwork,
};

export type LinkItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon?: IconName;
  iconSrc?: string;
  featured?: boolean;
  visible: boolean;
};

export type SimpleLink = {
  id: string;
  label: string;
  href: string;
  icon?: IconName;
  iconSrc?: string;
  visible: boolean;
};

export type SiteContent = {
  hero: { logo: string; logoAlt: string; eyebrow: string; title: string; tagline: string };
  background: { poster: string; videoDesktop: string; videoMobile: string };
  quickActions: {
    saveContact: {
      label: string;
      toast: string;
      vcard: { name: string; org: string; phone: string; url: string; instagram: string };
    };
    share: {
      label: string;
      title: string;
      text: string;
      toastShared: string;
      toastCopied: string;
      toastFallback: string;
    };
  };
  links: LinkItem[];
  social: SimpleLink[];
  marketplace: { heading: string; items: SimpleLink[] };
  footer: { text: string; siteUrl: string; icon: string };
};

export const content = rawContent as SiteContent;
