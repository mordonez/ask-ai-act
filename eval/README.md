# Eval — ¿un buen contexto basta, sin el wizard?

Arnés de evaluación para la pregunta abierta en `docs/ARCHITECTURE.md` / `docs/ROADMAP.md`: ¿un modelo con un contexto bien construido (el texto de los artículos relevantes + extractos de las guías de AESIA) clasifica de forma fiable y consistente, sin pasar por el árbol de reglas pregunta a pregunta?

No es una decisión que se tome mirando 3 casos sueltos (eso ya se hizo el 3 de septiembre de 2026, ver `docs/ROADMAP.md`, y aunque salió bien no prueba repetibilidad). Esto formaliza ese experimento.

## Qué mide

Para cada caso, dos cosas distintas:

1. **Acierto**: ¿la clasificación (label + cita legal) coincide con la respuesta conocida?
2. **Consistencia**: cada caso se ejecuta más de una vez — ¿da la misma respuesta las dos veces? Un modelo que acierta el 100% de las veces pero cambia de respuesta entre ejecuciones no sirve para una herramienta de cumplimiento, por bien que le vaya a la primera.

## Estructura

- `context/reglamento-articulos-verificados.md` — el "buen contexto": extractos de los artículos del Reglamento que se han verificado contra fuente en esta investigación (no el texto consolidado oficial completo — eso no está disponible por fetch directo, ver la nota de procedencia en `src/rules/classify.ts`). Cada sección dice de dónde sale y con qué confianza.
- `cases/` — un fichero por caso: descripción libre (como la escribiría alguien de la organización, no como una ficha técnica) + la respuesta conocida correcta, sacada de `src/rules/cases.ts` o verificada aparte.
- `prompt-template.md` — cómo se combina el contexto + el caso + las instrucciones de formato de salida (clasificación, cita exacta, nivel de confianza, "no lo sé" explícito) para un modelo.
- `results/` — resultados de cada ejecución, con fecha, para no perder el histórico si se repite el experimento más adelante (p. ej. al cambiar de modelo o de contexto).

## Qué NO es esto

- No es un pipeline automatizado que llame a una API externa — este entorno no tiene claves de OpenAI/Google configuradas. Las ejecuciones se hacen lanzando agentes (Claude) con el prompt ensamblado; es un proxy razonable, pero **no** valida el comportamiento específico de GPT/Gemini.
- No sustituye el árbol de reglas de `src/rules/`. Es investigación para decidir con datos, no una implementación de producción.
