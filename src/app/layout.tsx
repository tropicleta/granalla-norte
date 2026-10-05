import type { Metadata } from "next";
// Fuentes autoalojadas (sin dependencia de Google Fonts en build ni en runtime)
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/outfit";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { businessId, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: site.name,
    images: [{ url: site.images.hero }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": businessId,
  name: site.name,
  url: site.url,
  email: site.email,
  ...(site.phone ? { telephone: site.phone } : {}),
  logo: new URL(site.logo, site.url).href,
  image: new URL(site.images.hero, site.url).href,
  description: site.description,
  areaServed: ["Tierra Amarilla", "Copiapó", "Región de Atacama"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tierra Amarilla",
    addressRegion: "Atacama",
    addressCountry: "CL",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <body className="min-h-dvh flex flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-copper focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      </body>
    </html>
  );
}
