# Lista de verificación manual de usabilidad y accesibilidad

Lo que la automatización no alcanza, para comprobarlo con sus propias manos antes de cada entrega. Cada bloque corresponde a los [casos de prueba manuales](documentacao/casos-de-teste.md#casos-manuais). En cada ronda, marque el punto en una copia de esta lista, anote el problema y quién lo corrige.

## Lector de pantalla
NVDA + Firefox en Windows, VoiceOver + Safari en iPhone (o TalkBack + Chrome en Android).

- [ ] Cuestionario completo de principio a fin solo escuchando, sin mirar la pantalla
- [ ] Al entrar en un ítem, el lector anuncia el número del ítem, los dos términos y la posición
- [ ] El progreso se anuncia sin interrumpir en cada clic
- [ ] Al enviar incompleto, el lector anuncia el resumen de errores y se puede llegar al ítem que falta
- [ ] En el panel, el gráfico se anuncia con su descripción y la tabla se puede recorrer por celda con el encabezado leído
- [ ] Los mensajes de éxito ("Recogida abierta") se anuncian, y también el texto "Creando el estudio…" del botón
- [ ] Las ventanas (Entrar, Crear cuenta, Salir, eliminar, Compartir, ayuda) anuncian el título al abrirse, retienen el foco y devuelven el foco a quien las abrió
- [ ] El número de avisos de la campana se anuncia, y se puede aceptar una invitación solo escuchando
- [ ] El recorrido guiado se entiende solo escuchando, y se puede omitir
- [ ] En la política de privacidad, "Volver" indica adónde lleva, y el enlace de las ventanas de acceso avisa de que se abre en una pestaña nueva. En Chrome, Firefox y Safari reales, "Cerrar esta pestaña y volver" cierra la pestaña y devuelve la ventana de registro con lo que se había escrito

## Teclado
- [ ] Crear un estudio, abrir la recogida, responder el cuestionario, ver los resultados y exportar sin tocar el ratón
- [ ] Foco siempre visible y nunca oculto detrás del pie de página fijo
- [ ] El orden del foco tiene sentido en todas las pantallas
- [ ] El recorrido, la campana, la ayuda (?) y Compartir funcionan sin ratón; Esc cierra las ventanas
- [ ] En la documentación, el índice, la sección, Volver, Anterior y Siguiente funcionan sin ratón, y el diagrama aparece sin desplazarse

## Visión
- [ ] Zoom del 200 % y del 400 % en el navegador: nada se corta, nada se superpone
- [ ] Ancho de 320 px: sin desplazamiento horizontal
- [ ] Simulación de daltonismo (Chrome DevTools > Rendering > Emulate vision deficiencies): protanopía, deuteranopía, tritanopía, acromatopsia. El gráfico sigue siendo legible
- [ ] Alto contraste de Windows: círculos del cuestionario y foco visibles
- [ ] El bookmarklet de espaciado de texto (WCAG 1.4.12) no rompe el diseño

## Móvil real
- [ ] Abrir el enlace desde WhatsApp y responder todo con el pulgar, de pie
- [ ] Ningún toque accidental en el círculo vecino
- [ ] El teclado virtual no tapa el campo con el foco en los datos demográficos
- [ ] Enlace del participante abierto en un estudio en otro idioma, y en un idioma de derecha a izquierda (árabe, hebreo o persa)
- [ ] Política de privacidad abierta desde el formulario de consentimiento, en el móvil, y "Volver" lleva de vuelta al formulario

## Evaluación heurística (cada uno por su cuenta, después consolidar)
Para cada problema: pantalla, heurística infringida (Nielsen 1 a 10), severidad (0 a 4), sugerencia.

## Prueba con usuarios
- [ ] 5 participantes respondiendo un estudio real, pensando en voz alta
- [ ] 2 a 3 investigadores haciendo: crear un estudio con 2 versiones, abrir la recogida, interpretar el panel, excluir una respuesta sospechosa, exportar a la hoja oficial
- [ ] Registrar éxito, tiempo, errores y comentarios
- [ ] Los investigadores responden el UEQ sobre la herramienta, con la propia herramienta
