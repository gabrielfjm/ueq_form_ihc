# Cómo escribir el código

El objetivo es un código que parezca escrito por un equipo que conoce el dominio, no un código genérico. En la práctica:

## Nombres
- Dominio en portugués y coherente con la base de datos: `Estudo` (estudio), `Versao` (versión), `Participacao` (participación), `Resposta` (respuesta), `Item` (ítem), `Escala` (escala), `Polaridade` (polaridad)
- Nada de `data`, `info`, `item2`, `handleStuff`, `processData`, `utils.ts`, `helpers.ts`
- Las funciones dicen lo que calculan: `mediaPorEscala` (media por escala), `intervaloConfianca95` (intervalo de confianza del 95 %), `alfaCronbach` (alfa de Cronbach), `marcarSuspeitos` (marcar sospechosos)

## Comentarios
- Solo comentan el **porqué**, nunca el **qué**. Prohibido: `// Importa o React`, `// Função para calcular a média`, `// Handle error`
- Toda regla del protocolo UEQ en el código cita la fuente: `// Handbook UEQ, seção 5: amplitude > 3 indica inconsistência`
- Nada de comentarios en inglés mezclados con portugués
- Sin JSDoc en funciones obvias

## Estructura
- Un archivo con más de ~200 líneas es señal de que hay que dividirlo
- Un componente hace una sola cosa. La lógica de datos va en un Server Component o en una ruta, no en `useEffect` con `fetch`
- Preferir Server Components y Server Actions de Next. Client Component solo donde hay interacción (cuestionario, ventanas, recorrido, filtros del panel)
- Todo acceso a un estudio pasa por `estudoDoPesquisador` o `filtroDeAcesso`. Nunca buscar un estudio solo por el id
- Un botón que llama al servidor es `BotaoEnvio`, con `textoEnviando`. Toda acción completada lo confirma en la pantalla: `MensagemStatus`, `useAnunciar` o `?aviso=` en la página de destino
- Sin capas de abstracción "para el futuro" (repository genérico, factory, service de una sola función)
- Sin `try/catch` que lo envuelva todo. Tratar el error donde se puede hacer algo útil con él
- Sin `any`. Sin `as unknown as`. Tipos de Prisma y de Zod reutilizados, no redeclarados

## Textos de la interfaz
- El texto de pantalla del investigador se escribe en portugués dentro de `t("…")` o, fuera de un componente, de `m("…")`. Los valores entran como marcadores: `t("{nome} convidou você", { nome })` («{nome} le invitó»)
- Después de cambiar un texto, `pnpm i18n:catalogo` genera `src/traducao/catalogo.json`. Una prueba falla si el catálogo está desactualizado
- El texto del participante no pasa por traducción automática: entra en `src/idiomas/textos/`, en los 37 archivos, con el tipo `TextosParticipante` verificando los marcadores
- Para encontrar texto sin `t()`, ejecute con `TRADUCAO_PSEUDO=1`: lo que aparezca sin ⟦ ⟧ quedó fuera

## Documentos
- El `.md` es la fuente única, leída por GitHub y por la pestaña Documentación. Un documento nuevo entra en `src/lib/documentacao/catalogo.ts`, y solo aparece en el sitio después de pasar a la lista `PRONTOS`
- Todo diagrama indica, justo debajo, la herramienta usada y su versión, el archivo fuente para descargar en `docs/documentacao/fontes/` y la versión de la Herramienta UEQ que representa (commit o fecha)
- Después de cambiar un diagrama Mermaid, `pnpm docs:diagramas` vuelve a generar el SVG y el archivo fuente. Una prueba falla si alguno de los dos está desactualizado

## Lo que no puede aparecer
- `console.log` olvidado
- Código comentado
- `TODO` sin nombre y fecha (`// TODO(luiza, 12/11): ...` es aceptable)
- Datos falsos (lorem ipsum, "John Doe", "Acme") fuera de `data/fixtures` y del seed de desarrollo
- Mensajes de error genéricos ("Something went wrong", "Ocorreu um erro" («Se produjo un error»)). Diga qué ocurrió y qué hacer
- README con emojis, badges y una sección "✨ Features"

## Commits
- Pequeños y frecuentes, en portugués, en imperativo, sin emojis: `calcula alfa de Cronbach por escala` (calcula el alfa de Cronbach por escala), `valida itens faltando no questionário` (valida los ítems que faltan en el cuestionario)
- Un commit por cambio lógico. Nada de "update", "fix", "wip" solos
- Cada miembro hace commit de lo que condujo, con su propia cuenta

## Pruebas
- El módulo `src/ueq/` tiene cobertura completa y pruebas contra `data/fixtures` (números de la hoja oficial)
- Nombres de prueba en portugués que describen el comportamiento: `it('marca como suspeito quem é inconsistente em 3 escalas')` (marca como sospechoso a quien es inconsistente en 3 escalas)
- Una pantalla nueva tiene una prueba e2e con `verificarAcessibilidade` (axe-core), incluso en los estados de error. Cada prueba se ejecuta en escritorio y en móvil
- Todo caso de prueba queda registrado en `docs/documentacao/casos-de-teste.md` y en su `.csv`
