# Granalla Norte — sitio en Next.js

Refactor visual y técnico de granallanorte.cl (antes en Hostinger Website Builder).

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (tokens en `src/app/globals.css`)
- Fuentes autoalojadas: MuseoModerno (títulos, fuente de marca) + DM Sans (texto)

## Correr en local
```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Estructura
```
src/
  lib/site.ts            ← TODO el contenido (servicios, noticias, clientes, contacto)
  app/
    page.tsx             Inicio
    nosotros/            Quiénes somos, misión, visión y valores
    servicios/           3 líneas de servicio con anclas (#minerales, #asesorias, #obras-civiles)
    noticias/[slug]/     Proyectos (SSG)
    contacto/            Formulario + canales
    api/contacto/        Route handler (envía por Resend si hay RESEND_API_KEY)
    sitemap.ts, robots.ts
  components/            Header, Footer, ContactForm, YouTubeLite, ui.tsx
```

## Variables de entorno (formulario)
```
RESEND_API_KEY=
CONTACT_TO=granalla.norte@gmail.com
CONTACT_FROM="Web Granalla Norte <web@granallanorte.cl>"
```
Sin `RESEND_API_KEY` el formulario responde OK y solo registra el mensaje en consola.

## Pendientes antes de publicar
1. **Teléfono / WhatsApp / dirección**: completar `phone` y `whatsapp` en `src/lib/site.ts` (el sitio actual no los publica).
2. **Imágenes**: hoy se sirven desde el CDN de Hostinger (`assets.zyrosite.com`). Descargarlas a `public/img/` y actualizar las rutas antes de dar de baja el sitio anterior.
3. **Logos de clientes**: se muestran como texto. Reemplazar por SVG/PNG individuales con autorización de cada cliente.
4. **Logo**: idealmente en SVG (hoy es PNG).
5. Las URLs antiguas ya redirigen 301 a las nuevas (`next.config.ts`).

## Deploy
Vercel: importar el repo, agregar variables de entorno y apuntar el dominio `granallanorte.cl`.
