# Caso: control biométrico de asistencia al trabajo

## Descripción libre (tal como la escribiría la organización)

Cualquier empresa puede usar nuestro sistema para controlar y monitorizar la asistencia al trabajo de sus empleados. Tiene cámaras (o sensores biométricos) que registran la entrada y cámaras que registran la salida, sin que el empleado tenga que hacer nada activamente — el sistema asociado a cada cámara reconoce a la persona y registra los tiempos de entrada y salida. El objetivo es controlar el tiempo trabajado, no solo identificar a la persona.

## Respuesta conocida

- **Label**: alto riesgo
- **Cita**: Anexo III, apartado 1, letra a (identificación biométrica remota) — y, como vía adicional independiente, apartado 4 (empleo y gestión de trabajadores), según lo encontrado en el experimento del 3 de septiembre de 2026.
- **Fuente**: Guía 2 de AESIA, sección 2.1 (`src/rules/cases.ts`, caso `biometria_asistencia_trabajo`)
- **Trampa que prueba**: distinguir identificación biométrica (1:N, sin que el empleado declare previamente su identidad) de verificación biométrica (1:1) — la descripción da la pista ("sin que el empleado tenga que hacer nada activamente") pero no lo dice explícitamente con esos términos técnicos.
