# Revisión de Granalla Norte para FOREDE

Fecha: 19 de octubre de 2026. Sitio: https://www.granallanorte.cl.

## Corrección posterior del carrusel

Tras la primera publicación, el propietario informó tirones en escritorio y ausencia de movimiento automático en su móvil. Se retiró el bucle JavaScript de desplazamiento nativo y se volvió a una animación CSS de transformación continua, ejecutada por el compositor del navegador y disponible sin esperar a JavaScript. La animación queda activa también frente a la regla general del sitio que desactiva animaciones, de acuerdo con la solicitud expresa de movimiento continuo.

Se redujeron las tarjetas de 132 px de alto a 100 px en escritorio y 88 px en móvil, junto con su ancho, relleno y separación vertical. Tres grupos idénticos evitan espacios vacíos en pantallas anchas y permiten reiniciar el ciclo sobre la misma disposición de logos. No hay botones, pausa al pasar el puntero ni control de deslizamiento manual: se prioriza el movimiento automático fluido solicitado. Las notas de desplazamiento nativo y teclado más abajo corresponden a la primera implementación y quedan sustituidas por esta corrección.

## Resultado de la revisión

Se revisaron inicio, nosotros, empresas, las cuatro líneas de servicio, maquinaria, equipos de monitoreo, proyectos, filtros por rubro y contacto. El rastreo público inicial y la versión local final recorrieron 49 páginas y variantes, 57 recursos gráficos y 117 enlaces a secciones sin encontrar enlaces rotos, imágenes inexistentes ni anclas ausentes. Son comprobaciones funcionales; no acreditan posiciones en Google ni métricas de usuarios reales.

## Ajustes de esta publicación

- Se conserva el carrusel de los cinco clientes y la repetición continua. Se sustituye el desplazamiento por transformación CSS por desplazamiento nativo compatible con el gesto horizontal del teléfono. El movimiento conserva sus fracciones entre cuadros, incluso cuando el navegador redondea la posición.
- Por solicitud expresa del propietario, no se muestran flechas ni botón de pausa. El puntero del escritorio no detiene el movimiento. Al deslizar manualmente, el carrusel deja terminar el gesto y retoma el recorrido; con la preferencia del sistema de movimiento reducido, el recorrido sigue disponible manualmente.
- Los logos originales siguen presentes como imágenes accesibles; la copia para continuidad queda oculta a lectores de pantalla. Se puede recorrer también con las flechas del teclado.
- El menú compacto se usa hasta 1023 px para evitar que la navegación de escritorio apriete o parta el botón de cotización en tablet.
- La página Empresas, ya existente, se incorpora al menú principal sin duplicar su enlace en el pie.
- Los párrafos se alinean a la izquierda en todos los tamaños, evitando los grandes espacios entre palabras en columnas estrechas. Se conserva la desactivación de guiones automáticos.
- Los botones compartidos permiten texto centrado y mantienen la flecha sin comprimir, respetando el ancho de pantalla.
- Ante un fallo del formulario, el mensaje escrito se conserva y aparece un acceso al correo comercial para continuar la consulta.
- Se actualizan las expectativas antiguas de las pruebas del CMS para comprobar persistencia sobre el catálogo real, sin asumir un inventario de demostración. Se excluyen de la revisión de código las carpetas de compilación y los archivos temporales.

La sustitución del bloque de «22 días» por un proyecto publicado, el acceso a Empresas desde la portada y la configuración de WhatsApp estaban ya incorporados por otra revisión al retomar esta tarea. No se atribuyen a esta publicación ni se sobrescriben.

## Comprobaciones

- Compilación de producción, tipos y reglas de código.
- Rastreo de páginas públicas, recursos y enlaces a secciones.
- Contexto de cotización de maquinaria, equipos y las cuatro líneas de servicio; consultas manipuladas se muestran como texto seguro.
- Canonical, sitemap, robots, estructura de datos emitida por el servidor, página inexistente y exclusión del acceso administrativo de buscadores.
- Filtros por rubro y seis servicios con cobertura territorial y datos de contacto.
- Pruebas locales de autenticación, sesiones, cierre de sesión y límite de intentos.
- Pruebas locales de noticias, borradores, fotos públicas y privadas, conflictos de edición, consultas recibidas, bandeja y persistencia tras reiniciar.
- Pruebas locales de equipos de monitoreo, publicación, validación y persistencia.
- Revisión visual en navegador y pruebas de interacción del carrusel. Los resultados finales y capturas se conservan en `tmp/forede-audit/`.

En la portada se verificaron anchos de 320, 390, 768, 1024 y 1440 px sin desbordamientos horizontales; en móvil de 390 px se recorrieron las ocho páginas principales sin imágenes rotas. Se confirmó movimiento automático después de la carga, ausencia de controles visibles, recorrido por teclado y acceso manual con movimiento reducido. El gesto táctil físico en iPhone/Android queda sin certificar: la emulación del navegador usado no permite inyectar eventos táctiles. La implementación utiliza el desplazamiento nativo del navegador.

El formulario se probó además desde la interfaz: envío válido guardado en almacenamiento local, y rechazo de un nombre vacío que conserva el mensaje y ofrece el enlace a correo.

Los envíos válidos y cambios de administración se prueban exclusivamente con almacenamiento temporal local. No se envían consultas ficticias a la empresa ni se altera su catálogo de producción.

## Propuestas para conversar antes o durante la feria

1. **Un QR dirigido a Empresas.** La página reúne capacidades, proyectos y contacto comercial. Es más útil para un comprador que un código sin una acción clara. Un enlace con referencia de campaña permitiría distinguir después las consultas de la feria si se incorpora esa medición.
2. **Una ficha comercial de una página.** Servicios, zona de operación, tres proyectos reales con fotografías, contacto, QR y datos de la empresa confirmados. Priorizar evidencia de ejecución sobre promesas generales.
3. **Un aviso de participación y ubicación del stand.** Encabezado breve, número de stand y persona de contacto, cuando la empresa confirme estos datos. Debe retirarse o actualizarse al terminar la feria.
4. **Solicitud de reunión breve.** Botón para proponer una conversación de 15 minutos, con disponibilidad real y responsable definido; no publicar horarios inexistentes.
5. **Responder las consultas cada día.** La ruta actual guarda los mensajes en la bandeja administrativa y no envía una notificación por correo. Definir responsable de revisarla durante la feria. Una integración de avisos necesita un proveedor y configuración confirmados; el enlace directo a correo y WhatsApp ya ofrece una alternativa.

Para preparar la ficha y el aviso faltan número de stand, representante y canal preferido durante la feria, y cualquier acreditación que se desee mostrar con respaldo. No se deben inventar certificaciones, disponibilidad inmediata, tiempos de respuesta ni resultados.

## Fecha del evento

El propietario mencionó del 20 al 23 de octubre. Las publicaciones oficiales de CORPROA anuncian Expo FOREDE los días **20, 21 y 22 de octubre de 2026**, en Parque El Pretil, Copiapó. Confirmar si el día 23 corresponde a una actividad adicional de la empresa antes de incorporarlo en piezas públicas.

Fuente: https://www.corproa.cl/2026/04/05/expo-forede-santiago/

## Límites de la revisión

No se afirma una auditoría integral de accesibilidad ni aprobación de certificadores externos. No se han medido Lighthouse, Core Web Vitals de usuarios reales, indexación en Search Console ni recepción efectiva de correos o mensajes de WhatsApp en el teléfono de la empresa. Las fotografías referenciales del catálogo conservan su identificación; corresponde a la empresa confirmar las unidades y disponibilidad antes de cada propuesta.
