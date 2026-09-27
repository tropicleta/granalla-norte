import type { Metadata } from "next";
// Fuentes autoalojadas (sin dependencia de Google Fonts en build ni en runtime)
import "@fontsource-variable/dm-sans";
import "@fontsource/museomoderno/500.css";
import "@fontsource/museomoderno/600.css";
import "@fontsource/museomoderno/700.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
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
  name: site.name,
  url: site.url,
  email: site.email,
  logo: site.logo,
  image: site.images.hero,
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
