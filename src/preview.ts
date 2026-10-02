import { useEffect, useState } from "react";

import { content } from "./content";
import type { SiteContent } from "./content";

/**
 * Preview mode for the admin editor (store.gensaberilmu.com → Landing Page).
 *
 * The admin embeds this page in an iframe with `?preview=1` and posts the draft
 * content to it. Messages are only accepted from the origins below, and only in
 * preview mode, so the public page can never be changed by a third party.
 */
const ALLOWED_ORIGINS = new Set([
  "https://store.gensaberilmu.com",
  "http://localhost:3000",
]);

const MESSAGE_TYPE = "gensa-landing-preview";
const READY_TYPE = "gensa-landing-preview-ready";

export const isPreviewMode =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "1";

function looksLikeContent(value: unknown): value is SiteContent {
  const site = value as Partial<SiteContent> | null;
  return (
    !!site &&
    typeof site === "object" &&
    !!site.hero &&
    !!site.background &&
    !!site.quickActions &&
    !!site.marketplace &&
    !!site.footer &&
    Array.isArray(site.links) &&
    Array.isArray(site.social) &&
    Array.isArray(site.marketplace.items)
  );
}

export function useSiteContent(): SiteContent {
  const [site, setSite] = useState<SiteContent>(content);

  useEffect(() => {
    if (!isPreviewMode) return;

    const onMessage = (event: MessageEvent) => {
      if (!ALLOWED_ORIGINS.has(event.origin)) return;
      const data = event.data as { type?: string; content?: unknown } | null;
      if (data?.type === MESSAGE_TYPE && looksLikeContent(data.content)) {
        setSite(data.content);
      }
    };

    window.addEventListener("message", onMessage);
    // Tell the parent we can receive content now. No payload, so "*" is safe.
    window.parent.postMessage({ type: READY_TYPE }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return site;
}
