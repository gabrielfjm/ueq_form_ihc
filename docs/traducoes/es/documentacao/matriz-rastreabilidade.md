# Matriz de trazabilidad

Cada uno de los 94 requisitos vinculado a quien lo pidió ([personas](personas.md) e [historias de usuario](historias-de-usuario.md)), a lo que hace la herramienta ([casos de uso](casos-de-uso.md)), a lo que demuestra que funciona ([casos de prueba](casos-de-teste.md)), al sprint en que se entregó y al código. La misma matriz está en [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) y en la [hoja de requisitos](planilha-requisitos.xlsx).

## Cómo leerla

- Lea una fila de izquierda a derecha para ir de la petición a la prueba: quién lo quiere, qué hace la herramienta, qué prueba lo comprueba y dónde está el código.
- Léala al revés antes de cambiar un archivo: busque la ruta en la columna Código y vea qué requisitos y qué pruebas dependen de él.
- **Código** indica los archivos principales a partir de la raíz del repositorio. `(pesquisador)/` abrevia `src/app/(ferramenta)/(pesquisador)/` y `(publico)/` abrevia `src/app/(ferramenta)/(publico)/`. Una ruta que termina en `/` es la carpeta entera.
- Los requisitos no funcionales no tienen caso de uso: valen para todas las pantallas.

## Requisitos funcionales

### Acceso y cuenta

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF01](requisitos.md#rf01) Crear cuenta | [HU01](historias-de-usuario.md#hu01) | [UC01](casos-de-uso.md#uc01) | [PE01](personas.md#pe01) | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07), [CT-E08](casos-de-teste.md#ct-e08), [CT-E90](casos-de-teste.md#ct-e90) | Sprint 03 · Autenticación | `(publico)/_acesso/FormularioCadastro.tsx`, `(publico)/_acesso/acoes.ts`, `src/lib/validacao-conta.ts` |
| [RF02](requisitos.md#rf02) Iniciar y cerrar sesión | [HU01](historias-de-usuario.md#hu01) | [UC02](casos-de-uso.md#uc02) | [PE01](personas.md#pe01) | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E08](casos-de-teste.md#ct-e08), [CT-E58](casos-de-teste.md#ct-e58), [CT-E90](casos-de-teste.md#ct-e90) | Sprint 03 · Autenticación | `(publico)/_acesso/FormularioEntrar.tsx`, `(publico)/_acesso/acoes.ts`, `src/lib/sessao.ts` |
| [RF03](requisitos.md#rf03) Proteger el área del investigador | [HU22](historias-de-usuario.md#hu22) | [UC02](casos-de-uso.md#uc02) | [PE02](personas.md#pe02) | [CT-E04](casos-de-teste.md#ct-e04) | Sprint 03 · Autenticación | `src/proxy.ts`, `src/lib/sessao.ts` |
| [RF04](requisitos.md#rf04) Editar los datos de la cuenta | [HU17](historias-de-usuario.md#hu17) | [UC03](casos-de-uso.md#uc03) | [PE01](personas.md#pe01) | [CT-E09](casos-de-teste.md#ct-e09) | Sprint 03 · Autenticación | `(pesquisador)/conta/FormularioDados.tsx`, `(pesquisador)/conta/acoes.ts` |
| [RF05](requisitos.md#rf05) Cambiar la contraseña | [HU22](historias-de-usuario.md#hu22) | [UC03](casos-de-uso.md#uc03) | [PE02](personas.md#pe02) | [CT-E10](casos-de-teste.md#ct-e10) | Sprint 03 · Autenticación | `(pesquisador)/conta/FormularioSenha.tsx`, `(pesquisador)/conta/acoes.ts` |
| [RF06](requisitos.md#rf06) Eliminar la cuenta | [HU17](historias-de-usuario.md#hu17) | [UC03](casos-de-uso.md#uc03) | [PE01](personas.md#pe01) | [CT-E11](casos-de-teste.md#ct-e11) | Sprint 03 · Autenticación | `(pesquisador)/conta/ExcluirConta.tsx`, `(pesquisador)/conta/acoes.ts` |
| [RF07](requisitos.md#rf07) Descargar mis datos | [HU17](historias-de-usuario.md#hu17) | [UC03](casos-de-uso.md#uc03) | [PE01](personas.md#pe01) | [CT-E81](casos-de-teste.md#ct-e81) | LGPD | `src/app/api/conta/dados/route.ts` |
| [RF08](requisitos.md#rf08) Elegir el idioma de la herramienta | [HU26](historias-de-usuario.md#hu26) | [UC01](casos-de-uso.md#uc01), [UC03](casos-de-uso.md#uc03) | [PE03](personas.md#pe03) | [CT-E67](casos-de-teste.md#ct-e67), [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95), [CT-U62](casos-de-teste.md#ct-u62), [CT-U63](casos-de-teste.md#ct-u63), [CT-U66](casos-de-teste.md#ct-u66), [CT-U67](casos-de-teste.md#ct-u67), [CT-U68](casos-de-teste.md#ct-u68), [CT-U78](casos-de-teste.md#ct-u78) | Idiomas de la herramienta | `(pesquisador)/SeletorIdioma.tsx`, `(pesquisador)/conta/idioma/`, `src/traducao/` |
| [RF09](requisitos.md#rf09) Recorrido guiado en el primer acceso | [HU02](historias-de-usuario.md#hu02) | [UC04](casos-de-uso.md#uc04) | [PE01](personas.md#pe01) | [CT-E66](casos-de-teste.md#ct-e66), [CT-M22](casos-de-teste.md#ct-m22) | Equipo y ayuda | `src/componentes/tutorial/` |
| [RF10](requisitos.md#rf10) Ayuda en cada página | [HU02](historias-de-usuario.md#hu02) | [UC04](casos-de-uso.md#uc04) | [PE01](personas.md#pe01) | [CT-E65](casos-de-teste.md#ct-e65) | Equipo y ayuda | `src/componentes/ajuda/BotaoAjuda.tsx`, `src/lib/ajuda.ts` |
| [RF11](requisitos.md#rf11) Página de inicio | [HU01](historias-de-usuario.md#hu01) | [UC02](casos-de-uso.md#uc02) | [PE01](personas.md#pe01) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60), [CT-E61](casos-de-teste.md#ct-e61), [CT-E69](casos-de-teste.md#ct-e69), [CT-E70](casos-de-teste.md#ct-e70) | Página de inicio y ventanas | `(publico)/PaginaInicial.tsx`, `(publico)/conteudo.ts`, `(publico)/_acesso/Acesso.tsx` |

### Estudios

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF12](requisitos.md#rf12) Listar los estudios | [HU07](historias-de-usuario.md#hu07) | [UC05](casos-de-uso.md#uc05) | [PE01](personas.md#pe01) | [CT-E12](casos-de-teste.md#ct-e12), [CT-E17](casos-de-teste.md#ct-e17) | Sprint 04 · Estudios | `(pesquisador)/estudos/page.tsx`, `src/lib/estudos.ts` |
| [RF13](requisitos.md#rf13) Crear estudio | [HU03](historias-de-usuario.md#hu03), [HU04](historias-de-usuario.md#hu04) | [UC06](casos-de-uso.md#uc06) | [PE01](personas.md#pe01) | [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E93](casos-de-teste.md#ct-e93), [CT-M14](casos-de-teste.md#ct-m14) | Sprint 04 · Estudios | `(pesquisador)/estudos/formulario/`, `(pesquisador)/estudos/acoes.ts`, `src/lib/validacao-estudo.ts` |
| [RF14](requisitos.md#rf14) Editar estudio | [HU15](historias-de-usuario.md#hu15) | [UC07](casos-de-uso.md#uc07) | [PE01](personas.md#pe01) | [CT-E18](casos-de-teste.md#ct-e18) | Sprint 04 · Estudios | `(pesquisador)/estudos/[id]/editar/`, `(pesquisador)/estudos/acoes.ts` |
| [RF15](requisitos.md#rf15) Abrir, cerrar y reabrir la recogida | [HU06](historias-de-usuario.md#hu06), [HU14](historias-de-usuario.md#hu14) | [UC08](casos-de-uso.md#uc08) | [PE01](personas.md#pe01) | [CT-E15](casos-de-teste.md#ct-e15) | Sprint 04 · Estudios | `(pesquisador)/estudos/[id]/BotaoColeta.tsx`, `src/lib/status-estudo.ts`, `src/app/r/[slug]/page.tsx` |
| [RF16](requisitos.md#rf16) Copiar el enlace público | [HU06](historias-de-usuario.md#hu06) | [UC09](casos-de-uso.md#uc09) | [PE01](personas.md#pe01) | [CT-E16](casos-de-teste.md#ct-e16) | Sprint 04 · Estudios | `(pesquisador)/estudos/[id]/LinkPublico.tsx`, `src/lib/estudos.ts` |
| [RF17](requisitos.md#rf17) Eliminar estudio | [HU16](historias-de-usuario.md#hu16) | [UC10](casos-de-uso.md#uc10) | [PE01](personas.md#pe01) | [CT-E19](casos-de-teste.md#ct-e19) | Sprint 04 · Estudios | `(pesquisador)/estudos/[id]/AcoesEstudo.tsx`, `(pesquisador)/estudos/acoes.ts` |
| [RF18](requisitos.md#rf18) Activar la recogida de datos demográficos | [HU05](historias-de-usuario.md#hu05) | [UC06](casos-de-uso.md#uc06) | [PE01](personas.md#pe01) | [CT-E71](casos-de-teste.md#ct-e71) | Equipo y ayuda | `(pesquisador)/estudos/formulario/FormularioEstudo.tsx`, `src/app/r/[slug]/sobre-voce/` |
| [RF19](requisitos.md#rf19) Elegir el idioma del estudio | [HU03](historias-de-usuario.md#hu03), [HU27](historias-de-usuario.md#hu27) | [UC06](casos-de-uso.md#uc06) | [PE01](personas.md#pe01), [PE03](personas.md#pe03) | [CT-E45](casos-de-teste.md#ct-e45) | Idiomas de la herramienta | `(pesquisador)/estudos/formulario/FormularioEstudo.tsx`, `src/idiomas/index.ts` |

### Equipo y notificaciones

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF20](requisitos.md#rf20) Compartir estudio | [HU20](historias-de-usuario.md#hu20) | [UC11](casos-de-uso.md#uc11) | [PE02](personas.md#pe02) | [CT-E63](casos-de-teste.md#ct-e63) | Equipo y ayuda | `(pesquisador)/estudos/[id]/Compartilhar.tsx`, `(pesquisador)/estudos/[id]/acoes-compartilhar.ts` |
| [RF21](requisitos.md#rf21) Aceptar o rechazar una invitación | [HU20](historias-de-usuario.md#hu20) | [UC12](casos-de-uso.md#uc12) | [PE02](personas.md#pe02) | [CT-E63](casos-de-teste.md#ct-e63) | Equipo y ayuda | `(pesquisador)/SinoNotificacoes.tsx`, `(pesquisador)/notificacoes/acoes.ts` |
| [RF22](requisitos.md#rf22) Campana de notificaciones | [HU07](historias-de-usuario.md#hu07), [HU21](historias-de-usuario.md#hu21) | [UC13](casos-de-uso.md#uc13) | [PE01](personas.md#pe01), [PE02](personas.md#pe02) | [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64), [CT-M21](casos-de-teste.md#ct-m21) | Equipo y ayuda | `(pesquisador)/SinoNotificacoes.tsx`, `src/lib/notificacoes.ts` |
| [RF23](requisitos.md#rf23) Notificaciones por correo electrónico | [HU21](historias-de-usuario.md#hu21) | [UC03](casos-de-uso.md#uc03), [UC13](casos-de-uso.md#uc13) | [PE02](personas.md#pe02) | [CT-U59](casos-de-teste.md#ct-u59) | Equipo y ayuda | `src/lib/email.ts`, `src/lib/modelo-email.ts`, `(pesquisador)/conta/PreferenciaEmail.tsx` |

### Cuestionario del participante

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF24](requisitos.md#rf24) Responder sin cuenta | [HU29](historias-de-usuario.md#hu29) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E05](casos-de-teste.md#ct-e05), [CT-E21](casos-de-teste.md#ct-e21), [CT-E52](casos-de-teste.md#ct-e52), [CT-M14](casos-de-teste.md#ct-m14) | Sprint 05 · Cuestionario | `src/app/r/[slug]/`, `src/proxy.ts` |
| [RF25](requisitos.md#rf25) Consentimiento | [HU04](historias-de-usuario.md#hu04), [HU28](historias-de-usuario.md#hu28), [HU37](historias-de-usuario.md#hu37) | [UC14](casos-de-uso.md#uc14) | [PE01](personas.md#pe01), [PE04](personas.md#pe04), [PE07](personas.md#pe07) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28), [CT-E82](casos-de-teste.md#ct-e82), [CT-E91](casos-de-teste.md#ct-e91), [CT-E92](casos-de-teste.md#ct-e92), [CT-U69](casos-de-teste.md#ct-u69), [CT-M25](casos-de-teste.md#ct-m25) | Sprint 05 · Cuestionario | `src/app/r/[slug]/Termo.tsx`, `src/app/r/[slug]/termo/`, `src/lib/termo.ts` |
| [RF26](requisitos.md#rf26) Distribuir a los participantes entre las versiones | [HU10](historias-de-usuario.md#hu10) | [UC14](casos-de-uso.md#uc14) | [PE01](personas.md#pe01) | [CT-U30](casos-de-teste.md#ct-u30) | Sprint 05 · Cuestionario | `src/lib/balanceamento.ts` |
| [RF27](requisitos.md#rf27) Responder los 26 ítems | [HU29](historias-de-usuario.md#hu29), [HU35](historias-de-usuario.md#hu35) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04), [PE05](personas.md#pe05) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E24](casos-de-teste.md#ct-e24), [CT-M02](casos-de-teste.md#ct-m02), [CT-M17](casos-de-teste.md#ct-m17) | Sprint 05 · Cuestionario | `src/componentes/ItemDiferencial.tsx`, `src/app/r/[slug]/questionario/FormularioQuestionario.tsx` |
| [RF28](requisitos.md#rf28) Seguir el progreso | [HU29](historias-de-usuario.md#hu29) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E22](casos-de-teste.md#ct-e22), [CT-M03](casos-de-teste.md#ct-m03) | Sprint 05 · Cuestionario | `src/app/r/[slug]/questionario/RodapeProgresso.tsx` |
| [RF29](requisitos.md#rf29) Avisar de los ítems que faltan | [HU30](historias-de-usuario.md#hu30) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E23](casos-de-teste.md#ct-e23), [CT-M04](casos-de-teste.md#ct-m04) | Sprint 05 · Cuestionario | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx`, `src/componentes/formulario/ResumoErros.tsx` |
| [RF30](requisitos.md#rf30) Recuperar las respuestas marcadas | [HU31](historias-de-usuario.md#hu31) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E26](casos-de-teste.md#ct-e26), [CT-E68](casos-de-teste.md#ct-e68) | Sprint 05 · Cuestionario | `src/app/r/[slug]/questionario/useRascunho.ts` |
| [RF31](requisitos.md#rf31) Salir sin enviar | [HU32](historias-de-usuario.md#hu32) | [UC17](casos-de-uso.md#uc17) | [PE04](personas.md#pe04) | [CT-E27](casos-de-teste.md#ct-e27) | Sprint 05 · Cuestionario | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx`, `src/app/r/[slug]/saiu/` |
| [RF32](requisitos.md#rf32) Datos demográficos opcionales | [HU33](historias-de-usuario.md#hu33) | [UC16](casos-de-uso.md#uc16) | [PE04](personas.md#pe04) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E71](casos-de-teste.md#ct-e71) | Sprint 05 · Cuestionario | `src/app/r/[slug]/sobre-voce/`, `src/lib/demografia.ts` |
| [RF33](requisitos.md#rf33) Finalizar y no responder de nuevo | [HU34](historias-de-usuario.md#hu34) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28) | Sprint 05 · Cuestionario | `src/app/r/[slug]/acoes.ts`, `src/app/r/[slug]/fim/`, `src/lib/participacao.ts` |
| [RF34](requisitos.md#rf34) Responder en 37 idiomas | [HU27](historias-de-usuario.md#hu27), [HU36](historias-de-usuario.md#hu36) | [UC15](casos-de-uso.md#uc15) | [PE03](personas.md#pe03), [PE06](personas.md#pe06) | [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-E68](casos-de-teste.md#ct-e68), [CT-E83](casos-de-teste.md#ct-e83), [CT-U45](casos-de-teste.md#ct-u45), [CT-U47](casos-de-teste.md#ct-u47), [CT-U48](casos-de-teste.md#ct-u48), [CT-U49](casos-de-teste.md#ct-u49), [CT-U50](casos-de-teste.md#ct-u50), [CT-M24](casos-de-teste.md#ct-m24) | Sprint de idiomas | `src/idiomas/`, `src/app/r/[slug]/SeletorIdioma.tsx` |
| [RF35](requisitos.md#rf35) Traducir los textos del estudio | [HU27](historias-de-usuario.md#hu27) | [UC15](casos-de-uso.md#uc15) | [PE03](personas.md#pe03) | [CT-U63](casos-de-teste.md#ct-u63) | Idiomas de la herramienta | `src/traducao/servidor.ts`, `src/traducao/claude.ts` |

### Cálculo del UEQ

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF36](requisitos.md#rf36) Recodificar las respuestas | [HU18](historias-de-usuario.md#hu18) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05), [CT-U06](casos-de-teste.md#ct-u06) | Sprint 02 · Cálculo | `src/ueq/recodificar.ts` |
| [RF37](requisitos.md#rf37) Estadísticas por escala | [HU18](historias-de-usuario.md#hu18), [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U21](casos-de-teste.md#ct-u21) | Sprint 02 · Cálculo | `src/ueq/estatistica.ts`, `src/ueq/escalas.ts` |
| [RF38](requisitos.md#rf38) Interpretar las medias | [HU08](historias-de-usuario.md#hu08), [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE01](personas.md#pe01), [PE02](personas.md#pe02) | [CT-U13](casos-de-teste.md#ct-u13) | Sprint 02 · Cálculo | `src/ueq/escalas.ts` |
| [RF39](requisitos.md#rf39) Calidad pragmática y hedónica | [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U20](casos-de-teste.md#ct-u20) | Sprint 02 · Cálculo | `src/ueq/index.ts`, `src/ueq/itens.ts` |
| [RF40](requisitos.md#rf40) Clasificar en el benchmark | [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17), [CT-U20](casos-de-teste.md#ct-u20) | Sprint 02 · Cálculo | `src/ueq/benchmark.ts`, `data/benchmark.json` |
| [RF41](requisitos.md#rf41) Media por ítem | [HU09](historias-de-usuario.md#hu09) | [UC19](casos-de-uso.md#uc19) | [PE01](personas.md#pe01) | [CT-U15](casos-de-teste.md#ct-u15) | Sprint 02 · Cálculo | `src/ueq/escalas.ts` |
| [RF42](requisitos.md#rf42) Calcular solo con quienes están en el análisis | [HU12](historias-de-usuario.md#hu12) | [UC19](casos-de-uso.md#uc19) | [PE01](personas.md#pe01) | [CT-U18](casos-de-teste.md#ct-u18), [CT-U19](casos-de-teste.md#ct-u19), [CT-U22](casos-de-teste.md#ct-u22) | Sprint 02 · Cálculo | `src/ueq/index.ts`, `src/lib/resultados.ts` |

### Resultados

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF43](requisitos.md#rf43) Panel de resultados | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29), [CT-M14](casos-de-teste.md#ct-m14) | Sprint 06 · Resultados | `(pesquisador)/estudos/[id]/resultados/`, `src/graficos/EscalasComBenchmark.tsx` |
| [RF44](requisitos.md#rf44) Lectura rápida | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-U42](casos-de-teste.md#ct-u42) | Sprint 06 · Resultados | `src/lib/leitura-rapida.ts` |
| [RF45](requisitos.md#rf45) Avisos de alfa bajo y muestra pequeña | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E30](casos-de-teste.md#ct-e30), [CT-U21](casos-de-teste.md#ct-u21) | Sprint 06 · Resultados | `(pesquisador)/estudos/[id]/resultados/VisaoUmaVersao.tsx`, `src/componentes/Avisos.tsx` |
| [RF46](requisitos.md#rf46) Gráfico por ítem | [HU09](historias-de-usuario.md#hu09) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29) | Sprint 06 · Resultados | `src/graficos/MediasPorItem.tsx` |
| [RF47](requisitos.md#rf47) Comparar versiones | [HU10](historias-de-usuario.md#hu10) | [UC20](casos-de-uso.md#uc20) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29), [CT-U43](casos-de-teste.md#ct-u43) | Sprint 06 · Resultados | `(pesquisador)/estudos/[id]/resultados/VisaoComparacao.tsx`, `src/lib/leitura-rapida.ts` |
| [RF48](requisitos.md#rf48) Guardar la vista en la dirección | [HU10](historias-de-usuario.md#hu10) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29) | Sprint 06 · Resultados | `(pesquisador)/estudos/[id]/resultados/ControlesResultados.tsx` |
| [RF49](requisitos.md#rf49) Explicar los términos | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | — | Sprint 06 · Resultados | `(pesquisador)/estudos/[id]/resultados/Explicacoes.tsx` |
| [RF50](requisitos.md#rf50) Ver los datos demográficos | [HU13](historias-de-usuario.md#hu13) | [UC21](casos-de-uso.md#uc21) | [PE01](personas.md#pe01) | [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60) | LGPD | `(pesquisador)/estudos/[id]/resultados/demograficos/`, `src/graficos/Demografia.tsx`, `src/lib/perfil-demografico.ts` |

### Respuestas y sospechas

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF51](requisitos.md#rf51) Marcar respuestas sospechosas | [HU12](historias-de-usuario.md#hu12) | [UC24](casos-de-uso.md#uc24) | [PE01](personas.md#pe01) | [CT-E33](casos-de-teste.md#ct-e33), [CT-U19](casos-de-teste.md#ct-u19), [CT-U23](casos-de-teste.md#ct-u23), [CT-U24](casos-de-teste.md#ct-u24), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28) | Sprint 07 · Sospechas | `src/ueq/inconsistencia.ts`, `data/protocolo.json` |
| [RF52](requisitos.md#rf52) Tabla de participaciones | [HU12](historias-de-usuario.md#hu12) | [UC23](casos-de-uso.md#uc23) | [PE01](personas.md#pe01) | [CT-E33](casos-de-teste.md#ct-e33), [CT-E36](casos-de-teste.md#ct-e36), [CT-U36](casos-de-teste.md#ct-u36) | Sprint 07 · Sospechas | `(pesquisador)/estudos/[id]/respostas/TabelaParticipacoes.tsx`, `src/lib/participacoes.ts` |
| [RF53](requisitos.md#rf53) Ver las escalas de un participante | [HU12](historias-de-usuario.md#hu12) | [UC23](casos-de-uso.md#uc23) | [PE01](personas.md#pe01) | [CT-E35](casos-de-teste.md#ct-e35) | Sprint 07 · Sospechas | `(pesquisador)/estudos/[id]/respostas/TabelaParticipacoes.tsx` |
| [RF54](requisitos.md#rf54) Quitar y devolver respuestas al análisis | [HU12](historias-de-usuario.md#hu12) | [UC23](casos-de-uso.md#uc23) | [PE01](personas.md#pe01) | [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34) | Sprint 07 · Sospechas | `(pesquisador)/estudos/[id]/respostas/acoes.ts` |
| [RF55](requisitos.md#rf55) Recalcular las sospechas | [HU39](historias-de-usuario.md#hu39) | [UC32](casos-de-uso.md#uc32) | [PE08](personas.md#pe08) | [CT-M16](casos-de-teste.md#ct-m16) | Sprint 07 · Sospechas | `prisma/recalcular-suspeitas.ts` |

### Exportación e importación

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF56](requisitos.md#rf56) Exportar respuestas brutas | [HU23](historias-de-usuario.md#hu23) | [UC25](casos-de-uso.md#uc25) | [PE02](personas.md#pe02) | [CT-E37](casos-de-teste.md#ct-e37), [CT-U31](casos-de-teste.md#ct-u31), [CT-U32](casos-de-teste.md#ct-u32), [CT-U35](casos-de-teste.md#ct-u35) | Sprint 08 · Exportación | `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` |
| [RF57](requisitos.md#rf57) Exportar respuestas recodificadas | [HU23](historias-de-usuario.md#hu23) | [UC25](casos-de-uso.md#uc25) | [PE02](personas.md#pe02) | [CT-E37](casos-de-teste.md#ct-e37), [CT-U32](casos-de-teste.md#ct-u32), [CT-U37](casos-de-teste.md#ct-u37) | Sprint 08 · Exportación | `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` |
| [RF58](requisitos.md#rf58) Exportar resultados por escala | [HU11](historias-de-usuario.md#hu11) | [UC25](casos-de-uso.md#uc25) | [PE01](personas.md#pe01) | [CT-E37](casos-de-teste.md#ct-e37), [CT-U32](casos-de-teste.md#ct-u32), [CT-U33](casos-de-teste.md#ct-u33), [CT-U38](casos-de-teste.md#ct-u38) | Sprint 08 · Exportación | `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` |
| [RF59](requisitos.md#rf59) Exportar en la hoja oficial del UEQ | [HU18](historias-de-usuario.md#hu18) | [UC25](casos-de-uso.md#uc25) | [PE02](personas.md#pe02) | [CT-E37](casos-de-teste.md#ct-e37), [CT-E96](casos-de-teste.md#ct-e96), [CT-U34](casos-de-teste.md#ct-u34), [CT-U70](casos-de-teste.md#ct-u70) | Sprint 09 · Revisión final | `src/lib/planilha-oficial.ts`, `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts`, `data/planilha-oficial/` |
| [RF60](requisitos.md#rf60) Exportar el panel en PDF | [HU11](historias-de-usuario.md#hu11) | [UC22](casos-de-uso.md#uc22) | [PE01](personas.md#pe01) | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40), [CT-E41](casos-de-teste.md#ct-e41) | Sprint 10 · Extensiones | `src/app/api/estudos/[id]/painel-pdf/route.ts`, `(pesquisador)/estudos/[id]/resultados/impressao/` |
| [RF61](requisitos.md#rf61) Importar respuestas por CSV | [HU19](historias-de-usuario.md#hu19) | [UC26](casos-de-uso.md#uc26) | [PE02](personas.md#pe02) | [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43), [CT-E44](casos-de-teste.md#ct-e44), [CT-U36](casos-de-teste.md#ct-u36), [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41) | Sprint 10 · Extensiones | `(pesquisador)/estudos/[id]/respostas/importar/`, `src/lib/importacao.ts` |
| [RF62](requisitos.md#rf62) Aplicar el UEQ-S | [HU25](historias-de-usuario.md#hu25) | [UC27](casos-de-uso.md#uc27) | [PE02](personas.md#pe02) | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-U77](casos-de-teste.md#ct-u77), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-E102](casos-de-teste.md#ct-e102), [CT-M26](casos-de-teste.md#ct-m26) | UEQ-S | `src/ueq/ueq-s.ts`, `data/ueq-s-itens-ptbr.json`, `data/ueq-s-idiomas.json`, `data/benchmark-ueq-s.json`, `data/protocolo-ueq-s.json`, `data/fixtures-ueq-s/` |

### Documentación

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF63](requisitos.md#rf63) Pestaña Documentación | [HU44](historias-de-usuario.md#hu44) | [UC28](casos-de-uso.md#uc28) | [PE08](personas.md#pe08) | [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E50](casos-de-teste.md#ct-e50), [CT-E62](casos-de-teste.md#ct-e62), [CT-E84](casos-de-teste.md#ct-e84), [CT-E85](casos-de-teste.md#ct-e85), [CT-E87](casos-de-teste.md#ct-e87), [CT-U54](casos-de-teste.md#ct-u54), [CT-U55](casos-de-teste.md#ct-u55), [CT-U57](casos-de-teste.md#ct-u57), [CT-U64](casos-de-teste.md#ct-u64) | Sprint de documentación | `(publico)/documentacao/`, `src/lib/documentacao/` |
| [RF64](requisitos.md#rf64) Diagramas a pantalla completa | [HU44](historias-de-usuario.md#hu44) | [UC28](casos-de-uso.md#uc28) | [PE08](personas.md#pe08) | [CT-E57](casos-de-teste.md#ct-e57), [CT-U55](casos-de-teste.md#ct-u55) | Sprint de documentación | `(publico)/documentacao/ArtigoDocumento.tsx` |
| [RF65](requisitos.md#rf65) Enlaces y descargas de la documentación | [HU44](historias-de-usuario.md#hu44) | [UC28](casos-de-uso.md#uc28) | [PE08](personas.md#pe08) | [CT-E49](casos-de-teste.md#ct-e49), [CT-E51](casos-de-teste.md#ct-e51), [CT-E86](casos-de-teste.md#ct-e86), [CT-U54](casos-de-teste.md#ct-u54), [CT-U56](casos-de-teste.md#ct-u56), [CT-U65](casos-de-teste.md#ct-u65) | Sprint de documentación | `src/lib/documentacao/markdown.ts`, `src/app/api/documentacao/[...caminho]/route.ts` |

### Administración

| Requisito | Historias | Casos de uso | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|---|
| [RF66](requisitos.md#rf66) Gestionar cuentas | [HU41](historias-de-usuario.md#hu41) | [UC29](casos-de-uso.md#uc29) | [PE08](personas.md#pe08) | — | Equipo y ayuda | `(pesquisador)/administracao/contas/`, `src/lib/administracao.ts` |
| [RF67](requisitos.md#rf67) Escenarios de demostración | [HU42](historias-de-usuario.md#hu42) | [UC30](casos-de-uso.md#uc30) | [PE08](personas.md#pe08) | [CT-U61](casos-de-teste.md#ct-u61) | Equipo y ayuda | `(pesquisador)/administracao/cenarios/`, `src/lib/cenarios/` |
| [RF68](requisitos.md#rf68) Estado de la protección de datos y de las traducciones | [HU43](historias-de-usuario.md#hu43) | [UC31](casos-de-uso.md#uc31) | [PE08](personas.md#pe08) | — | Idiomas de la herramienta | `(pesquisador)/administracao/protecao/`, `(pesquisador)/administracao/idiomas/` |

## Requisitos no funcionales

### Accesibilidad

| Requisito | Historias | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|
| [RNF01](requisitos.md#rnf01) WCAG 2.2 AA | [HU35](historias-de-usuario.md#hu35) | [PE05](personas.md#pe05) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E06](casos-de-teste.md#ct-e06), [CT-E12](casos-de-teste.md#ct-e12), [CT-E14](casos-de-teste.md#ct-e14), [CT-E21](casos-de-teste.md#ct-e21), [CT-E47](casos-de-teste.md#ct-e47), [CT-E74](casos-de-teste.md#ct-e74), [CT-M11](casos-de-teste.md#ct-m11), [CT-M13](casos-de-teste.md#ct-m13), [CT-M18](casos-de-teste.md#ct-m18) | Sprint 00 · Configuración | `tests/e2e/acessibilidade.ts` |
| [RNF02](requisitos.md#rnf02) 320 px y zoom del 400% | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-E25](casos-de-teste.md#ct-e25), [CT-E31](casos-de-teste.md#ct-e31), [CT-E36](casos-de-teste.md#ct-e36), [CT-E44](casos-de-teste.md#ct-e44), [CT-E50](casos-de-teste.md#ct-e50), [CT-E75](casos-de-teste.md#ct-e75), [CT-M08](casos-de-teste.md#ct-m08) | Sprint 05 · Cuestionario | `src/styles/tokens.css`, `src/app/globals.css` |
| [RNF03](requisitos.md#rnf03) Uso solo con teclado | [HU35](historias-de-usuario.md#hu35) | [PE05](personas.md#pe05) | [CT-E02](casos-de-teste.md#ct-e02), [CT-E03](casos-de-teste.md#ct-e03), [CT-E22](casos-de-teste.md#ct-e22), [CT-E53](casos-de-teste.md#ct-e53), [CT-E54](casos-de-teste.md#ct-e54), [CT-E55](casos-de-teste.md#ct-e55), [CT-E64](casos-de-teste.md#ct-e64), [CT-M07](casos-de-teste.md#ct-m07) | Sprint 05 · Cuestionario | `(pesquisador)/BarraFixa.tsx`, `src/app/globals.css` |
| [RNF04](requisitos.md#rnf04) Lector de pantalla | [HU35](historias-de-usuario.md#hu35) | [PE05](personas.md#pe05) | [CT-E24](casos-de-teste.md#ct-e24), [CT-U48](casos-de-teste.md#ct-u48), [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M03](casos-de-teste.md#ct-m03), [CT-M04](casos-de-teste.md#ct-m04), [CT-M05](casos-de-teste.md#ct-m05), [CT-M06](casos-de-teste.md#ct-m06), [CT-M20](casos-de-teste.md#ct-m20), [CT-M21](casos-de-teste.md#ct-m21), [CT-M22](casos-de-teste.md#ct-m22), [CT-M23](casos-de-teste.md#ct-m23) | Sprint 05 · Cuestionario | `src/componentes/ItemDiferencial.tsx`, `src/componentes/formulario/MensagemStatus.tsx` |
| [RNF05](requisitos.md#rnf05) Área táctil | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-M12](casos-de-teste.md#ct-m12) | Sprint 05 · Cuestionario | `src/componentes/ItemDiferencial.tsx` |
| [RNF06](requisitos.md#rnf06) Contraste | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52), [CT-M10](casos-de-teste.md#ct-m10) | Sprint 00 · Configuración | `src/styles/tokens.css` |
| [RNF07](requisitos.md#rnf07) Información más allá del color | [HU08](historias-de-usuario.md#hu08) | [PE01](personas.md#pe01) | [CT-E32](casos-de-teste.md#ct-e32), [CT-U52](casos-de-teste.md#ct-u52), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10) | Sprint 06 · Resultados | `src/graficos/` |
| [RNF08](requisitos.md#rnf08) Gráficos con texto equivalente | [HU08](historias-de-usuario.md#hu08) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29), [CT-M05](casos-de-teste.md#ct-m05) | Sprint 06 · Resultados | `src/graficos/` |

### Fidelidad al instrumento

| Requisito | Historias | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|
| [RNF09](requisitos.md#rnf09) Cuestionario sin sesgo de interfaz | [HU18](historias-de-usuario.md#hu18) | [PE02](personas.md#pe02) | [CT-E24](casos-de-teste.md#ct-e24) | Sprint 05 · Cuestionario | `src/componentes/ItemDiferencial.tsx` |
| [RNF10](requisitos.md#rnf10) Términos oficiales | [HU36](historias-de-usuario.md#hu36) | [PE06](personas.md#pe06) | [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47), [CT-M17](casos-de-teste.md#ct-m17) | Sprint de idiomas | `data/ueq-itens-ptbr.json`, `data/ueq-idiomas.json`, `prisma/seed.ts` |
| [RNF11](requisitos.md#rnf11) Cálculo igual al de la hoja oficial | [HU18](historias-de-usuario.md#hu18) | [PE02](personas.md#pe02) | [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15), [CT-U29](casos-de-teste.md#ct-u29) | Sprint 09 · Revisión final | `src/ueq/__tests__/fixtures.test.ts`, `data/fixtures/`, `scripts/planilha-oficial.ps1` |

### Seguridad y privacidad

| Requisito | Historias | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|
| [RNF12](requisitos.md#rnf12) Anonimato del participante | [HU33](historias-de-usuario.md#hu33) | [PE04](personas.md#pe04) | [CT-E21](casos-de-teste.md#ct-e21) | Sprint 05 · Cuestionario | `prisma/schema.prisma`, `src/lib/participacao.ts` |
| [RNF13](requisitos.md#rnf13) Recogida mínima | [HU05](historias-de-usuario.md#hu05) | [PE01](personas.md#pe01) | — | LGPD | `prisma/schema.prisma`, `src/app/r/[slug]/acoes.ts` |
| [RNF14](requisitos.md#rnf14) Cifrado de los datos demográficos | [HU05](historias-de-usuario.md#hu05), [HU43](historias-de-usuario.md#hu43) | [PE01](personas.md#pe01), [PE08](personas.md#pe08) | [CT-U58](casos-de-teste.md#ct-u58) | LGPD | `src/lib/cripto.ts`, `prisma/cifrar-dados.ts` |
| [RNF15](requisitos.md#rnf15) Contraseña y sesión protegidas | [HU22](historias-de-usuario.md#hu22) | [PE02](personas.md#pe02) | [CT-E10](casos-de-teste.md#ct-e10) | Sprint 03 · Autenticación | `src/lib/senhas.ts`, `src/lib/sessao.ts`, `src/lib/cookie-sessao.ts` |
| [RNF16](requisitos.md#rnf16) Límite de intentos de inicio de sesión | [HU22](historias-de-usuario.md#hu22) | [PE02](personas.md#pe02) | [CT-E80](casos-de-teste.md#ct-e80) | LGPD | `src/lib/tentativas.ts` |
| [RNF17](requisitos.md#rnf17) Acceso solo a los estudios propios | [HU20](historias-de-usuario.md#hu20), [HU41](historias-de-usuario.md#hu41) | [PE02](personas.md#pe02), [PE08](personas.md#pe08) | [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41) | Sprint 04 · Estudios | `src/lib/estudos.ts` |
| [RNF18](requisitos.md#rnf18) Protecciones del navegador | [HU22](historias-de-usuario.md#hu22) | [PE02](personas.md#pe02) | [CT-E73](casos-de-teste.md#ct-e73) | LGPD | `next.config.ts` |
| [RNF19](requisitos.md#rnf19) Política de privacidad | [HU17](historias-de-usuario.md#hu17), [HU28](historias-de-usuario.md#hu28) | [PE01](personas.md#pe01), [PE04](personas.md#pe04) | [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-M23](casos-de-teste.md#ct-m23), [CT-M25](casos-de-teste.md#ct-m25) | LGPD | `(publico)/privacidade/`, `src/app/r/[slug]/privacidade/` |

### Usabilidad

| Requisito | Historias | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|
| [RNF20](requisitos.md#rnf20) Respuesta a cada acción | [HU06](historias-de-usuario.md#hu06) | [PE01](personas.md#pe01) | [CT-E09](casos-de-teste.md#ct-e09), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-E88](casos-de-teste.md#ct-e88), [CT-E89](casos-de-teste.md#ct-e89), [CT-E90](casos-de-teste.md#ct-e90), [CT-M06](casos-de-teste.md#ct-m06), [CT-M13](casos-de-teste.md#ct-m13) | Sprint 04 · Estudios | `src/componentes/formulario/MensagemStatus.tsx`, `src/componentes/formulario/BotaoEnvio.tsx` |
| [RNF21](requisitos.md#rnf21) Confirmación antes de perder datos | [HU16](historias-de-usuario.md#hu16), [HU32](historias-de-usuario.md#hu32) | [PE01](personas.md#pe01), [PE04](personas.md#pe04) | [CT-E11](casos-de-teste.md#ct-e11), [CT-E19](casos-de-teste.md#ct-e19), [CT-E27](casos-de-teste.md#ct-e27), [CT-M13](casos-de-teste.md#ct-m13), [CT-M20](casos-de-teste.md#ct-m20) | Sprint 04 · Estudios | `src/componentes/janela/Confirmacao.tsx` |
| [RNF22](requisitos.md#rnf22) Formato brasileño de números y fechas | [HU11](historias-de-usuario.md#hu11), [HU23](historias-de-usuario.md#hu23) | [PE01](personas.md#pe01), [PE02](personas.md#pe02) | [CT-U33](casos-de-teste.md#ct-u33), [CT-U44](casos-de-teste.md#ct-u44) | Sprint 06 · Resultados | `src/idiomas/formatar.ts`, `src/lib/csv.ts` |

### Plataforma y mantenimiento

| Requisito | Historias | Personas | Casos de prueba | Sprint | Código |
|---|---|---|---|---|---|
| [RNF23](requisitos.md#rnf23) Ordenador y móvil | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-E53](casos-de-teste.md#ct-e53), [CT-E55](casos-de-teste.md#ct-e55), [CT-E56](casos-de-teste.md#ct-e56), [CT-M12](casos-de-teste.md#ct-m12) | Sprint 00 · Configuración | `playwright.config.ts` |
| [RNF24](requisitos.md#rnf24) Aplicación web de código abierto | [HU38](historias-de-usuario.md#hu38) | [PE08](personas.md#pe08) | [CT-M19](casos-de-teste.md#ct-m19) | Sprint 00 · Configuración | `LICENSE`, `README.md` |
| [RNF25](requisitos.md#rnf25) Cálculo aislado y probado | [HU40](historias-de-usuario.md#hu40) | [PE08](personas.md#pe08) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U07](casos-de-teste.md#ct-u07), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U22](casos-de-teste.md#ct-u22) | Sprint 02 · Cálculo | `src/ueq/` |
| [RNF26](requisitos.md#rnf26) Comprobaciones antes de integrar | [HU40](historias-de-usuario.md#hu40) | [PE08](personas.md#pe08) | — | Sprint 00 · Configuración | `package.json` |

## Cobertura

- **Historias y casos de uso:** todo requisito tiene al menos una historia; todo requisito funcional tiene al menos un caso de uso.
- **Casos de prueba:** 89 de los 94 requisitos tienen al menos un caso de prueba automático o manual. Los 5 restantes se comprueban con el paso Cómo verificar del propio requisito:

| Requisito | Por qué no tiene caso de prueba | Cómo verificar |
|---|---|---|
| [RF49](requisitos.md#rf49) Explicar los términos | Las explicaciones son texto estático junto a cada término; ninguna prueba las abre todas | Pestaña Resultados: abra ¿Qué es la Perspicuidad? |
| [RF66](requisitos.md#rf66) Gestionar cuentas | Administración exige una cuenta de superusuario, que las pruebas de extremo a extremo no crean | Con una cuenta de administrador, menú Administración › Cuentas. |
| [RF68](requisitos.md#rf68) Estado de la protección de datos y de las traducciones | El mismo motivo que en el RF66 | Administración › Protección de datos y Administración › Idiomas. |
| [RNF13](requisitos.md#rnf13) Recogida mínima | La recogida demográfica desactivada está cubierta por el [CT-E71](casos-de-teste.md#ct-e71), pero la limpieza de las participaciones abandonadas depende de esperar 2 días | Cree un estudio y compruebe que los datos demográficos empiezan desactivados. |
| [RNF26](requisitos.md#rnf26) Comprobaciones antes de integrar | Es una regla del proceso de integración, no un comportamiento de la herramienta | Terminal: pnpm lint && pnpm typecheck && pnpm test. |

- **Pendiente:** ninguno. El último, [RF62](requisitos.md#rf62) (UEQ-S), se entregó el 18/11/2026.

## Casos de uso

Los requisitos que ejercita cada caso de uso. Los diagramas y las especificaciones están en [casos de uso](casos-de-uso.md).

| Caso de uso | Actor | Requisitos |
|---|---|---|
| [UC01](casos-de-uso.md#uc01) Crear cuenta | Visitante | [RF01](requisitos.md#rf01), [RF08](requisitos.md#rf08) |
| [UC02](casos-de-uso.md#uc02) Iniciar y cerrar sesión | Investigador | [RF02](requisitos.md#rf02), [RF03](requisitos.md#rf03), [RF11](requisitos.md#rf11) |
| [UC03](casos-de-uso.md#uc03) Gestionar la cuenta | Investigador | [RF04](requisitos.md#rf04), [RF05](requisitos.md#rf05), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RF08](requisitos.md#rf08), [RF23](requisitos.md#rf23) |
| [UC04](casos-de-uso.md#uc04) Aprender a usarla | Investigador | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10) |
| [UC05](casos-de-uso.md#uc05) Listar estudios | Investigador | [RF12](requisitos.md#rf12) |
| [UC06](casos-de-uso.md#uc06) Crear estudio | Investigador | [RF13](requisitos.md#rf13), [RF18](requisitos.md#rf18), [RF19](requisitos.md#rf19) |
| [UC07](casos-de-uso.md#uc07) Editar estudio | Investigador | [RF14](requisitos.md#rf14) |
| [UC08](casos-de-uso.md#uc08) Controlar la recogida | Investigador | [RF15](requisitos.md#rf15) |
| [UC09](casos-de-uso.md#uc09) Copiar el enlace | Investigador | [RF16](requisitos.md#rf16) |
| [UC10](casos-de-uso.md#uc10) Eliminar estudio | Investigador | [RF17](requisitos.md#rf17) |
| [UC11](casos-de-uso.md#uc11) Compartir estudio | Investigador | [RF20](requisitos.md#rf20) |
| [UC12](casos-de-uso.md#uc12) Responder a una invitación | Investigador | [RF21](requisitos.md#rf21) |
| [UC13](casos-de-uso.md#uc13) Seguir las notificaciones | Investigador | [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23) |
| [UC14](casos-de-uso.md#uc14) Responder el cuestionario | Participante | [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF26](requisitos.md#rf26), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30), [RF33](requisitos.md#rf33) |
| [UC15](casos-de-uso.md#uc15) Elegir el idioma | Participante | [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35) |
| [UC16](casos-de-uso.md#uc16) Indicar datos opcionales | Participante | [RF32](requisitos.md#rf32) |
| [UC17](casos-de-uso.md#uc17) Salir sin enviar | Participante | [RF31](requisitos.md#rf31) |
| [UC18](casos-de-uso.md#uc18) Ver resultados | Investigador | [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF46](requisitos.md#rf46), [RF48](requisitos.md#rf48), [RF49](requisitos.md#rf49) |
| [UC19](casos-de-uso.md#uc19) Calcular el análisis UEQ | (incluido) | [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40), [RF41](requisitos.md#rf41), [RF42](requisitos.md#rf42) |
| [UC20](casos-de-uso.md#uc20) Comparar versiones | Investigador | [RF47](requisitos.md#rf47) |
| [UC21](casos-de-uso.md#uc21) Ver los datos demográficos | Investigador | [RF50](requisitos.md#rf50) |
| [UC22](casos-de-uso.md#uc22) Exportar el panel en PDF | Investigador | [RF60](requisitos.md#rf60) |
| [UC23](casos-de-uso.md#uc23) Revisar respuestas sospechosas | Investigador | [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54) |
| [UC24](casos-de-uso.md#uc24) Evaluar la sospecha de la participación | (incluido) | [RF51](requisitos.md#rf51) |
| [UC25](casos-de-uso.md#uc25) Exportar datos | Investigador | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58), [RF59](requisitos.md#rf59) |
| [UC26](casos-de-uso.md#uc26) Importar respuestas | Investigador | [RF61](requisitos.md#rf61) |
| [UC27](casos-de-uso.md#uc27) Aplicar el UEQ-S | Investigador | [RF62](requisitos.md#rf62) |
| [UC28](casos-de-uso.md#uc28) Consultar la documentación | Visitante, Investigador | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65) |
| [UC29](casos-de-uso.md#uc29) Gestionar cuentas | Administrador | [RF66](requisitos.md#rf66) |
| [UC30](casos-de-uso.md#uc30) Crear escenarios de demostración | Administrador | [RF67](requisitos.md#rf67) |
| [UC31](casos-de-uso.md#uc31) Ver protección de datos y traducciones | Administrador | [RF68](requisitos.md#rf68) |
| [UC32](casos-de-uso.md#uc32) Recalcular sospechas | Mantenedor | [RF55](requisitos.md#rf55) |
| [UC33](casos-de-uso.md#uc33) Cargar los ítems oficiales | Mantenedor | [RNF10](requisitos.md#rnf10) |
