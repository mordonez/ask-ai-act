# ask-ai-act

> Convierte el Reglamento europeo de Inteligencia Artificial en un plan de trabajo — con responsables y evidencias — en vez de otro PDF por leer.

## Estado del proyecto

🚧 **En fase de planificación.** Todavía no hay código. Este repo empieza como documento vivo para acordar el alcance antes de construir nada — ver [`docs/ROADMAP.md`](docs/ROADMAP.md).

## El problema

El [Reglamento (UE) 2024/1689](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32024R1689) ya está en vigor y sus obligaciones se activan por fases hasta 2028. La mayoría de organizaciones no sabe:

- si alguno de sus sistemas de IA está afectado,
- qué papel juegan (¿proveedor? ¿responsable del despliegue?),
- ni por dónde empezar a comprobarlo.

Es un momento parecido al de la ley de cookies: una regulación extensa, poco entendida, con una ventana clara para que aparezcan herramientas que la conviertan en un proceso manejable. La diferencia es que aquí no basta con un banner — cada organización puede tener varios sistemas, papeles y niveles de riesgo distintos, y esa clasificación puede cambiar con el tiempo.

## Qué NO es este proyecto

- **No sustituye** el [Compliance Checker oficial de la Comisión Europea](https://digital-strategy.ec.europa.eu/en/policies/ai-act) (en beta) — es el punto de referencia oficial y el primer sitio por el que empezar.
- **No es asesoramiento legal.** El árbol de clasificación es trazable y cita el artículo o anexo que sustenta cada conclusión, pero no sustituye una revisión jurídica cuando hay ambigüedad.
- **No deja que un modelo de IA decida la clasificación por su cuenta.** Ver [Principios de diseño](docs/ROADMAP.md#principios-de-diseño) en el roadmap.

## Qué es (visión)

Una herramienta abierta, en español, que parte de donde termina el comprobador oficial:

1. **Inventaría** los sistemas de IA de una organización.
2. Los **clasifica** con un árbol de reglas trazable y versionado — cada conclusión muestra qué respuesta la provocó y qué artículo o anexo la sustenta.
3. Convierte el resultado en un **plan de trabajo**: obligaciones aplicables, fechas, responsable, evidencias necesarias y próxima acción.
4. Mantiene ese plan **vivo**: seguimiento por estado, evidencias adjuntas, alertas cuando cambia el sistema o la normativa.
5. Usa un modelo de IA como capa conversacional de apoyo (explicar artículos, convertir una descripción libre en respuestas estructuradas, responder citando fuentes) — nunca para decidir la clasificación.

El plan completo, dividido en tres fases, está en [`docs/ROADMAP.md`](docs/ROADMAP.md). Las decisiones técnicas aún abiertas están en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Origen

Este proyecto nace de un post en [miguelordonez.com](https://miguelordonez.com) sobre el Reglamento europeo de IA y las guías de AESIA. Las guías siguen siendo material de consulta útil, pero el trabajo real vive aquí.

## Licencia

[MIT](LICENSE) — proyecto público, pensado para que cualquiera pueda usarlo, adaptarlo o contribuir.
