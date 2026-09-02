# AGENTS.md — ask-ai-act

Guía de referencia para agentes de IA que trabajen en este repositorio.

## Qué es este proyecto

`ask-ai-act` convierte el Reglamento europeo de Inteligencia Artificial (UE 2024/1689) en un plan de trabajo con responsables y evidencias, en vez de otro PDF por leer. Parte de donde termina el Compliance Checker oficial de la Comisión Europea: inventariar sistemas de IA de una organización, clasificarlos con un árbol de reglas trazable, y convertir eso en un plan de acción con seguimiento. Contexto completo y motivación en [`README.md`](README.md).

## Estado actual

🚧 **Fase 1 desplegada, muy temprana.** El árbol de reglas, el rol y el plan de acción están hechos y testeados (31 tests). Vivo en [ask-ai-act.pages.dev](https://ask-ai-act.pages.dev). Falta: exportar el resultado, estilo real del wizard, volver atrás en las preguntas.

## Comandos

```bash
npm install       # instalar dependencias
npm test          # ejecutar los tests del árbol de reglas (Vitest) — hazlo antes de tocar src/rules/
npm run test:watch
npm run dev       # wizard en local, http://localhost:5173
npm run build     # tsc -b && vite build -> dist/
npm run preview   # sirve dist/ para comprobar el build de producción
npm run deploy    # build + wrangler pages deploy dist (Cloudflare Pages, proyecto ask-ai-act)
```

No hay lint configurado todavía (deliberado — proyecto pequeño, revisitar si crece).

## Dónde está cada cosa

- **[`README.md`](README.md)** — pitch del proyecto, qué NO es, visión general.
- **[`docs/ROADMAP.md`](docs/ROADMAP.md)** — el plan de trabajo. Fuente de verdad sobre el alcance de cada fase (1: clasificador sin estado, 2: gestor con estado, 3: capa conversacional/RAG). Antes de proponer o construir algo, comprueba si ya está descrito aquí como entregable, como fuera de alcance, o como pregunta abierta.
- **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** — decisiones técnicas por fase, marcadas 🟡 abierto o 🟢 decidido. No asumas un stack que aquí sigue marcado como abierto.
- **`src/rules/`** — el árbol de reglas: `types.ts` (tipos), `questions.ts` (qué se pregunta y por qué, con cita legal), `classify.ts` (la única función que decide — pura, sin efectos secundarios), `cases.ts` (los 5 casos reales de la guía 2 de AESIA, con la cita exacta de Anexo/apartado). Si tocas la lógica de clasificación, tócala aquí, no en la UI.
- **`src/ui/wizard.ts`** — UI mínima que recorre `classify()` pregunta a pregunta. Sin frameworks, sin estado persistente (Fase 1: sin cuentas, sin base de datos). No es el sitio para lógica legal nueva.
- **`tests/classify.test.ts`** — tests contra los 5 casos reales de AESIA y contra los casos límite del árbol (incluida la regla de que "no lo sé" nunca se trata como "sí" o "no" por defecto). Cualquier cambio en `classify.ts` debe seguir pasando estos tests, y cualquier rama nueva del árbol necesita su test.

## Cómo trabajar en este repo de forma iterativa

Este proyecto avanza fase a fase, y cada fase solo empieza cuando la anterior cumple su criterio de éxito (ver `docs/ROADMAP.md`). Al trabajar en cualquier tarea:

1. **Identifica en qué fase estás.** No adelantes trabajo de la Fase 2 (cuentas, persistencia) o la Fase 3 (RAG, LLM) mientras la Fase 1 siga sin validar.
2. **Si una pregunta abierta del roadmap o de arquitectura se resuelve, actualiza el documento en el mismo cambio** — cambia el estado de 🟡 a 🟢 en `ARCHITECTURE.md`, o mueve la pregunta de "abierta" a resuelta en `ROADMAP.md`. No dejes que la decisión viva solo en el historial de conversación.
3. **Si aparece una decisión nueva no prevista en el roadmap**, añádela a la sección correspondiente en vez de improvisarla solo en código.

## Principios de diseño (no negociables sin discutirlo explícitamente)

Repetidos aquí porque son la base de cualquier código que se escriba en este repo, no solo del roadmap:

1. **La clasificación legal la decide un árbol de reglas trazable y versionado, nunca un modelo de IA.** Cada conclusión debe mostrar qué respuesta la provocó y qué artículo o anexo del Reglamento la sustenta.
2. **Ante datos insuficientes o ambigüedad, la respuesta correcta es "no se puede determinar todavía, faltan estas respuestas"** — nunca una clasificación inventada o "probable".
3. **Un modelo de IA solo se usa para la parte conversacional** (Fase 3): preguntas de seguimiento, estructurar una descripción libre, explicar un artículo, responder citando la fuente exacta. Nunca decide la clasificación por su cuenta.
4. **Todo debe ser auditable.** El árbol de reglas vive como datos versionados en el repo, con tests que comprueban que los 5 casos de ejemplo de las guías de AESIA (promoción de empleados, bomba de insulina, ayudas sociales, biometría, denuncias falsas) clasifican como en las guías originales.
5. **Español primero.** No es una traducción del comprobador oficial de la UE.

## Licencia y naturaleza pública

MIT, proyecto público desde el inicio. Cualquier decisión de diseño debe poder explicarse y justificarse en los documentos del repo, no solo en la cabeza del autor — otras personas pueden llegar a contribuir.
