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
Sin `RESEND_API_KEY` se muestra un enlace directo al correo y la API rechaza
el envío con estado 503, sin anunciar una entrega inexistente.

## Pendientes antes de publicar
1. **Teléfono / WhatsApp / dirección**: completar `phone` y `whatsapp` en `src/lib/site.ts` (el sitio actual no los publica).
2. **Imágenes**: incluidas en `public/img/`; la web no depende del CDN de Hostinger.
3. **Logos de clientes**: se muestran como texto. Reemplazar por SVG/PNG individuales con autorización de cada cliente.
4. **Logo**: idealmente en SVG (hoy es PNG).
5. Las URLs antiguas redirigen de forma permanente (308) a las nuevas (`next.config.ts`).

## Deploy
Vercel: importar el repo, agregar variables de entorno y apuntar el dominio `granallanorte.cl`.

El proyecto está conectado a `tropicleta/granalla-norte`, rama `main`.
Dominio principal: `www.granallanorte.cl`; el dominio raíz redirige con 308.
DNS web en Hostinger: A `@` a `216.198.79.1` y CNAME `www` a
`eea39c8d0e8f71c8.vercel-dns-017.com` (valores indicados por Vercel al migrar).
Los registros MX, SPF, DKIM, DMARC y autoconfiguración de correo se conservan.

## Modelo de administración

Disponible en `/admin`, con acceso desde el pie del sitio. Incluye resumen,
inventario, finanzas, obras y maquinaria; permite crear y editar registros,
buscar, marcar pagos y exportar una copia JSON.

Acceso con usuario `admin` y contraseña privada `ADMIN_PASSWORD` (variable
de entorno de servidor en Vercel, mínimo 12 caracteres). No guardar la
contraseña en Git ni en una variable `NEXT_PUBLIC_*`. Sin configuración,
el acceso permanece cerrado. `/admin/login` permite iniciar sesión y
`/api/admin/logout` la cierra mediante POST. La sesión firmada caduca a las
8 horas y usa una cookie HttpOnly, Secure en producción y SameSite=Strict.
Cambiar la contraseña y volver a desplegar invalida las sesiones anteriores.
Los intentos de acceso tienen un límite por IP y por instancia del servidor;
para una protección distribuida se debe complementar con Vercel Firewall.

El panel usa datos ficticios y guarda
los cambios únicamente en el navegador, con la clave
`granalla-norte-admin-demo-v1`. No ingresar datos confidenciales de operación.
La base de datos compartida y los permisos de varias cuentas quedan pendientes.
Los datos locales siguen presentes en el navegador al cerrar sesión: usar
un equipo de confianza. El flujo neto representa cobros menos pagos,
no utilidad contable. La exportación es un respaldo; no incluye importación.

## Verificación

`npm run build` comprueba tipos, reglas de código y rutas.
Con Node 24, `node --test tests/admin-session.test.mjs` comprueba firmas,
caducidad y rechazo de sesiones manipuladas. Para evitar conflictos con
una vista previa local, compilar con `NEXT_BUILD_DIR=.next-verification`
(en PowerShell: `$env:NEXT_BUILD_DIR = '.next-verification'` y luego
`npm run build`). `node tests/site-smoke.mjs` utiliza esa compilación y
levanta un servidor temporal en el puerto 3100
y verifica páginas, anclas, login, cookies, bloqueo de rutas, logout y
límite de intentos con una contraseña aleatoria exclusiva de la prueba.
