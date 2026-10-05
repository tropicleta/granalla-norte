import type { Metadata } from "next";
import { site } from "./site";

export const businessId = `${site.url}/#empresa`;

export function pageMetadata(path: string, title: string, description: string, image: string = site.images.hero): Metadata {
  const url = `${site.url}${path}`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "es_CL", siteName: site.name, url, title, description, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

// Escape HTML delimiters even when structured data includes editable CMS content.
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
