# Depuración de la web pública — 9 de octubre de 2026

## Correcciones

- Cotización de maquinaria y equipos: los enlaces llevan el nombre seleccionado al contacto. El formulario preselecciona arriendo y prepara un mensaje editable con equipo, ubicación y fechas. La alternativa por correo conserva el equipo en el asunto.
- Cotización de servicios: los botones de las cuatro páginas y el listado preseleccionan el servicio. Se conserva la entrada anterior `servicio=caminos`.
- Las entradas de URL se limitan en longitud y se muestran con el escape de React. El formulario se reinicia al cambiar el contexto de cotización mediante navegación interna.
- Menú móvil: Escape cierra el menú y devuelve el foco al botón que lo abre.
- Logos de clientes: control de pausa y reanudación. Con movimiento reducido se muestran sin animación, sin duplicados y distribuidos en filas.
- Botones: cobre ligeramente más oscuro para mejorar el contraste del texto blanco. Indicador de foco visible para la navegación con teclado.
- Inicio: «Proyectos destacados» sustituye «Trabajo reciente», que no correspondía a la antigüedad de las publicaciones.
- Contacto: referencias a suministro y monitoreo actualizadas en los textos.

## Límites y pendientes

- Los mensajes se guardan en la bandeja administrativa. No hay un proveedor de notificaciones por correo configurado; requiere una conexión empresarial para enviar avisos reales.
- Las fotos de unidades y los trabajos nuevos deben confirmarse con material real de la empresa.
- El módulo de Operación mantiene su alcance actual; esta revisión corrige la web pública.
- La herramienta de navegador presentó errores de conexión en esta sesión. Las pruebas HTTP y la compilación no sustituyen una comprobación interactiva de teclado ni capturas actuales en móvil.

## Verificación

La prueba `quote-context-smoke.mjs` comprueba los enlaces de cada equipo, las cuatro preselecciones de servicios, la alternativa por correo, el escape de texto recibido en la URL y el contenido actualizado del inicio. Se complementa con compilación, pruebas de sesiones/almacenamiento/editorial y las comprobaciones existentes de SEO y navegación de servicios.
