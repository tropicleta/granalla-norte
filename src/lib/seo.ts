import type { Metadata } from "next";
import { site } from "./site";
import { serviceArea } from "./local-services";

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

export function rentalPageSchema(path: string, name: string, description: string, parent?: { path: string; name: string }) {
  const url = `${site.url}${path}`;
  const trail = [{ name: "Inicio", path: "" }, ...(parent ? [parent] : []), { name, path }];
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "@id": `${url}#servicio`, name, serviceType: name, url, description, provider: { "@id": businessId }, areaServed: serviceArea },
      { "@type": "BreadcrumbList", itemListElement: trail.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${site.url}${item.path}` })) },
    ],
  };
}
