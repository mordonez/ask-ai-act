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

- Árbol de reglas documentado y versionado (formato a decidir — ver arquitectura).
- Tests automáticos que verifican que los 5 casos de uso de las guías AESIA (promoción de empleados, bomba de insulina, ayudas sociales, control de asistencia biométrico, detección de denuncias falsas) clasifican igual que en las guías originales.
- UI del wizard, desplegada y accesible públicamente.

**Preguntas abiertas:**

- Stack y hosting (ver `ARCHITECTURE.md`).
- Diseño exacto del árbol: ¿cuántos nodos de decisión, cómo se versiona, cómo se referencia el artículo/anexo en cada rama?
- ¿El wizard permite volver atrás y cambiar respuestas sin perder el progreso?
- ¿Un único idioma (es) o también inglés desde el principio?
- ¿Cómo se comunica que esto no es asesoramiento legal, sin que el disclaimer arruine la confianza en la herramienta?

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
