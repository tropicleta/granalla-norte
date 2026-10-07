import type { NextConfig } from "next";
import recoveredNews from "./src/lib/recovered-news.json";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  images: {
    // Imágenes actuales alojadas en el CDN de Hostinger/Zyro.
    // Recomendado: migrarlas a /public o a un bucket propio antes de dar de baja el sitio antiguo.
    remotePatterns: [
      { protocol: "https", hostname: "assets.zyrosite.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    // Mantiene el SEO de las URLs del sitio anterior.
    return [
      { source: "/servicios/mantencion-de-caminos", destination: "/servicios/mantencion-integral-de-caminos", permanent: true },
      { source: "/noticias", has: [{ type: "query", key: "rubro", value: "mantencion-de-caminos" }], destination: "/noticias?rubro=mantencion-integral-de-caminos", permanent: true },
      ...recoveredNews.map(post => ({ source: `/${"legacySlug" in post ? post.legacySlug : post.slug}`, destination: `/noticias/${post.slug}`, permanent: true })),
      { source: "/granalla-norte", destination: "/nosotros", permanent: true },
      { source: "/-granlla-norte-presente-en-la-expo-forede-2025-", destination: "/noticias/expo-forede-2025", permanent: true },
      { source: "/ventas-de-cloruro-de-sodio-para-minera-maricunga", destination: "/noticias/ventas-de-cloruro-de-sodio-para-minera-maricunga", permanent: true },
      { source: "/mejora-sede-social-villa-los-forjadores", destination: "/noticias/mejora-sede-social-villa-los-forjadores", permanent: true },
      { source: "/mejora-escuela-paul-harris", destination: "/noticias/mejora-escuela-paul-harris", permanent: true },
    ];
  },
};

export default nextConfig;
