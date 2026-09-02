# Roadmap

Este documento es el plan de trabajo. Está pensado para revisarse y corregirse antes de escribir código — cada fase tiene su alcance, sus entregables, sus preguntas abiertas y el criterio para pasar a la siguiente. Nada de esto es definitivo todavía.

## Principios de diseño

Válidos para las tres fases, no negociables sin discutirlo explícitamente:

1. **La clasificación legal la decide un árbol de reglas trazable y versionado, no un modelo de IA.** Cada conclusión debe poder mostrar: qué respuesta la provocó, qué artículo o anexo la sustenta, qué información falta si la conclusión es parcial, y cuándo se actualizó esa regla.
2. **Si faltan datos o hay ambigüedad, la respuesta correcta es "no se puede determinar todavía, faltan estas respuestas"** — nunca una clasificación inventada o "probable".
3. **El modelo de IA se usa para la parte conversacional**, no para la parte legal: hacer preguntas de seguimiento, convertir una descripción informal en información estructurada, explicar un artículo con palabras sencillas, responder citando la fuente exacta (Reglamento o guía de AESIA).
4. **Todo lo publicado debe ser auditable.** El árbol de reglas vive en el repo, versionado, con tests que comprueban que los casos de ejemplo de las guías de AESIA (promoción de empleados, bomba de insulina, ayudas sociales, biometría, denuncias falsas) clasifican como en las guías.
5. **Español primero.** Conectado a las guías de AESIA, no una traducción genérica del comprobador oficial de la UE.

## Fase 1 — Clasificador sin estado

**Objetivo:** dar una clasificación trazable y un plan de acción en pantalla, sin cuentas ni persistencia. Es la pieza que valida si el árbol de reglas y las preguntas están bien planteados antes de construir nada más grande encima.

**Alcance:**

- Árbol de reglas determinista que cubre: prácticas prohibidas (art. 5), pertenencia a Anexo I o Anexo III, filtro del artículo 6.3, y rol en la cadena (proveedor / responsable del despliegue / importador / distribuidor / representante autorizado).
- Wizard de preguntas en lenguaje sencillo (sí / no / no lo sé), una por pantalla.
- Resultado final: clasificación (fuera de ámbito / uso prohibido / alto riesgo / obligaciones de transparencia / GPAI / caso que requiere revisión especializada), el artículo o anexo que la sustenta, y un plan de acción (obligaciones aplicables, fechas relevantes, guías de AESIA a consultar, próxima acción concreta).
- Resultado exportable o copiable (aunque sea texto plano) — sin necesidad de cuenta para guardarlo.

**Explícitamente fuera de alcance en esta fase:** cuentas, inventario de varios sistemas persistente entre sesiones, cualquier llamada a un modelo de IA.

**Entregables:**

- ✅ Árbol de reglas documentado y versionado en TypeScript (`src/rules/`) — cubre art. 5 (9 prácticas prohibidas separadas), Anexo I/III, filtro art. 6.3 completo (las 4 tareas limitadas + perfilado + influencia material), y las dos obligaciones de transparencia del art. 50 (interacción y contenido generado) por separado — antes eran una sola pregunta con "o" en medio, y un sistema que solo genera contenido (sin conversar con nadie) recibía también la obligación de "informar de la interacción con una IA", que no le aplica. Caso real que lo destapó: una universidad que usa un LLM para redactar artículos institucionales.
- ✅ Tests automáticos (Vitest, `npm test`) que verifican que los 5 casos de uso reales de la guía 2 de AESIA clasifican como "alto riesgo" con el Anexo/apartado exacto citado en el PDF. 45 tests en verde, incluidas regresiones sobre el manejo de "no lo sé" y sobre las obligaciones de transparencia separadas.
- ✅ Rol en la cadena (proveedor / responsable del despliegue / importador / distribuidor / representante autorizado): conectado al flujo — se pregunta después de la clasificación (cuando el resultado es alto riesgo), no antes.
- ✅ Plan de acción (`src/rules/actionPlan.ts`): obligaciones por rol, guía de AESIA a consultar por obligación, próxima acción concreta y nota de plazo (Anexo III vs Anexo I). Contenido tomado del post del blog y de `sources/aesia/notas/`, no generado.
- ✅ UI del wizard desplegada en [ask-ai-act.pages.dev](https://ask-ai-act.pages.dev), probada de principio a fin en navegador (los 3 caminos: alto riesgo con rol y plan, uso prohibido sin pregunta de rol, y el árbol completo de las 9 prácticas prohibidas una a una).
- ✅ Las 9 prácticas prohibidas del art. 5 son preguntas separadas, no una sola pregunta con las 9 seguidas — con ejemplo de caso "sí" y caso "no" en cada una, para reducir el riesgo de que alguien conteste mal por no leer con atención un bloque largo.
- ✅ Resultado exportable: botón "Descargar CSV" (`src/rules/exportCsv.ts`) — mismas columnas que el checklist manual que ya se usaba antes (Tipo/Descripción/Guía/Estado/Responsable/Evidencia), ya filtrado por rol y con Estado="Pendiente" listo para importar a Google Sheets/Excel. No sustituye el seguimiento (eso sigue siendo Fase 2, si llega) — solo evita rellenarlo a mano desde cero. Probado en navegador interceptando el blob real, no solo con el test unitario.

**Próximos pasos concretos de esta fase, en orden:**

1. Estilo real del wizard (hoy es CSS mínimo inline).
2. Compartir el enlace fuera del propio autor y recibir el primer feedback real (criterio de éxito de esta fase).

**Preguntas abiertas:**

- ¿El wizard permite volver atrás y cambiar respuestas sin perder el progreso? (hoy no: cada respuesta es definitiva dentro de la sesión)
- ¿Un único idioma (es) o también inglés desde el principio?
- ¿Cómo se comunica que esto no es asesoramiento legal, sin que el disclaimer arruine la confianza en la herramienta?
- ~~Stack y hosting~~ → decidido, ver `ARCHITECTURE.md` (Vite + TS + Vitest, Cloudflare Pages).

**Criterio de éxito para pasar a la fase 2:**

- Alguien ajeno al proyecto completa el wizard con un caso real (o uno de los 5 casos de ejemplo) y la clasificación coincide con la esperada.
- El árbol de reglas pasa sus tests.
- Al menos una persona fuera del autor lo usa y da feedback sobre si el resultado le sirvió para saber qué hacer a continuación.

## Fase 2 — Gestor con estado (inventario y seguimiento)

**Objetivo:** que una organización pueda guardar varios sistemas evaluados, asignarles responsables y evidencias, hacer seguimiento en el tiempo y recibir alertas cuando algo cambie. Esta es la parte que de verdad diferencia el proyecto del comprobador oficial.

**Alcance:**

- Cuentas / organizaciones (a decidir el modelo: individual vs. equipo desde el día uno).
- Guardar sistemas evaluados en la fase 1, con su histórico de clasificaciones si el sistema cambia.
- Por cada obligación aplicable: responsable asignado, evidencia adjunta o enlazada, estado (`Pendiente` / `En revisión` / `Completado` / `No aplica` con justificación obligatoria).
- Alertas cuando cambia el sistema (nueva versión, nueva finalidad) o cuando cambia la normativa/guía de referencia.
- Informes exportables pensados para tres audiencias distintas: dirección (resumen ejecutivo), ingeniería (checklist técnica), legal (trazabilidad y evidencias).

**Explícitamente fuera de alcance en esta fase:** la capa conversacional avanzada de la fase 3 (aunque el modelo de la fase 1 y 2 puede compartir infraestructura con ella más adelante).

**Entregables:**

- Modelo de datos: organización, sistema, evaluación, obligación, evidencia, responsable, historial de cambios.
- Autenticación.
- Backend con persistencia real (no solo el árbol de reglas en cliente de la fase 1).
- Dashboard de seguimiento.

**Preguntas abiertas — estas son grandes y merecen su propia conversación antes de tocar código:**

- Proveedor de autenticación.
- Base de datos y dónde vive (¿serverless tipo D1, Postgres gestionado, otra cosa?).
- Modelo: ¿gratis, freemium, open-source self-hosted, alguna combinación?
- Implicaciones legales de guardar datos de terceros sobre sus propios sistemas de IA: ¿quién es responsable del tratamiento de esos datos? ¿Hace falta un aviso legal y unos términos de servicio serios antes de aceptar el primer usuario real?
- Multi-tenant compartido vs. instancias separadas por organización.
- ¿Cómo se financia el mantenimiento de un servicio con estado, a diferencia de una página estática?

**Criterio de éxito para pasar a la fase 3:**

- Una organización piloto (real o simulada) usa el inventario durante varias semanas y lo encuentra útil para no perder el hilo de sus obligaciones.
- Las preguntas legales y de modelo de negocio de arriba tienen respuesta, no solo intención.

## Fase 3 — Capa conversacional (RAG sobre el Reglamento y las guías)

**Objetivo:** que un modelo ayude a explicar, rellenar y consultar — nunca a decidir la clasificación por su cuenta.

**Alcance:**

- Indexado (embeddings) del texto del Reglamento (UE) 2024/1689 y de las 16 guías de AESIA.
- Asistente que convierte una descripción libre del sistema ("tenemos un chatbot que filtra currículos") en respuestas estructuradas al árbol de la fase 1, en vez de que la persona rellene el wizard campo a campo.
- Explicación de artículos concretos en lenguaje sencillo, con la cita exacta de la fuente.
- Respuesta explícita "no lo sé, esto no está claro en el Reglamento ni en las guías" cuando corresponda, en vez de inventar.
- Revisión de documentación que la organización ya tenga (fichas de modelo, evaluaciones de riesgo) para sugerir qué falta.

**Explícitamente fuera de alcance:** que el asistente sea quien determina la clasificación final — eso sigue pasando siempre por el árbol de reglas de la fase 1.

**Entregables:**

- Pipeline de ingesta y *chunking* del Reglamento y las guías.
- Índice vectorial y worker/servicio de consulta.
- *Guardrails* que exigen cita de fuente en cada respuesta y evitan alucinaciones.
- Batería de evaluación: preguntas de prueba con respuesta esperada, para medir precisión de citas y tasa de "no lo sé" correcta antes de confiar en el asistente.

**Preguntas abiertas:**

- Proveedor de embeddings/LLM (Workers AI, como en el worker `ask-ai` de miguelordonez.com, u otro).
- Cómo mantener el índice actualizado cuando cambien el Reglamento o las guías de AESIA.
- Coste por consulta y cómo se controla si el proyecto crece.
- Umbral de confianza para decidir cuándo el asistente debe responder "no lo sé" en vez de arriesgarse.

**Criterio de éxito:**

- En la batería de evaluación, el asistente cita la fuente correcta y responde "no lo sé" cuando corresponde, sin inventar artículos ni anexos.

## Qué se decide después, no ahora

Explícitamente aparcado hasta que la fase 1 esté validada: nombre de dominio y marca definitivos, monetización, soporte multi-idioma más allá de español, integraciones con herramientas externas (Jira, Notion...), y cualquier compromiso de disponibilidad/soporte propio de un producto en producción con usuarios reales.
