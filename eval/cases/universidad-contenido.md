# Caso: universidad redactando contenido con IA

## Descripción libre (tal como la escribiría la organización)

Somos una universidad. El equipo de comunicación usa ChatGPT para redactar artículos y páginas de la web institucional: noticias, descripciones de programas académicos, entradas de blog. Una persona del equipo revisa el contenido de fondo (no solo ortografía) antes de publicarlo, y esa persona asume la responsabilidad de lo que se publica.

## Respuesta conocida

- **Label**: sin obligaciones específicas (por la excepción del art. 50.4 — revisión editorial sustantiva real)
- **Cita**: no aplica Anexo III (educación) porque no decide/evalúa sobre ninguna persona concreta; no aplica la obligación de marcado del art. 50.4 porque hay revisión editorial sustantiva.
- **Fuente**: verificado en esta investigación (no está en `src/rules/cases.ts`, que solo recoge los 5 casos de alto riesgo de la guía 2 de AESIA) — ver `src/rules/classify.ts`, `Q_REVISION_EDITORIAL`.
- **Trampa que prueba**: **falso positivo doble**. (1) que el modelo no clasifique automáticamente como Anexo III solo por venir de una "universidad" (la categoría educación exige decidir sobre personas, no generar contenido). (2) que no exija el marcado del art. 50.4 sin comprobar la excepción de revisión editorial — si la descripción no mencionara la revisión, la respuesta correcta cambiaría a "obligaciones de transparencia".
