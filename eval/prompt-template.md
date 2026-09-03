# Plantilla de prompt del eval

Para cada ejecución se ensambla así (no se pega literalmente este fichero — se construye combinando las tres partes):

```
Eres un asistente que ayuda a una organización a clasificar un sistema de IA según
el Reglamento europeo de Inteligencia Artificial (Reglamento (UE) 2024/1689).

A continuación tienes extractos verificados de los artículos relevantes del
Reglamento. Básate en ellos como fuente principal — no en lo que ya sepas del
Reglamento por tu entrenamiento, que puede estar desactualizado o ser impreciso.

<contexto>
[contenido íntegro de context/reglamento-articulos-verificados.md]
</contexto>

Aquí tienes la descripción del sistema, tal como la escribiría alguien de la
organización:

<descripcion>
[contenido de la sección "Descripción libre" del caso]
</descripcion>

Clasifica el sistema. Responde en este formato exacto:

1. **Label**: una de estas seis opciones — fuera_de_ambito / uso_prohibido /
   alto_riesgo / modelo_uso_general / obligaciones_transparencia /
   sin_obligaciones_especificas
2. **Cita legal**: el artículo, anexo y apartado/letra exactos que sustentan la
   conclusión (no una cita genérica como "el Reglamento" — el apartado concreto)
3. **Confianza**: alta / media / baja, y por qué
4. **Si falta información** para concluir con seguridad, dilo explícitamente en
   vez de asumir una respuesta — "no se puede determinar sin saber X".
```

## Por qué este formato

- Fuerza una respuesta estructurada y comparable programáticamente contra la respuesta conocida (a diferencia del experimento del 3 de septiembre, que pedía una respuesta libre y había que leerla entera para juzgar el acierto).
- Pide explícitamente la cita exacta, no solo "sí, alto riesgo" — es donde el árbol de reglas pone más cuidado (ver `src/rules/classify.ts`) y donde más fácil es que un modelo se quede en algo genérico.
- El aviso de "no se puede determinar" replica el principio 2 de `AGENTS.md` (nunca inventar cuando falta información) — sin esto, no hay forma de saber si el modelo simplemente no contempla esa opción.
