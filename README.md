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
  lib/site.ts            ← contenido institucional y noticias originales de respaldo
  app/
    page.tsx             Inicio
    nosotros/            Quiénes somos, misión, visión y valores
    servicios/           4 líneas de servicio con anclas y páginas propias en [slug]/
    noticias/[slug]/     Noticias publicadas (lectura dinámica)
    contacto/            Formulario + canales
    api/contacto/        Recepción persistente de mensajes privados
    sitemap.ts, robots.ts
  components/            Header, Footer, ContactForm, YouTubeLite, ui.tsx
```

## Noticias y mensajes compartidos

La configuración SEO y los pasos pendientes para Search Console y Perfil de
Empresa están en `docs/seo-atacama.md`. La verificación por etiqueta HTML usa
`GOOGLE_SITE_VERIFICATION` (solo el valor de content proporcionado por Google).

Archivo de Hostinger recuperado el 30/09/2026: seis noticias públicas de 2024 y
un borrador de Hermanos Carrizos pendiente de revisión. El catálogo incorpora
solo entradas recuperadas que falten; cualquier edición o estado guardado en
el almacén prevalece. El próximo guardado persiste el catálogo combinado.
Portadas y fotos se alojan en `public/img`; los videos originales se conservan.
La procedencia y las discrepancias están en `docs/recuperacion-hostinger.md`.

/admin/noticias permite crear y editar noticias, previsualizar, guardar borradores,
publicar y retirar una publicación eligiendo Borrador. Incluye título, fecha,
categoría, resumen, ubicación, mandante, párrafos, destacados y hasta 12 imágenes.
El selector incluye Monitoreo de tronaduras y permite añadir categorías de 2 a 60
caracteres. Al guardar una noticia, su categoría queda disponible en las demás
noticias y en el filtro del administrador; se reutilizan nombres existentes sin
duplicarlos por diferencias de mayúsculas o espacios.
Las noticias originales se conservan como datos iniciales con sus mismas URLs;
la primera edición guarda el catálogo completo. Las URLs quedan fijas al guardar.
La primera imagen es la portada. El servidor valida y convierte las imágenes en
WebP (hasta 2.000 px, sin metadatos); límite de entrada: 3 MB por imagen.

/admin/mensajes permite buscar entre mensajes cargados, cargar páginas de 30,
marcar leído/nuevo, archivar y recuperar archivados. Responder abre el programa de
correo mediante mailto; no envía automáticamente. Los correos históricos o enviados
directamente al correo de la empresa no se importan a esta bandeja.
El formulario confirma recepción solo después de guardar el mensaje.

### Almacenamiento en Vercel

Crear un almacén **Vercel Blob privado** y conectarlo al proyecto granalla-norte.
La conexión añade BLOB_STORE_ID y Vercel gestiona VERCEL_OIDC_TOKEN.
Alternativamente se admite BLOB_READ_WRITE_TOKEN privado, solo en servidor.
No colocar estas variables en NEXT_PUBLIC_* ni en Git. Usar almacenamiento
independiente para Preview si se prueban cambios con datos ficticios.
Volver a desplegar al conectar el almacenamiento.

El catálogo usa escritura condicional por ETag para rechazar ediciones simultáneas;
las lecturas privadas omiten la caché del almacén. Cada mensaje tiene su propio
archivo y versión. Las fotos se sirven por /api/media/ solo si pertenecen a una
noticia publicada o la petición tiene sesión de administrador. No hay una ruta de
lectura pública para mensajes. Las fotos de borradores no pasan por el optimizador
de Next ni por una caché pública. Las noticias se leen dinámicamente en inicio,
listado, detalle y sitemap. Todas las API administrativas vuelven a verificar
sesión en el servidor y las escrituras comprueban el origen.

Protección de contacto: validación y límites de tamaño, campo trampa y cuota
compartida de cinco envíos por IP en ventanas de 15 minutos, persistida con control
de concurrencia. No se guarda la IP, solo su hash con una sal privada. Para abuso
distribuido complementar con Vercel Firewall. Las imágenes quitadas se conservan
en el almacén pero dejan de estar disponibles al público si ya no aparecen en una
noticia publicada; no se realiza borrado irreversible automático.

Sin almacenamiento configurado, las noticias originales siguen visibles y el
contacto ofrece el correo directo. Los editores indican la configuración pendiente;
la API devuelve 503 en lugar de fingir un guardado. Un fallo de un almacén ya
configurado se muestra como error y no reemplaza el catálogo por datos antiguos.

Para desarrollo, CONTENT_LOCAL_DIR puede apuntar a .content-local (ignorado por
Git). Es un adaptador de archivos exclusivo de local y pruebas; se desactiva cuando
existe VERCEL. No usarlo como almacenamiento de producción.

## Pendientes antes de publicar
1. **Teléfono / WhatsApp / dirección**: completar `phone` y `whatsapp` en `src/lib/site.ts` (el sitio actual no los publica).
2. **Imágenes**: incluidas en `public/img/`; la web no depende del CDN de Hostinger.
3. **Logos de clientes**: carrusel con las cinco marcas del sitio anterior, alojadas en `public/img/clients/`; incluye pausa y respeta la preferencia de movimiento reducido.
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

Los módulos Operación (inventario, finanzas, obras y maquinaria) usan datos ficticios y guardan
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

node tests/cms-smoke.mjs levanta un servidor aislado en 3102, usa una carpeta
temporal y una contraseña aleatoria y comprueba edición de originales, borradores,
publicación, imágenes privadas, conflictos, validación, recepción, bandeja privada,
estados, cuota y persistencia tras reiniciar el servidor. También verifica el
rechazo de guardados sin almacenamiento. No escribe en el almacén de producción.
