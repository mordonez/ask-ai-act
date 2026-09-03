# Fuentes

Material de origen para fundamentar el árbol de reglas de la Fase 1 y, más adelante, el corpus del RAG de la Fase 3. Nada de esto se genera con IA sin verificar contra el original — son extractos de documentos oficiales.

## `reglamento_ue_2024_1689_es.txt`

Texto íntegro y oficial del Reglamento (UE) 2024/1689, en español (preámbulo, 113 artículos, 13 anexos) — extraído con `pdftotext -layout` del PDF auténtico del Diario Oficial descargado desde EUR-Lex (`https://eur-lex.europa.eu/legal-content/ES/TXT/PDF/?uri=OJ:L_202401689`, 3 de septiembre de 2026). Esta es la versión original de 2024/1689 (no la consolidada con modificaciones posteriores, como el Reglamento 2026/1744 — ver nota en `classify.ts`).

**Nota sobre el acceso a EUR-Lex:** un `curl`/fetch directo a EUR-Lex desde un entorno sin navegador recibe un challenge de AWS WAF (`x-amzn-waf-action: challenge`, HTTP 202 sin cuerpo) que no se puede superar sin ejecutar JavaScript. Con un navegador real (sesión con JS) el documento carga con normalidad — así se obtuvo este fichero: cargando la página en Chrome y descargando el PDF desde ahí, no vía fetch automatizado.

**Uso:** esta es ahora la fuente principal para verificar cualquier cita legal (artículo, anexo, apartado) contra el texto real antes de codificarla en `src/rules/` — sustituye a la verificación indirecta contra artificialintelligenceact.eu que se usó mientras no se tenía el texto oficial completo (ver `classify.ts`, `questions.ts` y `reglamento-articulos-verificados.md`, cuyas notas de procedencia deben revisarse contra este fichero cuando se toque cada regla).

## `aesia/guias-txt/`

Texto extraído (PDF → texto plano) de las 16 guías publicadas por AESIA en [aesia.digital.gob.es/es/guias](https://aesia.digital.gob.es/es/guias). Un fichero por guía, numerados igual que el original (`01-introduccion.txt` … `16-checklist.txt`).

**Uso:** verificar cualquier cita legal (artículo, anexo, apartado) contra el texto real antes de codificarla en `src/rules/`, en vez de fiarse de la memoria. Es el mismo tipo de verificación que ya se hizo para los 5 casos de `src/rules/cases.ts` — ahí se citó el Anexo/apartado exacto de `guias-txt/02-practica-ejemplos.txt` en vez de inventarlo.

## `aesia/notas/`

Notas condensadas, una por guía (`01-introduccion.md` … `16-checklist.md`), con el resumen de "qué dice de verdad" cada documento. Punto de partida más rápido que el texto completo para entender de qué trata una guía antes de decidir si hace falta profundizar en `guias-txt/`.

## `aepd/aepd-agentic.txt`

Extracto sobre IA agéntica de la AEPD (Agencia Española de Protección de Datos) — perspectiva de datos personales complementaria al Reglamento, mencionada en el post del blog que originó este proyecto.

## Procedencia y estado

Migrado desde el trabajo de investigación de un post de [miguelordonez.com](https://miguelordonez.com) sobre las guías de AESIA. Los PDFs originales completos (no solo el texto extraído) viven en el repo de ese blog, en `tmp/pdfs/aesia/` — no se han traído aquí para no duplicar binarios; si hace falta el PDF original de alguna guía, está ahí o en la web de AESIA.

Son documentos públicos de una administración española; se reproducen aquí como material de trabajo interno del proyecto, con atribución a AESIA/AEPD como fuente. Si en algún momento se publica contenido derivado de este material fuera del propio repo (por ejemplo, citas en la UI), debe mantenerse la atribución a la guía y el apartado concretos, igual que ya hace `src/rules/cases.ts`.
