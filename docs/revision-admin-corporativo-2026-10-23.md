# Revisión del administrador y control corporativo

Fecha: 23 de octubre de 2026. Sitio: granallanorte.cl.

## Alcance

Revisión del código de acceso, sesiones, permisos, operación de demostración,
noticias, mensajes, maquinaria y el portal privado de mandantes. Pruebas aisladas
con cuentas ficticias; no se utilizaron datos reales de clientes. La revisión no
incluye una prueba de penetración ni acceso a las cuentas del proveedor de hosting.

## Hallazgos corregidos

1. **Recuperación de datos locales:** al fallar la lectura de la operación de
   demostración, se mostraban ejemplos pero seguían habilitadas las escrituras;
   el siguiente cambio podía reemplazar la copia anterior. Ahora se bloquean las
   escrituras y se permite descargar el contenido original sin modificarlo.
2. **Cifras de demostración:** el resumen decía «Una mirada a tu empresa» y
   mostraba equipos de ejemplo que no procedían del catálogo compartido. Ahora
   identifica expresamente los ejemplos y ofrece accesos al control real del sitio.
   Inventario, finanzas y obras siguen siendo una demostración local.
3. **Tamaño del ingreso administrativo:** se leía el JSON sin límite de cuerpo.
   Ahora se limita a 4 KB y se rechazan entradas demasiado grandes con HTTP 413.
4. **Sesiones de mandantes:** se aceptaba una variante del token con un punto
   adicional vacío. Se exige la estructura exacta. Este hallazgo no permitía
   acceder a otra cuenta sin una firma válida.
5. **Consultas privadas sin sesión:** se leía el catálogo antes de comprobar si
   había cookie. Ahora se rechaza antes la solicitud sin sesión, incluso cuando
   no hay almacenamiento, evitando consultas innecesarias al almacén.
6. **Descripción de proyectos:** los textos largos se recortaban sin aviso.
   Ahora se rechazan los que exceden el límite, sin guardar información incompleta.
7. **Caché administrativa:** las respuestas de acceso denegado y redirecciones
   de ingreso declaran expresamente que no deben almacenarse en caché.
8. **Acceso del portal:** la ruta principal es `/acceso`. `/mandantes` redirige
   de forma permanente. Se actualizaron los enlaces y las exclusiones de indexación.

## Propuestas: de mayor a menor prioridad

Todas las siguientes son propuestas pendientes; no forman parte de las
correcciones anteriores.

| Orden | Mejora | Situación observada y resultado esperado |
| --- | --- | --- |
| 1 | Llevar inventario, finanzas y obras a almacenamiento compartido | Hoy usan datos de ejemplo y localStorage. Implementar una base central con validaciones, concurrencia y migración revisada; no usar la demostración como registro oficial. |
| 2 | Identidades individuales, roles y doble verificación | Hoy hay una cuenta administrativa `admin` controlada por una variable del servidor. Separar dueño, administración, operaciones y editor; limitar permisos por función. Añadir MFA, recuperación segura y cambio de clave del administrador desde su cuenta. |
| 3 | Bitácora de acciones | Registrar quién creó, cambió, publicó, descargó o retiró cada elemento, cuándo y sobre qué proyecto. Los timestamps actuales no identifican al responsable. No registrar contraseñas ni contenido confidencial en los logs. |
| 4 | Respaldos y restauración comprobada | El administrador no tiene un flujo de recuperación completa de los datos compartidos y sus archivos. Definir respaldo, responsables, plazo de recuperación y pruebas periódicas de restauración. No se verificaron posibles respaldos externos del proveedor. |
| 5 | Revisión antes de publicar o entregar documentos | Las noticias tienen borrador, pero un solo administrador puede publicar. Los archivos del portal quedan visibles al subirlos. Añadir estados «En revisión», «Aprobado» y «Entregado», con responsable y confirmación del mandante y proyecto de destino. |
| 6 | Expediente único por proyecto | Incorporar código de proyecto, empresa, contrato, contactos autorizados, responsable interno, ubicación, fechas y estado. Relacionar la documentación con el mismo proyecto sin duplicar clientes entre módulos. |
| 7 | Control documental | Categorías, revisiones, vigencia, fecha de entrega, búsqueda y orden por parte. Conservar versiones y distinguir el documento vigente. Evaluar una carga segura para archivos mayores a los 3 MB actuales, manteniendo la autorización en cada descarga. |
| 8 | Control de la información institucional | Administrar datos de contacto, servicios, cobertura, textos e imágenes de las páginas desde un panel de configuración. Hoy una parte importante está definida en el código. Incluir vista previa, responsable y revisión para no publicar cambios accidentales. |
| 9 | Tablero con datos reales y acciones pendientes | Mostrar proyectos activos, documentos por revisar, consultas sin responder y vencimientos. Separar claramente el estado del sitio público, la documentación privada y la operación interna; excluir ejemplos de los indicadores de gerencia. |
| 10 | Papelera y recuperación controlada | Retirar un documento actualmente lo oculta, pero conserva el archivo físico. Añadir restauración y una política acordada de retención y eliminación; no borrar automáticamente archivos históricos sin revisión. |
| 11 | Avisos y seguimiento de consultas | Asignar solicitudes, registrar responsable, estado y próxima acción. Proponer avisos de entregas y vencimientos con preferencias de notificación. Hoy «Responder» abre el correo, sin registrar el envío ni la resolución de la consulta. |
| 12 | Escalabilidad de listados y almacenamiento | El portal carga el listado completo y guarda las cuentas/proyectos en un catálogo JSON con ETag global. Para más volumen: paginación y búsqueda del servidor, índices y actualizaciones por entidad, con controles de integridad. |
| 13 | Control editorial y mantenimiento | Historial y reversión de publicaciones, vista previa, revisión de enlaces y datos de contacto; alertas por fallos de almacenamiento y pruebas automáticas antes de publicar. |

## Orden de ejecución propuesto

- **Primera etapa:** almacenamiento real de la operación, cuentas individuales,
  bitácora y respaldo restaurable. Son los cimientos para usar datos corporativos.
- **Segunda etapa:** aprobaciones, expediente de proyectos y control documental.
- **Tercera etapa:** tablero, papelera, avisos, mejoras de escala y mantenimiento.

El cambio de contraseña de un mandante ya está disponible en su portal. La clave
administrativa sigue gestionándose mediante ADMIN_PASSWORD; no se añadió un
cambio de clave administrativo improvisado que eluda el mecanismo existente.

## Verificación de las correcciones

Compilación de producción y análisis de código completados. Pruebas aisladas de
dos mandantes, permisos administrativos, descargas privadas, contraseña y
desactivación, conflictos, persistencia tras reinicio y cuotas de acceso.
Revisión de escritorio y móvil sin errores del navegador ni desbordamientos.
Se comprobó también la redirección a `/acceso`, el rechazo de un ingreso de más
de 4 KB y la conservación y descarga exacta de una copia local dañada, con las
acciones de edición y pago bloqueadas.

## Referencias

- OWASP Authorization Cheat Sheet: permisos mínimos, denegación por defecto y
  validación de autorización en cada solicitud.
  https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- OWASP Logging Cheat Sheet: trazabilidad de autenticación, fallos de permisos y
  eventos relevantes sin guardar secretos.
  https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- OWASP Multifactor Authentication Cheat Sheet: segundo factor y recuperación.
  https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
