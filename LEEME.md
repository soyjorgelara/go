# Gestor de oportunidades — Áreas de interés

Abre `index.html` en el navegador. Mantén `styles.css`, `script.js` y la carpeta `assets` junto al HTML. No necesita instalación ni compilación.

## Incluido

- Accordions nativos accesibles con ratón y teclado.
- Checkboxes, selección de categoría completa, tags y contadores sincronizados.
- Botón de papelera deshabilitado en vacío y borrado total inmediato.
- Recuperación automática del empty state.
- Composición web a 1440 px, panel de intereses en modal a 1024 px y accordions mobile a 402 px. Adaptación continua entre tamaños.
- Recursos gráficos de Figma guardados localmente. Poppins y Material Symbols se cargan desde Google Fonts y requieren conexión.

## Alcance y decisiones

Los enlaces suministrados corresponden a pantallas web. Los modales de filtros/intereses y los accordions mobile siguen las capturas suministradas en la actualización. La vista de resultados sigue el nodo 11991:178630.

Se conserva el contenido de las variantes recuperadas de Figma, incluso los textos de muestra: “Fecha inicio”, “Bambo” y la repetición de Deporte. Negocios reutiliza en la referencia el componente Deporte; conserva por ello sus opciones. El catálogo se puede ajustar al principio de `script.js` cuando se cuente con los datos definitivos.

Los contadores se calculan a partir de las opciones reales: Danza contiene cuatro opciones, aunque el badge estático de Figma dice tres. Tus intereses muestra la cantidad real de tags, corrigiendo el cero de la captura con selección.

Continuar se habilita con al menos un interés. Emite el evento `interests:continue` en `document`, con la selección en `event.detail.interests`; no se inventó una pantalla posterior. Ayuda, perfil e inicio se presentan como referencia visual. Filtros abre un modal con búsqueda en vivo por subcategoría, insensible a acentos y mayúsculas; Aplicar filtros cierra el modal. Limpiar filtros y Ver todas las categorías restauran la lista conservando selecciones. Los modales cierran con X, clic fuera y Escape, mediante dialog nativo.

## Verificación

Comprobado en Chrome a anchos de ventana internos de 1440, 1024 y 402 px: abrir/cerrar, agregar, desmarcar, eliminar tags, borrar todo, actualizar contador, habilitar/deshabilitar y recuperar el empty state. Sin desbordamiento horizontal ni imágenes rotas en esos tamaños.

Actualización verificada: búsqueda con múltiples coincidencias, coincidencia única, sin resultados, restauración de lista, apertura y cierre de modales, tags/borrado dentro del modal y cambio de ancho sin perder selección.
