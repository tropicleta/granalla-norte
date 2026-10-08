# Posicionamiento de Granalla Norte en Atacama

Fecha: 30 de septiembre de 2026. Cobertura confirmada por el propietario: solo Región de Atacama.

Actualización del 8 de octubre de 2026: la base SEO ya está publicada. La prueba ejecutada contra el dominio público pasó para once páginas, un artículo, sitemap, datos estructurados, canónicas, una URL inexistente y exclusión del acceso administrativo. Se retomó la conexión con Google usando la cuenta de la empresa. Search Console y el Perfil de Empresa siguen pendientes de verificación; no hay mediciones de posición ni tráfico.

Se prepararon títulos de búsqueda más específicos para caminos, obras, cloruro de sodio y áridos, y monitoreo de vibraciones. Las páginas de servicios explican la coordinación desde Tierra Amarilla para Atacama. La portada incluye la identidad WebSite de Granalla Norte. Estos cambios ayudan a describir la empresa y sus servicios; no garantizan posiciones ni indexación.

## Estado y cambios preparados

La versión pública responde correctamente a las comprobaciones SEO. Sin Search Console no se puede confirmar qué páginas ha indexado Google ni las consultas por las que aparece la empresa. Una búsqueda `site:` sin resultados no demuestra que el sitio esté desindexado.

| Hallazgo | Impacto | Evidencia | Cambio |
| --- | --- | --- | --- |
| Servicios reunidos en una página con anclas | Alto | `/servicios` y enlaces de inicio | Cuatro páginas propias con alcance, antecedentes para cotizar, preguntas y enlaces a proyectos publicados |
| Faltaban canónicas individuales | Alto | Metadatos de páginas públicas | URL canónica propia por página, incluyendo noticias y servicios |
| Títulos genéricos | Medio | Servicios, Nosotros y Maquinaria | Títulos y descripciones que explican el servicio y su cobertura en Atacama |
| Sin páginas de servicios en sitemap | Alto | `src/app/sitemap.ts` | Nuevas URLs incluidas en sitemap |
| Sin vínculo entre empresa y servicios en datos estructurados | Medio | JSON-LD de empresa existente | Identificador común de empresa, Service y BreadcrumbList por servicio; Article para proyectos |
| Respuestas de acceso administrativo sin exclusión uniforme | Bajo | Middleware | Cabecera noindex también en acceso y redirecciones administrativas |

No se añadieron calificaciones, reseñas, teléfono, dirección de calle, certificaciones ni disponibilidad de equipos inventados. El catálogo conserva la identificación de equipos de ejemplo. Las preguntas frecuentes están visibles; no se promete un resultado enriquecido de Google.

Validación local: compilación de producción, revisión ESLint del código fuente y TypeScript sin errores. `tests/seo-smoke.mjs` comprueba respuestas de diez páginas, canónicas, sitemap, JSON-LD, un proyecto publicado, una URL inexistente y la exclusión del acceso administrativo. Estas verificaciones no confirman indexación ni posiciones en Google.

## Búsquedas que atiende cada página

Son objetivos editoriales, no datos de volumen de búsqueda ni posiciones medidas.

| Página | Necesidad del cliente |
| --- | --- |
| `/servicios/mantencion-integral-de-caminos` | Mantención de caminos mineros en Atacama, reparación de accesos, nivelación y control de polvo |
| `/servicios/minerales-no-metalicos` | Compra de cloruro de sodio, arena, gravilla, sílice de cuarzo y estabilizado en Atacama |
| `/servicios/monitoreo-de-tronaduras` | Monitoreo de vibraciones por tronaduras y asesoría minera en Atacama |
| `/servicios/obras-civiles` | Obras civiles y mejoras comunitarias en Tierra Amarilla y Copiapó |
| `/maquinaria` | Consulta de arriendo de maquinaria para caminos en Atacama |
| `/equipos-monitoreo` | Arriendo de geófonos y sismógrafos Instantel en Atacama |

## Activación pendiente: conectar Google

1. La base está publicada en `https://www.granallanorte.cl`; las páginas, `/robots.txt` y `/sitemap.xml` pasaron la comprobación pública. Mantener esta comprobación después de cambios de dominio o alojamiento.
2. Entrar con una cuenta de Google propiedad de la empresa a [Search Console](https://search.google.com/search-console). Crear la propiedad de dominio `granallanorte.cl` y añadir el registro TXT que Google entregue en el administrador DNS. No hay que cambiar registros de correo ni sustituir registros existentes. Esta verificación requiere acceso al dominio.
3. Alternativa si no hay acceso DNS: crear una propiedad de prefijo `https://www.granallanorte.cl/`, elegir etiqueta HTML y configurar `GOOGLE_SITE_VERIFICATION` en el alojamiento con **solo el valor de content** entregado por Google. Volver a compilar/publicar y verificar. La integración ya está preparada en el sitio; un valor ficticio no verifica nada.
4. En Search Console, enviar `https://www.granallanorte.cl/sitemap.xml`. Inspeccionar inicio y las cuatro páginas de servicios, revisar la URL canónica elegida y solicitar indexación después de publicar. El envío no garantiza la indexación.
5. Crear o reclamar una ficha existente en [Perfil de Empresa](https://business.google.com/). Usar el nombre real **Granalla Norte** y el sitio **https://www.granallanorte.cl**. Evitar duplicar una ficha existente y no añadir palabras clave al nombre comercial.
6. Elegir la categoría disponible que describa la actividad principal real; añadir categorías secundarias solo cuando correspondan. Completar teléfono, horario y dirección real para verificación cuando Google los solicite. Si no reciben clientes en una oficina, configurar negocio de área de servicio y ocultar la dirección al público. Añadir las localidades de Atacama efectivamente atendidas; confirmar cada localidad y las restricciones de cobertura de Google antes de guardar.
7. Completar los servicios con las cuatro líneas del sitio, fotografías propias y esta descripción propuesta: **Granalla Norte es una empresa de Tierra Amarilla que presta servicios a la minería, la industria y las comunidades de la Región de Atacama. Ofrece mantención de caminos y accesos, suministro de minerales no metálicos, monitoreo de vibraciones por tronaduras, consultoría minera y obras civiles con mano de obra local. Consulta el alcance de tu proyecto y las condiciones de suministro o arriendo de maquinaria.**
8. Completar la verificación que Google solicite. Mantener la titularidad en la cuenta de la empresa. No se han creado cuentas, fichas ni verificaciones durante este trabajo.

## Seguimiento

Registrar la primera fecha en que Search Console muestre datos. Revisar cada mes consultas, páginas, impresiones, clics, posición y solicitudes comerciales recibidas. Priorizar las búsquedas de servicios en Atacama, comparando periodos equivalentes. Publicar proyectos reales con localidad, alcance, fotografías y resultados verificables, y solicitar reseñas honestas a clientes reales sin incentivos. Vincular los proyectos al servicio pertinente.

No se ha medido Core Web Vitals ni velocidad de producción. Después de publicar, comprobar las páginas con [PageSpeed Insights](https://pagespeed.web.dev/) y los datos estructurados con [Rich Results Test](https://search.google.com/test/rich-results). No todos los tipos de Schema generan resultados enriquecidos.

El primer lugar no se puede garantizar mediante configuración SEO. Si se necesita visibilidad inmediata, evaluar una campaña separada de Google Ads por servicio y cobertura en Atacama, con presupuesto autorizado y medición de consultas; los anuncios no mejoran la posición orgánica ni garantizan aparecer siempre primero.

## Fuentes oficiales

- [Guía SEO de Google: visibilidad y límites de las garantías](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- [Crear una propiedad en Search Console](https://support.google.com/webmasters/answer/34592).
- [Verificar la propiedad del sitio](https://support.google.com/webmasters/answer/9008080).
- [Áreas de servicio y dirección del Perfil de Empresa](https://support.google.com/business/answer/9157481).
- [Factores del posicionamiento local: relevancia, distancia y popularidad](https://support.google.com/business/answer/7091).
