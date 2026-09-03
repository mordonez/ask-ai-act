# Reglamento (UE) 2024/1689 — artículos verificados

Extractos verificados contra fuente durante la investigación de este proyecto. La mayoría se verificaron antes del 3 de septiembre de 2026 vía espejos como artificialintelligenceact.eu, porque un fetch/curl automatizado a EUR-Lex recibe un challenge de AWS WAF y no carga sin un navegador real ejecutando JavaScript. Desde esa fecha existe el texto oficial completo (texto original de 2024/1689, sin la consolidación de modificaciones posteriores) en `sources/reglamento_ue_2024_1689_es.txt`, obtenido cargando EUR-Lex en un navegador real y descargando el PDF auténtico del Diario Oficial. Cada sección de este fichero indica cómo se verificó y con qué confianza — las marcadas con confianza media/no verificadas palabra por palabra deben revisarse contra ese texto oficial cuando se toquen.

## Artículo 2 — Ámbito de aplicación (exclusiones)

*Verificado vía artificialintelligenceact.eu/article/2/, 3 de septiembre de 2026. Confianza alta — cita textual del artículo.*

- **2(3)** — El Reglamento NO se aplica a sistemas de IA introducidos en el mercado, puestos en servicio o usados exclusiva y únicamente con fines militares, de defensa o de seguridad nacional, sin ningún fin adicional no excluido.
- **2(6)** — El Reglamento NO se aplica a sistemas o modelos de IA desarrollados y puestos en servicio únicamente con fines de investigación científica y desarrollo.
- **2(8)** — El Reglamento NO se aplica a ninguna actividad de investigación, prueba o desarrollo relativa a sistemas de IA antes de su introducción en el mercado o puesta en servicio.
- **2(10)** — El Reglamento NO se aplica al uso de sistemas de IA por personas físicas en el ejercicio de una actividad puramente personal y no profesional.
- **2(12)** — El Reglamento NO se aplica a sistemas de IA publicados bajo licencias libres y de código abierto, SALVO que se introduzcan en el mercado o se pongan en servicio como sistemas de IA de alto riesgo.

## Artículo 3 — Definiciones

*Confianza media — conocimiento general bien documentado del Reglamento, no verificado palabra por palabra en esta sesión.*

- **3.1 — Sistema de IA**: sistema basado en máquinas que, a partir de las entradas que recibe, infiere cómo generar salidas (predicciones, contenido, recomendaciones o decisiones) que pueden influir en entornos físicos o virtuales, con distintos niveles de autonomía y capacidad de adaptación tras el despliegue.
- **3.63 — Modelo de IA de uso general**: modelo entrenado con grandes cantidades de datos mediante autosupervisión a gran escala, que muestra una generalidad significativa y es capaz de realizar competentemente una amplia gama de tareas distintas.

## Artículo 5 — Prácticas prohibidas

*Confianza alta en la estructura general (a)-(h) — conocimiento estable y bien documentado; no se ha verificado la redacción literal de cada letra en esta sesión, solo se ha contrastado contra las guías de AESIA (que enumeran los mismos 8 supuestos, ver `sources/aesia/guias-txt/01-introduccion.txt`).*

Prohíbe: (a) técnicas subliminales o manipuladoras que causen perjuicio; (b) explotar vulnerabilidades por edad, discapacidad o situación social/económica; (c) puntuación social con trato perjudicial fuera de contexto; (d) predecir delitos solo por perfilado, sin hechos objetivos; (e) bases de reconocimiento facial por recopilación indiscriminada; (f) inferir emociones en el trabajo o la educación (salvo médico/seguridad); (g) categorización biométrica que infiera atributos sensibles (raza, ideología, religión, orientación sexual...); (h) identificación biométrica remota en tiempo real en espacios públicos con fines policiales, fuera de las excepciones tasadas.

Una novena prohibición (contenido íntimo no consentido / material de abuso sexual infantil) se añade por el Reglamento (UE) 2026/1744, no está en el texto original del art. 5.

## Artículo 6.3 — Filtro de exclusión del Anexo III

*Verificado vía artificialintelligenceact.eu/article/6/, sesión anterior de este mismo proyecto. Confianza alta.*

Un sistema del Anexo III NO se considera de alto riesgo si:
- (a) ejecuta una tarea procedimental limitada, o
- (b) mejora el resultado de una actividad humana ya completada, o
- (c) detecta patrones o desviaciones sin sustituir ni influir en la evaluación humana sin la debida revisión, o
- (d) realiza una tarea preparatoria para una evaluación relevante,

**Y ADEMÁS** no realiza perfilado de personas físicas (si lo hace, siempre es alto riesgo, sin excepción) **Y** no influye materialmente en el resultado.

## Artículo 50 — Obligaciones de transparencia

*El apartado 4 (excepción de revisión editorial) verificado el 3 de septiembre de 2026 contra fuentes que citan el texto del Reglamento. El resto, confianza media (conocimiento general).*

- **50.1** — Quien despliega un sistema que interactúa directamente con personas físicas debe informarles de que interactúan con un sistema de IA.
- **50.2** — El contenido de audio, imagen o vídeo generado o manipulado por IA que se asemeje a personas, objetos o hechos reales (deepfakes) debe marcarse como generado artificialmente.
- **50.4** — El texto publicado por IA sobre asuntos de interés público debe marcarse como generado artificialmente, **salvo que** el contenido haya pasado por revisión humana sustantiva (no meramente ortográfica o de formato) y una persona física o jurídica asuma la responsabilidad editorial de la publicación.

## Artículo 51 — Modelos de IA de uso general con riesgo sistémico

*Confianza media — el umbral de cómputo (10^25 FLOP) es de conocimiento general bien documentado, no verificado literalmente en esta sesión.*

Un modelo GPAI se presume de riesgo sistémico si se ha entrenado con más de 10^25 FLOP de cómputo, o si la Comisión Europea lo designa como tal según los criterios del Anexo XIII.

## Anexo I y Anexo III — categorías de alto riesgo

*Confianza media-alta — contrastado contra `sources/aesia/guias-txt/01-introduccion.txt` y `02-practica-ejemplos.txt`, no contra el texto legal del propio Anexo.*

- **Anexo I**: sistemas que son (o son componente de seguridad de) productos ya regulados por legislación europea de armonización — maquinaria, juguetes, ascensores, equipos de protección, equipos de radio, productos sanitarios y de diagnóstico *in vitro*, entre otros.
- **Anexo III**, por categorías: (1) biometría — identificación remota, categorización, reconocimiento de emociones; (2) infraestructuras críticas; (3) educación y formación (acceso, evaluación de resultados, detección de conductas prohibidas en exámenes); (4) empleo, gestión de trabajadores y autoempleo (selección, promoción, supervisión/evaluación del rendimiento); (5) acceso a servicios públicos y privados esenciales; (6) actuación policial (evaluación de riesgo, polígrafos, fiabilidad de pruebas); (7) migración, asilo y control fronterizo; (8) administración de justicia y procesos democráticos.
