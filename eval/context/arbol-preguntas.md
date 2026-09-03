# Árbol de preguntas — ask-ai-act (generado, no editar a mano)

Generado por `scripts/generate-questions-manifest.mjs` a partir de
`src/rules/questions.ts`. Vuelve a generarlo (`npm run manifest`) después de
tocar ese fichero — no lo edites aquí directamente, se sobrescribe.

Pensado para pegarse junto con `sources/reglamento_ue_2024_1689_es.txt` en el
contexto de un modelo al que se le pida auditar cobertura: "¿hay alguna
obligación del Reglamento para la que este árbol no tiene pregunta?". Ver
`eval/README.md`, sección "Auditoría de cobertura".

Total de preguntas: 29.

## Núcleo (ámbito, art. 5, GPAI, Anexo I/III) (17)

### `exclusion_militar` — art. 2.3

¿El sistema se introduce en el mercado, se pone en servicio o se usa exclusivamente con fines militares, de defensa o de seguridad nacional, sin ningún fin adicional no excluido (como uso civil o de garantía del cumplimiento del Derecho)?

Ejemplos que responden **sí**:
- Un sistema de puntería usado solo por las fuerzas armadas.
- Software de mando y control militar, sin ninguna aplicación fuera del ejército.

Ejemplos que responden **no**:
- El mismo sistema de puntería, si además tiene un uso civil — ahí sí entra en el ámbito del Reglamento.
- Un sistema de vigilancia usado tanto por el ejército como por seguridad privada civil.

Enlaces:
- Texto del artículo 2 — ámbito de aplicación: https://artificialintelligenceact.eu/article/2/

### `exclusion_investigacion_desarrollo` — art. 2.6 / 2.8

¿El sistema se desarrolla y pone en servicio únicamente con fines de investigación científica y desarrollo, y todavía no se ha introducido en el mercado ni puesto en servicio para su finalidad prevista (las pruebas en condiciones reales YA NO entran en esta exclusión)?

Ejemplos que responden **sí**:
- Un prototipo de laboratorio que aún no ha salido del entorno de investigación.
- Un modelo académico que solo se usa en un paper y en un entorno de pruebas cerrado.

Ejemplos que responden **no**:
- El mismo sistema en cuanto empieza a probarse en condiciones reales fuera del laboratorio, o se pone en servicio para su uso previsto.
- El mismo prototipo, una vez integrado en un producto que ya se vende a clientes.

Enlaces:
- Texto del artículo 2 — ámbito de aplicación: https://artificialintelligenceact.eu/article/2/

### `exclusion_uso_personal` — art. 2.10

¿Lo usa una persona física, en su vida privada, por motivos puramente personales y no profesionales?

Ejemplos que responden **sí**:
- Alguien usa un asistente de IA para gestionar su propio correo personal.
- Una persona usa una app de IA para planificar sus vacaciones.

Ejemplos que responden **no**:
- Una organización lo usa para su actividad, aunque sea solo a nivel interno.
- Un autónomo lo usa para gestionar los pedidos de su negocio — ya es un uso profesional.

Enlaces:
- Texto del artículo 2 — ámbito de aplicación: https://artificialintelligenceact.eu/article/2/

### `es_codigo_abierto` — art. 2.12

¿El sistema (o el modelo en el que se basa) se publica bajo una licencia libre y de código abierto?

Ejemplos que responden **sí**:
- Un modelo publicado con pesos, código y documentación accesibles bajo una licencia abierta.
- Un modelo en un repositorio público con licencia tipo Apache 2.0 y pesos descargables.

Ejemplos que responden **no**:
- Un sistema propietario o de acceso restringido, aunque sea gratuito.
- Una API de pago con modelo cerrado, aunque el uso sea gratuito en un plan básico.

Enlaces:
- Texto del artículo 2 — ámbito de aplicación: https://artificialintelligenceact.eu/article/2/

### `es_sistema_ia` — art. 3.1

¿El sistema aprende, infiere o razona a partir de datos para generar predicciones, contenido, recomendaciones o decisiones que influyen en entornos físicos o virtuales?

Ejemplos que responden **sí**:
- Un modelo que predice si concederte una ayuda a partir de tus datos.
- Un chatbot que genera respuestas distintas según el contexto de la conversación.

Ejemplos que responden **no**:
- Una hoja de cálculo con una fórmula fija (si ingresos < X, entonces rechazar) — un sistema basado únicamente en reglas explícitas puede quedar fuera de esta definición.
- Un script que ordena una lista alfabéticamente, sin inferir nada a partir de datos.

Enlaces:
- Definiciones del Reglamento (art. 3): https://artificialintelligenceact.eu/article/3/

### `prohibido_manipulacion` — art. 5.1.a

¿El sistema usa técnicas subliminales (imperceptibles para la persona) o manipuladoras/engañosas, con el objetivo o el efecto de alterar de forma relevante su comportamiento y causarle (o poder causarle) un perjuicio significativo?

Ejemplos que responden **sí**:
- Una app que inserta estímulos imperceptibles para empujar a una persona vulnerable a una compra perjudicial.
- Un videojuego con mensajes subliminales diseñados para inducir gasto.

Ejemplos que responden **no**:
- Publicidad normal, persuasiva pero transparente sobre su intención.
- Un descuento visible y claro por tiempo limitado.

Enlaces:
- Texto del artículo 5 — prácticas prohibidas: https://artificialintelligenceact.eu/article/5/

### `prohibido_vulnerabilidades` — art. 5.1.b

¿El sistema explota la edad, una discapacidad o una situación social o económica concreta de una persona o grupo para alterar su comportamiento y causarle un perjuicio?

Ejemplos que responden **sí**:
- Un asistente dirigido a menores que usa su edad para inducir compras repetidas.
- Una app que detecta dificultades económicas y ofrece préstamos abusivos de forma insistente.

Ejemplos que responden **no**:
- Un producto pensado para personas mayores que simplemente simplifica la interfaz.
- Un servicio de asesoría financiera gratuita dirigido a personas en dificultades económicas.

Enlaces:
- Texto del artículo 5 — prácticas prohibidas: https://artificialintelligenceact.eu/article/5/

### `prohibido_scoring_social` — art. 5.1.c

¿El sistema puntúa o clasifica a personas por su comportamiento o características personales, y esa puntuación se usa para darles un trato perjudicial o desproporcionado en un contexto distinto de aquel en el que se generaron los datos?

Ejemplos que responden **sí**:
- Limitar el acceso a un servicio público por conductas observadas en redes sociales.
- Negar una plaza en un centro educativo por el comportamiento de un familiar en otro ámbito.

Ejemplos que responden **no**:
- Un scoring de riesgo crediticio limitado al propio contexto financiero y proporcionado (puede tener otras obligaciones, pero no es esta prohibición).
- Un programa de puntos de fidelidad de una tienda, limitado a esa misma tienda.

Enlaces:
- Texto del artículo 5 — prácticas prohibidas: https://artificialintelligenceact.eu/article/5/

### `prohibido_prediccion_delictiva` — art. 5.1.d

¿El sistema estima que una persona cometerá un delito basándose únicamente en su perfil o rasgos de personalidad, sin hechos objetivos y verificables relacionados con una actividad delictiva?

Ejemplos que responden **sí**:
- Señalar a alguien como probable autor solo por su personalidad y situación personal.
- Predecir reincidencia basándose solo en el barrio de residencia.

Ejemplos que responden **no**:
- Un sistema que apoya la evaluación humana de pruebas objetivas ya existentes de un caso concreto.
- Un sistema que ayuda a priorizar casos según pruebas forenses ya recogidas.

Enlaces:
- Texto del artículo 5 — prácticas prohibidas: https://artificialintelligenceact.eu/article/5/

### `prohibido_reconocimiento_facial` — art. 5.1.e

¿El sistema crea o amplía una base de datos de reconocimiento facial extrayendo imágenes de internet o de cámaras de videovigilancia de forma indiscriminada (sin un criterio específico dirigido a esas personas)?

Ejemplos que responden **sí**:
- Descargar fotos de redes sociales en masa para ampliar una base de identificación.
- Extraer capturas de cámaras de tráfico para ampliar una base de reconocimiento facial.

Ejemplos que responden **no**:
- Una base de datos con el consentimiento explícito de cada persona incluida.
- Una base de datos de empleados de una empresa, creada con su consentimiento para control de acceso.

Enlaces:
- Texto del artículo 5 — prácticas prohibidas: https://artificialintelligenceact.eu/article/5/

### `prohibido_inferencia_emocional` — art. 5.1.f

¿El sistema infiere emociones de personas en el trabajo o en centros educativos, sin que sea por razones médicas o de seguridad?

Ejemplos que responden **sí**:
- Analizar por webcam si una persona parece motivada durante una entrevista de trabajo.
- Medir el nivel de estrés de estudiantes durante un examen para puntuarlos.

Ejemplos que responden **no**:
- Un sistema médico que detecta signos de fatiga en personal sanitario por seguridad.
- Un sistema que detecta fatiga en conductores profesionales por razones de seguridad vial.

Enlaces:
- Texto del artículo 5 — prácticas prohibidas: https://artificialintelligenceact.eu/article/5/

### `prohibido_categorizacion_biometrica` — art. 5.1.g

¿El sistema usa datos biométricos para inferir o deducir origen racial o étnico, opiniones políticas, afiliación sindical, creencias religiosas o filosóficas, vida sexual u orientación sexual de una persona?

Ejemplos que responden **sí**:
- Clasificar las creencias religiosas de alguien a partir de sus rasgos faciales.
- Inferir la orientación sexual de una persona a partir de su voz.

Ejemplos que responden **no**:
- Verificar biométricamente que una persona es quien dice ser, sin inferir ninguno de esos aspectos.
- Un sistema de reconocimiento facial que solo confirma si dos fotos son la misma persona.

Enlaces:
- Texto del artículo 5 — prácticas prohibidas: https://artificialintelligenceact.eu/article/5/

### `prohibido_biometria_remota_tiempo_real` — art. 5.1.h

¿El sistema hace identificación biométrica remota EN TIEMPO REAL en espacios de acceso público, con fines de actuación policial (fuera de los supuestos y garantías tasados por el Reglamento)?

Ejemplos que responden **sí**:
- Identificar en directo a todas las personas que pasan por una plaza pública para fines policiales generales.
- Cámaras policiales que identifican en tiempo real a los asistentes a una manifestación.

Ejemplos que responden **no**:
- Control de acceso biométrico en la entrada de una oficina privada.
- Identificación biométrica diferida (horas o días después, no en directo) para investigar un delito grave: no la cubre este artículo por no ser "en tiempo real" — cae, en su caso, bajo el Anexo III como sistema de alto riesgo, no bajo una excepción del art. 5.

Enlaces:
- Texto del artículo 5 — prácticas prohibidas: https://artificialintelligenceact.eu/article/5/

### `prohibido_contenido_intimo` — Reglamento (UE) 2026/1744

¿El sistema genera o manipula contenido íntimo no consentido de una persona real, o material de abuso sexual infantil?

Ejemplos que responden **sí**:
- Una aplicación de "desnudo" generado a partir de la fotografía de una persona real sin su consentimiento. Prohibido desde el 2 de diciembre de 2026.
- Crear un vídeo íntimo falso de una persona real y difundirlo sin su consentimiento.

Ejemplos que responden **no**:
- Generar una imagen de una persona completamente ficticia, sin base en ninguna persona real.

### `es_modelo_uso_general` — art. 3.63

¿Tu organización desarrolla y publica (comercializa o pone en servicio) este modelo, y es un modelo de IA de uso general — capaz de realizar con competencia una amplia variedad de tareas distintas, no diseñado para una única finalidad?

Ejemplos que responden **sí**:
- Una empresa que entrena y publica un modelo fundacional de texto o imagen para que terceros construyan aplicaciones encima.
- Un laboratorio que libera un modelo de lenguaje propio para que otros lo integren en sus productos.

Ejemplos que responden **no**:
- Una organización que solo usa la API de un modelo de terceros (como GPT o Claude) dentro de su propia aplicación — ahí no es proveedora del modelo, es usuaria.
- Una startup que construye un producto encima de un modelo ya publicado por otra empresa.

Enlaces:
- Definiciones del Reglamento (art. 3): https://artificialintelligenceact.eu/article/3/
- Resumen del régimen GPAI: https://artificialintelligenceact.eu/high-level-summary/

### `gpai_riesgo_sistemico` — art. 51

¿El modelo tiene capacidades de alto impacto — por ejemplo, se ha entrenado con más de 10^25 FLOP de cómputo, o la Comisión Europea lo ha designado como de riesgo sistémico?

Ejemplos que responden **sí**:
- Modelos frontera de gran escala de los grandes laboratorios de IA.
- Un modelo entrenado con recursos de cómputo comparables a los mayores modelos conocidos del mercado.

Ejemplos que responden **no**:
- Modelos de tamaño medio o pequeño, sin ese nivel de cómputo ni designación de la Comisión.
- Un modelo afinado (fine-tuned) sobre uno pequeño, sin entrenamiento desde cero a esa escala.

Enlaces:
- Texto del artículo 51 — riesgo sistémico: https://artificialintelligenceact.eu/article/51/

### `anexo_i_o_iii` — Anexo I / Anexo III

¿El sistema es (o es componente de seguridad de) un producto ya regulado por legislación europea de seguridad (Anexo I), o su finalidad encaja en uno de los ámbitos del Anexo III (biometría, infraestructuras críticas, educación, empleo, servicios esenciales, actuación policial, migración/fronteras, justicia/procesos democráticos)?

Ejemplos que responden **sí**:
- Una bomba de insulina que ajusta la dosis con IA (Anexo I, producto sanitario), o un sistema que filtra currículos o decide promociones (Anexo III, empleo).
- Un sistema que decide qué solicitudes de asilo se priorizan (Anexo III, migración).

Ejemplos que responden **no**:
- Una herramienta interna de IA que resume actas de reuniones, sin encajar en ningún ámbito regulado.
- Una herramienta de traducción automática de documentos internos, que no decide nada sobre personas.

Enlaces:
- Texto del Anexo I — productos regulados: https://artificialintelligenceact.eu/annex/1/
- Texto del Anexo III — casos de alto riesgo: https://artificialintelligenceact.eu/annex/3/


## Filtro del art. 6.3 (solo si aplica Anexo III) (6)

### `realiza_perfilado` — art. 6.3, párrafo final

¿El sistema realiza perfilado de personas físicas (evalúa aspectos de su personalidad, comportamiento, situación económica, salud, intereses o comportamiento)?

Ejemplos que responden **sí**:
- Un sistema que evalúa parámetros de una persona empleada para decidir su promoción, o los datos de una unidad familiar para valorar una ayuda.
- Un sistema que infiere hábitos de consumo de un cliente a partir de su historial de compras.

Ejemplos que responden **no**:
- Un sistema que solo convierte formatos de documento sin analizar a ninguna persona.
- Un sistema que solo cuenta cuántos documentos hay en una carpeta.

Enlaces:
- Texto del artículo 6 — reglas de clasificación: https://artificialintelligenceact.eu/article/6/

### `influye_materialmente` — art. 6.3

¿El resultado del sistema puede influir de forma relevante en la decisión final, más allá de una función procedimental o preparatoria? (obsérvalo en el funcionamiento real, no en el nombre de la herramienta)

Ejemplos que responden **sí**:
- Una recomendación que el equipo sigue casi siempre, aunque formalmente la decisión la firme una persona.
- Una puntuación que determina automáticamente el orden de atención, sin revisión real.

Ejemplos que responden **no**:
- Una alerta que un equipo humano investiga y descarta habitualmente, sin que determine el resultado.
- Un resumen informativo que la persona lee, pero no usa para decidir.

Enlaces:
- Texto del artículo 6 — reglas de clasificación: https://artificialintelligenceact.eu/article/6/

### `tarea_procedimental_limitada` — art. 6.3.a

¿El sistema ejecuta una tarea procedimental limitada (por ejemplo, convertir documentos a un formato común antes de que una persona examine su contenido), sin usarse para descartar solicitudes?

Ejemplos que responden **sí**:
- Digitalizar y estructurar formularios en papel para que una persona los revise después.
- Convertir un PDF escaneado en texto editable para que alguien lo lea.

Ejemplos que responden **no**:
- El mismo proceso, pero si además descarta automáticamente los formularios incompletos.
- Extraer datos del PDF y usarlos para aprobar o denegar automáticamente una solicitud.

Enlaces:
- Texto del artículo 6 — reglas de clasificación: https://artificialintelligenceact.eu/article/6/

### `mejora_resultado_humano_terminado` — art. 6.3.b

¿El sistema mejora el resultado de una actividad humana ya terminada, sin modificar la conclusión ni recomendar una decisión distinta?

Ejemplos que responden **sí**:
- Corregir el formato y la redacción de una resolución que una persona ya redactó y aprobó.
- Traducir a otro idioma un informe ya finalizado y aprobado.

Ejemplos que responden **no**:
- Un sistema que revisa esa misma resolución y sugiere cambiar la decisión de fondo.
- Un sistema que reescribe las conclusiones de ese informe.

Enlaces:
- Texto del artículo 6 — reglas de clasificación: https://artificialintelligenceact.eu/article/6/

### `detecta_patrones_sin_sustituir` — art. 6.3.c

¿El sistema detecta patrones o desviaciones para que una persona los investigue, sin que la señal decida un rechazo ni pese en la evaluación?

Ejemplos que responden **sí**:
- Señalar posibles duplicados en una lista para que alguien los compruebe.
- Marcar transacciones inusuales para que un analista las revise.

Ejemplos que responden **no**:
- La misma señal, pero si una solicitud marcada se rechaza automáticamente sin revisión humana real.
- Bloquear automáticamente una cuenta por esa misma señal, sin intervención humana.

Enlaces:
- Texto del artículo 6 — reglas de clasificación: https://artificialintelligenceact.eu/article/6/

### `tarea_preparatoria` — art. 6.3.d

¿El sistema realiza una tarea preparatoria (por ejemplo clasificar expedientes por idioma), sin que su resultado condicione la revisión posterior?

Ejemplos que responden **sí**:
- Repartir expedientes por idioma al equipo correspondiente.
- Agrupar correos entrantes por departamento antes de que alguien los lea.

Ejemplos que responden **no**:
- Ordenarlos por probabilidad de obtener una ayuda, si esa puntuación condiciona qué se revisa antes o con más atención.
- Priorizar solicitudes según una puntuación que determina cuáles se atienden antes.

Enlaces:
- Texto del artículo 6 — reglas de clasificación: https://artificialintelligenceact.eu/article/6/


## Transparencia (art. 50, sistemas que no son de alto riesgo) (6)

### `interactua_con_personas` — art. 50.1

¿El sistema interactúa directamente con personas físicas — por ejemplo un chatbot, un asistente de voz o cualquier interfaz conversacional?

Ejemplos que responden **sí**:
- Un chatbot de atención al cliente que conversa con usuarios.
- Un asistente de voz que responde preguntas de usuarios en tiempo real.

Ejemplos que responden **no**:
- Una herramienta que redacta borradores de texto para que alguien los revise y publique por su cuenta, sin que nadie converse con ella.
- Un sistema de back-office que solo procesa pedidos, sin hablar con nadie.

Enlaces:
- Texto del artículo 50 — transparencia: https://artificialintelligenceact.eu/article/50/

### `genera_contenido_sintetico` — art. 50.2

¿El sistema genera o manipula contenido sintético (texto, imagen, audio o vídeo), se publique o no?

Ejemplos que responden **sí**:
- Un asistente que redacta borradores de texto, aunque solo se usen internamente.
- Un sistema que genera imágenes o narra vídeos con voz sintética.

Ejemplos que responden **no**:
- Un sistema que solo clasifica o procesa datos existentes, sin producir contenido nuevo.
- Un sistema que solo hace ediciones estándar (recorte, corrección de color) sin alterar sustancialmente el contenido original.

Enlaces:
- Texto del artículo 50 — transparencia: https://artificialintelligenceact.eu/article/50/

### `contenido_publicado` — art. 50.4

¿Ese contenido generado o manipulado se hace público o se distribuye fuera del entorno interno de quien lo genera?

Ejemplos que responden **sí**:
- Se publica en la web, en redes sociales o se envía a personas fuera de la organización.
- Un vídeo generado que se sube a una plataforma pública.

Ejemplos que responden **no**:
- Se usa solo internamente (borradores, pruebas, entrenamiento de otro modelo) y nunca sale de la organización.
- Un informe generado por IA que solo circula dentro del equipo, sin publicarse.

Enlaces:
- Texto del artículo 50 — transparencia: https://artificialintelligenceact.eu/article/50/

### `contenido_es_texto` — art. 50.4

¿Ese contenido publicado es texto (no imagen, audio ni vídeo)?

Ejemplos que responden **sí**:
- Un artículo, una noticia o un resumen generado por IA que se publica como texto.
- Una publicación de blog institucional redactada por IA.

Ejemplos que responden **no**:
- Una imagen o un vídeo generado o manipulado (posible ultrasuplantación / deepfake) — la excepción aplicable es distinta, ver el artículo.
- Un audio con voz sintética publicado como pieza sonora.

Enlaces:
- Texto del artículo 50 — transparencia: https://artificialintelligenceact.eu/article/50/

### `revision_editorial_sustantiva` — art. 50.4

Antes de publicarse, ¿ese texto pasa por una revisión humana sustantiva (no solo ortográfica o de formato) y hay una persona física o jurídica que asume la responsabilidad editorial de lo que se publica?

Ejemplos que responden **sí**:
- Alguien del equipo revisa el fondo del contenido, decide si se publica y asume esa responsabilidad.
- Un editor que reescribe partes del texto y firma la publicación con su nombre.

Ejemplos que responden **no**:
- Se publica automáticamente, o la única revisión es corregir ortografía/gramática — eso NO cuenta como revisión editorial a estos efectos.
- "Revisar" significa solo pasar el corrector ortográfico antes de publicar automáticamente.

Enlaces:
- Texto del artículo 50 — transparencia: https://artificialintelligenceact.eu/article/50/

### `transparencia_biometria_emociones` — art. 50.3

¿El sistema es de categorización biométrica o de reconocimiento de emociones, y hay personas físicas expuestas a su funcionamiento (fuera de los usos ya prohibidos por el art. 5 y sin ser un uso policial autorizado por ley)?

Ejemplos que responden **sí**:
- Cámaras en una tienda que categorizan a los clientes por edad o género para estadísticas, sin inferir categorías protegidas.
- Un sistema de reconocimiento de emociones en un contact center para priorizar llamadas, fuera del contexto laboral/educativo prohibido.

Ejemplos que responden **no**:
- Verificación biométrica 1:1 (¿eres quien dices ser?) para desbloquear un dispositivo o acceder a un servicio.
- Uso policial de categorización biométrica autorizado por ley para detectar o investigar delitos, con las garantías correspondientes.

Enlaces:
- Texto del artículo 50 — transparencia: https://artificialintelligenceact.eu/article/50/

## Rol en la cadena (tras la clasificación, no parte del árbol de preguntas sí/no)

- `proveedor`: Proveedor — lo desarrolla y lo comercializa o pone en servicio bajo su marca
- `responsable_despliegue`: Responsable del despliegue — lo utiliza bajo su autoridad
- `importador`: Importador — lo introduce en el mercado de la Unión desde fuera de ella
- `distribuidor`: Distribuidor — lo pone a disposición en la cadena sin ser proveedor ni importador
- `representante_autorizado`: Representante autorizado — actúa en la Unión por mandato de un proveedor externo
