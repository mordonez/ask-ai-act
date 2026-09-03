# Arquitectura — borrador de decisiones

Nada de este documento está decidido todavía. Es el sitio donde recoger las opciones y sus trade-offs para discutirlas antes de escribir código. Cada sección tiene un estado: 🟡 abierto, 🟢 decidido.

## Fase 1 — Clasificador sin estado

**Estado: 🟢 decidido (código ya en el repo)**

- **Lenguaje/build:** TypeScript + Vite. Sin framework de UI (React, Vue...) — el wizard es DOM manual en `src/ui/wizard.ts`, porque el flujo es "una pregunta, un resultado" y no justifica la dependencia todavía. Si el wizard crece (ramas condicionales visuales, animaciones, i18n), revisar esta decisión.
- **Árbol de reglas:** TypeScript puro y tipado en `src/rules/` (`types.ts`, `questions.ts`, `classify.ts`), sin JSON externo — así el compilador detecta preguntas mal referenciadas. `classify()` es una función pura `Answers -> ClassificationResult`, sin dependencias del DOM ni de red: se puede testear, reutilizar desde un worker en fase 3, o exponer como librería si hiciera falta.
- **Tests:** Vitest, corriendo contra los 5 casos reales de la guía 2 de AESIA (`src/rules/cases.ts`, con la cita exacta de Anexo/apartado sacada del PDF) más los casos límite del árbol. `npm test` antes de tocar `classify.ts`.
- **Hosting:** Cloudflare Pages — coherente con el resto del stack del autor (`miguelordonez.com` ya vive en Cloudflare/Netlify + Workers). **Pendiente de ejecutar** (requiere login de `wrangler`/dashboard, no hecho todavía): el build (`npm run build` → `dist/`) ya está listo para desplegarse tal cual.

Descartado por ahora: Next.js/Vercel (introduce una plataforma nueva sin necesidad — no hay backend con estado en esta fase que lo justifique) y un Worker de Cloudflare sirviendo HTML a mano (Vite da recarga en caliente y build de producción gratis, sin coste real frente a "control total" que aquí no hace falta).

**Desplegado:** [aiact.miguelordonez.com](https://aiact.miguelordonez.com) (Cloudflare Pages, proyecto `ask-ai-act`). **Deploy automático por Git desde el 3 de septiembre de 2026**: el repo de GitHub está conectado en el dashboard de Cloudflare Pages (build command `npm run build`, output `dist`, rama de producción `main`) — cada `git push` a `main` dispara build y deploy solo, sin `wrangler pages deploy` manual. Verificado: el primer deploy tras conectar coincide exactamente con el último commit (`e7982ba`) y sirve el bundle correcto en producción. El script `npm run deploy` de `package.json` queda como vía de emergencia si el deploy automático fallara alguna vez, no como el camino normal. Nota: la CLI de `wrangler` ya recomienda Workers con static assets en vez de Pages para proyectos nuevos — se mantiene Pages por ser la decisión ya tomada, pero si Cloudflare deprecase Pages de verdad, migrar es solo cambiar el target de deploy, no el código (sigue siendo `dist/` estático).

**Persistencia local:** `localStorage`, no IndexedDB — los datos son pequeños (respuestas de sí/no por evaluación) y sin consultas complejas, así que la API síncrona y sin dependencias de `localStorage` basta. Guarda el progreso en curso y el histórico de evaluaciones completadas (con nombre de empresa/sistema opcional), solo en el navegador de quien lo usa — no es la Fase 2 (esa es un backend compartido entre varias personas de una organización). Construido y probado en navegador real, ver `ROADMAP.md`.

**Pendiente, no bloqueante:** volver atrás en las preguntas sin perder progreso; dar estilo a los estados de error; decidir si un único idioma (es) basta para el lanzamiento.

## Fase 2 — Backend con estado

**Estado: 🟡 abierto — depende de decisiones no solo técnicas**

Antes de elegir tecnología aquí hacen falta respuestas a lo legal y de negocio del roadmap (responsable del tratamiento de los datos, modelo de acceso). Con eso resuelto, las piezas técnicas típicas serían:

- **Auth:** proveedor gestionado (evitar construir autenticación propia).
- **Base de datos:** algo con soporte de relaciones claro (organización → sistemas → evaluaciones → obligaciones → evidencias). Candidatos a valorar: Cloudflare D1 (coherente con el resto del stack de Cloudflare), o una base de datos gestionada tipo Postgres si se prefiere más flexibilidad de consultas y no atarse a un único proveedor.
- **Almacenamiento de evidencias:** si se permiten adjuntos (documentos, capturas), hace falta un object storage (R2, S3 u equivalente) y una política clara de qué se guarda y durante cuánto tiempo.

**Decisión pendiente:** todo — esta fase no debería empezar a construirse hasta que el roadmap tenga resueltas sus preguntas legales y de modelo.

## Fase 3 — RAG sobre el Reglamento y las guías

**Estado: 🟡 abierto**

El worker `ask-ai` de `miguelordonez.com` ya resuelve un patrón parecido (embeddings con Workers AI + Vectorize + LLM con contexto recuperado) sobre el contenido del blog. Es un precedente directo a reutilizar o adaptar, pero aquí el corpus es distinto (texto legal, más denso, con artículos y anexos que hay que citar con precisión) y las exigencias de precisión son mayores — una alucinación aquí no es un enlace roto, es un consejo de cumplimiento mal dado.

Preguntas específicas de esta fase que hay que resolver antes de construir:

- Cómo trocear (*chunk*) el texto del Reglamento sin romper la referencia al artículo/apartado exacto.
- Cómo forzar que cada respuesta cite la fuente exacta y no una aproximada.
- Cómo medir alucinaciones antes de confiar en el asistente para nada relacionado con clasificación.

**Opción evaluada, no decidida — dónde corre el modelo:** [WebLLM](https://github.com/mlc-ai/web-llm) (inferencia en el propio navegador vía WebGPU) frente a un LLM en servidor (Workers AI, como el worker `ask-ai`).

- **A favor de WebLLM:** quien usa este wizard puede estar describiendo un sistema interno de su organización — con WebLLM esa descripción no sale nunca del navegador, no hay servidor de por medio ni coste de inferencia. Encaja con el principio de diseño de que el modelo nunca decide la clasificación, solo ayuda a la parte conversacional: un modelo más pequeño corriendo en local es más tolerable aquí que en un chatbot donde el modelo decide por sí solo, porque el árbol de reglas sigue siendo la única fuente de verdad y los errores del asistente son recuperables.
- **En contra:** necesita WebGPU (bien soportado en Chrome/Edge, irregular en Safari/Firefox — hace falta un plan B para quien no lo tenga, probablemente un LLM en servidor como fallback, lo que duplica la superficie a mantener); la primera visita descarga el modelo (cientos de MB a varios GB); el rendimiento depende del hardware de quien lo usa.
- No se construye nada de esto todavía — la Fase 3 sigue sin empezar. Queda anotado para cuando llegue ese momento.

**Decisión pendiente:** todo, y probablemente lo último en decidirse — depende de cómo queden las fases 1 y 2.

## Cosas que sí pueden fijarse ya, independientemente del resto

- Licencia: MIT (ya en el repo).
- El árbol de reglas de la fase 1 se versiona como datos, con tests, independientemente del framework elegido encima.
- Ninguna fase permite que un modelo de IA decida la clasificación legal por su cuenta (principio de diseño del roadmap).
