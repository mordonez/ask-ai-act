# ask-ai-act

Clasificador abierto y en español para convertir el Reglamento europeo de Inteligencia Artificial en una evaluación trazable y un plan de acción.

**[Probar la demo](https://ask-ai-act.pages.dev)**

## Qué hace

- Guía la evaluación de un sistema de IA mediante preguntas sencillas.
- Clasifica el caso con un árbol de reglas determinista.
- Muestra las respuestas y referencias legales que justifican el resultado.
- Si el sistema es de alto riesgo, identifica el rol de la organización y genera un plan de acción.
- Si faltan datos, indica qué preguntas siguen sin respuesta en vez de inventar una conclusión.

El árbol está probado contra los cinco casos de ejemplo de la guía 2 de AESIA.

## Estado

🚧 **Fase 1, versión temprana.**

El clasificador funciona, está desplegado y cuenta con 34 tests automatizados. Todavía faltan:

- copiar o exportar el resultado;
- mejorar el diseño del wizard;
- permitir volver atrás y cambiar respuestas.

Esta fase no incluye cuentas, persistencia, inventario de varios sistemas ni llamadas a modelos de IA.

## Principios

- La clasificación legal la decide código versionado y testeado, nunca un modelo de IA.
- Cada resultado debe ser trazable hasta una respuesta y una referencia legal.
- La falta de información produce un resultado no determinado.
- Español primero.

> Esta herramienta no ofrece asesoramiento legal ni sustituye una revisión jurídica. Consulta también el [Reglamento (UE) 2024/1689](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32024R1689) y los recursos oficiales de la Comisión Europea.

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

```bash
npm test       # ejecuta los tests
npm run build  # crea el build de producción
```

## Hoja de ruta

El proyecto avanza por fases:

1. Clasificador sin estado.
2. Inventario y seguimiento con persistencia.
3. Capa conversacional sobre el Reglamento y las guías.

Consulta el [roadmap](docs/ROADMAP.md) para conocer el alcance y la [arquitectura](docs/ARCHITECTURE.md) para revisar las decisiones técnicas.

## Licencia

[MIT](LICENSE)
