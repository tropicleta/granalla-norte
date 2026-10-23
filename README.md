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

## Administración para una sola persona

El inicio en `/admin` muestra pendientes reales de mandantes, proyectos y
consultas. La navegación se concentra en Inicio, Mandantes, Mensajes, Página web,
Respaldos y Mi cuenta. La guía de uso está en `docs/guia-administradora.md`.

El usuario sigue siendo `admin`. La clave inicial y de firma procede de
`ADMIN_PASSWORD` (mínimo 12 caracteres, solo en servidor). Después de cambiar
la contraseña en `/admin/cuenta` se usa el hash privado guardado en
`settings/admin-account.json`. Las sesiones firmadas incorporan una revisión
que se comprueba en cada API, página privada y descarga administrativa. Cambiar
o recuperar la contraseña invalida las sesiones anteriores y conserva la actual.
La cookie es HttpOnly, Secure en producción y SameSite=Strict; dura ocho horas.
No quitar ADMIN_PASSWORD: sigue siendo la clave del servidor para las firmas.

Al cambiar o recuperar la contraseña se muestran seis códigos privados nuevos.
Solo se conservan sus hashes. La administradora debe descargarlos y guardarlos
fuera del sitio; permiten recuperar el acceso en `/admin/recuperar`. Al usar
uno se reemplazan todos. No hay envío de recuperación por correo ni registro de
nuevos administradores. Sin códigos, el responsable del alojamiento puede cambiar
ADMIN_PASSWORD y desplegar: esto invalida las sesiones y restablece el acceso
inicial con la nueva clave del servidor, sin borrar documentos ni proyectos.
La recuperación y los cambios de clave tienen cuotas compartidas y comprueban
origen. La protección adicional de la plataforma puede complementar el ingreso.

Los documentos admiten categorías y búsqueda por nombre o archivo dentro del
proyecto. Retirar un documento lo mueve a papelera, accesible solo a la cuenta
administrativa. Recuperarlo lo devuelve a su parte original; si el proyecto o la
parte se retiraron al restaurar una versión anterior, se reconstruyen al recuperar
el documento. No hay eliminación física automática.

Antes de guardar cambios del portal se crea una copia privada de proyectos y
papelera. Se muestran los últimos 30 cambios en Respaldos. Restaurar un estado no
restablece cuentas, correos, contraseñas ni accesos antiguos. Los archivos que
salgan de los proyectos se conservan en papelera. Los cambios exclusivos de cuenta
figuran en el historial sin opción de restaurar credenciales. Las copias antiguas
sin referencia y las subidas cuyo guardado final falle se conservan privadas;
no se realiza una limpieza irreversible automática.

`/api/admin/respaldo` descarga un ZIP privado con datos de mandantes y todos sus
archivos activos y retirados. Admite filtro por clientId. Incluye proyectos.json y
los archivos originales, sin contraseñas ni códigos. Límite por descarga: 50 MB o
1000 documentos; la interfaz permite elegir un mandante. No incluye los catálogos
de noticias, maquinaria ni mensajes. La restauración en el panel usa las copias
automáticas; el ZIP sirve como copia externa y permite volver a cargar archivos.
Conservar las copias descargadas en un lugar privado. Las copias automáticas
comparten el almacén privado; el ZIP descargado permite conservar otra copia fuera.

Inventario, finanzas y obras siguen siendo demostraciones locales, separadas en
`/admin/operacion`. Conservan la clave `granalla-norte-admin-demo-v1` y no
comparten registros entre dispositivos. No ingresar datos confidenciales de la
operación. Si una copia local está dañada, las escrituras quedan bloqueadas y se
puede descargar el contenido original para recuperación.

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

## Portal de mandantes

`/acceso` permite iniciar sesión con correo y contraseña, consultar únicamente
los proyectos de la cuenta, descargar sus documentos y cambiar la contraseña.
El enlace «Acceso mandantes» está en la cabecera y el pie del sitio.

`/admin/mandantes` incluye listado con búsqueda, creación y edición de cuentas,
activación/desactivación y restablecimiento de contraseña. El administrador crea
los proyectos, define su estado y descripción, indica de 1 a 100 partes y puede
dar nombre a cada parte. Dentro de ellas carga, renombra y retira documentos.
No se pueden quitar partes con documentos. Los documentos son visibles de inmediato
para el mandante: revisar el proyecto y la parte antes de subirlos.

Archivos: hasta 3 MB por documento, PDF, Word, Excel, CSV, TXT, JPG, PNG o ZIP.
Las descargas siempre se entregan como adjuntos privados y comprueban la cuenta
en el servidor; conocer el identificador de un documento no da acceso a él.
Los archivos retirados dejan de poder descargarse por el portal; no se eliminan
físicamente de Blob. Una subida cuyo guardado final falle puede dejar un archivo
sin referencia, inaccesible por el portal. El catálogo usa ETag para evitar que
una edición sobrescriba cambios simultáneos; ante conflicto, actualizar el listado.

Reutiliza el almacén privado de Vercel descrito arriba (`cms/portal/`) y
`ADMIN_PASSWORD` de al menos 12 caracteres. No requiere otra clave ni usa
almacenamiento del navegador. En desarrollo admite `CONTENT_LOCAL_DIR`.
Las contraseñas usan scrypt con sal individual. Las sesiones duran ocho horas;
desactivar una cuenta, cambiar su correo o restablecer/cambiar la contraseña
invalida sus sesiones. Cada petición vuelve a comprobar el estado de la cuenta.
Los intentos de acceso tienen cuotas persistentes por cuenta y origen durante
15 minutos. La contraseña inicial se entrega manualmente por un canal privado;
no hay envío de correos automático ni autorregistro.

Verificación aislada: compilar con `NEXT_BUILD_DIR=.next-portal-check` y ejecutar
`node tests/portal-smoke.mjs`. Usa cuentas aleatorias y una carpeta temporal,
comprueba aislamiento, permisos, documentos privados, concurrencia, contraseñas,
desactivación, persistencia tras reinicio y límites de acceso. No toca producción.

### Comprobaciones de administración simple

Con `NEXT_BUILD_DIR=.next-portal-verify` compilado, `node tests/small-admin-smoke.mjs`
verifica el tablero real, categorías, papelera, restauración de proyectos,
respaldo ZIP con sus archivos, ausencia de credenciales en las copias, cambio y
recuperación de contraseña administrativa, invalidación de sesiones y persistencia.
El modo visual usa `PORTAL_PLAYWRIGHT` y `PORTAL_BROWSER_CHANNEL` opcionales;
crea mandantes y proyectos desde la interfaz y comprueba escritorio y celular.
Todos los datos son ficticios y se guardan en una carpeta temporal aislada.

La actualización correctiva mantiene Next.js en la rama 15.5 (15.5.28). El override
de PostCSS dentro de Next fija la rama compatible 8.5.31 o posterior, en lugar de
la 8.4.31 que ese paquete fija por defecto. `npm audit` no reporta vulnerabilidades
al finalizar esta implementación. El ZIP usa fflate en el servidor; no agrega la
biblioteca al código que descargan los mandantes.
