# Resultado del eval — 3 de septiembre de 2026

4 casos × 2 repeticiones = 8 ejecuciones, cada una en un agente Claude sin contexto de esta conversación, con el "buen contexto" de `context/reglamento-articulos-verificados.md` embebido en el prompt (ver `prompt-template.md`).

## Tabla de resultados

| Caso | Run | Label esperado | Label obtenido | ¿Acierta? | Cita — precisión |
|---|---|---|---|---|---|
| Denuncias falsas | 1 | alto_riesgo | alto_riesgo | ✅ | Anexo III.6, describe "fiabilidad de pruebas" (= letra c en sustancia, sin nombrar la letra) |
| Denuncias falsas | 2 | alto_riesgo | alto_riesgo | ✅ | Igual que run 1 — consistente |
| Universidad (trampa) | 1 | sin_obligaciones_especificas | sin_obligaciones_especificas | ✅ | Art. 50.4, exacta |
| Universidad (trampa) | 2 | sin_obligaciones_especificas | sin_obligaciones_especificas | ✅ | Art. 50.4, exacta — con razonamiento adicional correcto (distingue desplegador de proveedor de GPAI) |
| Biometría asistencia | 1 | alto_riesgo | alto_riesgo | ✅ | Cita Anexo III.4 como principal; la biometría la referencia vía art. 3.1 en vez de Anexo III.1 — **imprecisa** |
| Biometría asistencia | 2 | alto_riesgo | alto_riesgo | ✅ | Cita **ambos** Anexo III.1 y Anexo III.4 explícitamente — más precisa que run 1 |
| Bomba de insulina | 1 | alto_riesgo (Anexo I) | alto_riesgo (Anexo I) | ✅ | Anexo I, correcta, con detalle del MDR |
| Bomba de insulina | 2 | alto_riesgo (Anexo I) | alto_riesgo (Anexo I) | ✅ | Anexo I, correcta, con más detalle todavía |

## Lectura de los datos

**Acierto de clasificación: 8/8 (100%).** Ninguna ejecución dio un label incorrecto, ni en el caso trampa (universidad) ni en el que prueba la vía menos común (Anexo I, bomba de insulina — nada de sesgo hacia asumir que "alto riesgo" siempre es Anexo III).

**Consistencia entre repeticiones: 3 de 4 casos, sólida. 1 de 4, con una discrepancia real.** Denuncias falsas, universidad y bomba de insulina dieron prácticamente la misma respuesta (mismo label, misma cita, mismo nivel de detalle) en sus dos ejecuciones. **Biometría asistencia no**: la run 1 dio una cita más pobre e imprecisa (mencionó la biometría solo indirectamente vía art. 3.1, la definición general de sistema de IA, en vez de citar el Anexo III.1 específico de biometría) mientras que la run 2 dio la cita completa y correcta (Anexo III.1 y 4.b explícitamente). El *label* final fue el mismo las dos veces, pero la *calidad de la justificación* no — y para una herramienta de cumplimiento, la justificación es tan importante como la conclusión.

## Conclusión

- Un "buen contexto" (los artículos verificados, no solo lo que el modelo ya sabe) produce respuestas correctas y en general consistentes con solo 4 casos y 2 repeticiones — mejor de lo que esperaba antes de medirlo.
- Pero **la consistencia no es total**: un caso de 4 mostró variación real en la precisión de la cita entre dos ejecuciones idénticas. Con una muestra tan pequeña, no se puede descartar que esto ocurra en más casos con más repeticiones — es exactamente el tipo de fallo que el árbol de reglas, por construcción, no puede tener (mismos datos, mismo código, mismo resultado, siempre).
- **No cambia la recomendación**: el árbol de reglas sigue siendo el sitio correcto para decidir la clasificación. Pero el contexto usado aquí demuestra ser sólido para lo que ya estaba planeado en la Fase 3 (un asistente que ayuda a describir el sistema y rellenar el wizard) — y podría ser la base de ese contexto cuando llegue el momento.
- **Para seguir investigando esta línea con más rigor**, haría falta: más casos (10-15, cubriendo más categorías del Anexo III y más trampas de falso positivo/negativo), más repeticiones por caso (al menos 3-5, no 2), y probarlo también con GPT/Gemini si se consiguen claves de API — este eval solo prueba el comportamiento de Claude.
