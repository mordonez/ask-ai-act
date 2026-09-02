# Arquitectura — borrador de decisiones

Nada de este documento está decidido todavía. Es el sitio donde recoger las opciones y sus trade-offs para discutirlas antes de escribir código. Cada sección tiene un estado: 🟡 abierto, 🟢 decidido.

## Fase 1 — Clasificador sin estado

**Estado: 🟡 abierto**

No necesita backend con estado: es lógica de reglas + una UI. Opciones a valorar:

| Opción | A favor | En contra |
|---|---|---|
| Sitio estático (Astro/Vite) + lógica en cliente, desplegado en Cloudflare Pages | Coherente con el stack que ya usa `miguelordonez.com` (Cloudflare); barato; sin servidor que mantener | El árbol de reglas queda expuesto en el cliente (no es grave para la fase 1, sí a tener en cuenta si en fase 3 se combina con datos sensibles) |
| Next.js en Vercel | Buen punto de partida si en fase 2 hace falta backend con estado sin cambiar de plataforma; ecosistema de componentes/UI maduro | Introduce una plataforma nueva respecto al resto del trabajo del autor, que hoy vive en Cloudflare + Netlify |
| Worker de Cloudflare sirviendo HTML+JS, sin framework | Mínima dependencia, control total | Más trabajo manual de UI para un wizard que se beneficia de un framework |

El árbol de reglas en sí (independientemente del framework elegido) debería vivir como datos versionados y testeables — por ejemplo un JSON o TS con la estructura de nodos, artículo/anexo asociado a cada rama, y un runner de tests que valide los 5 casos de ejemplo de las guías AESIA. Esto es independiente de la decisión de framework y puede fijarse ya.

**Decisión pendiente:** framework y hosting concretos.

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

**Decisión pendiente:** todo, y probablemente lo último en decidirse — depende de cómo queden las fases 1 y 2.

## Cosas que sí pueden fijarse ya, independientemente del resto

- Licencia: MIT (ya en el repo).
- El árbol de reglas de la fase 1 se versiona como datos, con tests, independientemente del framework elegido encima.
- Ninguna fase permite que un modelo de IA decida la clasificación legal por su cuenta (principio de diseño del roadmap).
