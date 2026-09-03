# Caso: bomba de insulina inteligente

## Descripción libre (tal como la escribiría la organización)

Fabricamos una bomba de insulina que administra la dosis de forma automática, monitorizando el estado del paciente (nivel de azúcar en sangre, actividad, pulso, oxígeno en sangre). El propio modelo predice una tendencia y ajusta el suministro de insulina en consecuencia, y también gestiona el envío de alarmas al paciente y al médico. La usan hospitales que se la dan a médicos, que a su vez la aplican a sus pacientes.

## Respuesta conocida

- **Label**: alto riesgo
- **Cita**: Anexo I (no Anexo III) — producto sanitario regulado, apartado A, subapartado 11
- **Fuente**: Guía 2 de AESIA, sección 2.4 (`src/rules/cases.ts`, caso `bomba_insulina`)
- **Trampa que prueba**: que el modelo distinga la vía del **Anexo I** (producto ya regulado por legislación de armonización de la UE, aquí productos sanitarios) de la vía del Anexo III — es fácil que un modelo asuma que "alto riesgo" siempre significa Anexo III y no mencione el Anexo I explícitamente. Ninguno de los otros 3 casos de este eval pasa por el Anexo I, así que este es el único que lo prueba.
