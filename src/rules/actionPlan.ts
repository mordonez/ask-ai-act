import type { ClassificationLabel, ClassificationResult } from "./types";
import type { Role } from "./questions";

/**
 * Convierte una clasificación (+ rol, si se conoce) en un plan de
 * acción: obligaciones, qué guía de AESIA consultar para cada una, y
 * la próxima acción concreta. Contenido tomado del post del blog
 * ("El Reglamento europeo de IA: por dónde empezar") y de
 * sources/aesia/notas/ — no inventado aquí.
 *
 * Principio de AGENTS.md: esto es texto fijo asociado a cada
 * combinación (label, role), no generado por un modelo. Si se añade
 * un modelo más adelante (Fase 3) será para explicar este plan en
 * lenguaje natural, no para decidir su contenido.
 */

export interface ActionItem {
  obligation: string;
  guide: string;
}

export interface ActionPlan {
  nextAction: string;
  deadlineNote?: string;
  items: ActionItem[];
}

const PROVEEDOR_ALTO_RIESGO: ActionItem[] = [
  { obligation: "Sistema de gestión de la calidad documentado", guide: "Guía 4" },
  { obligation: "Gestión de riesgos durante todo el ciclo de vida", guide: "Guía 5" },
  { obligation: "Gobernanza de datos de entrenamiento, validación y prueba", guide: "Guía 7" },
  { obligation: "Medición de precisión, solidez y ciberseguridad", guide: "Guías 9, 10 y 11" },
  { obligation: "Diseñar el sistema para permitir supervisión humana efectiva", guide: "Guía 6" },
  { obligation: "Instrucciones de uso y transparencia hacia el responsable del despliegue", guide: "Guía 8" },
  { obligation: "Documentación técnica completa (Anexo IV)", guide: "Guía 15" },
  { obligation: "Evaluación de conformidad antes de comercializar o poner en servicio", guide: "Guía 3" },
  { obligation: "Registros automáticos de eventos", guide: "Guía 12" },
  { obligation: "Vigilancia poscomercialización y notificación de incidentes graves", guide: "Guías 13 y 14" },
];

const RESPONSABLE_DESPLIEGUE_ALTO_RIESGO: ActionItem[] = [
  { obligation: "Usar el sistema conforme a las instrucciones del proveedor", guide: "Guía 8" },
  { obligation: "Supervisión humana operativa: quién supervisa, con qué información y capacidad de intervenir", guide: "Guía 6" },
  { obligation: "Comprobar si corresponde una evaluación de impacto en derechos fundamentales (EIDF/FRIA, art. 27)", guide: "Guía 1, apartado de roles" },
  { obligation: "Conservar los registros que genere el sistema", guide: "Guía 12" },
  { obligation: "Detectar, clasificar y notificar incidentes graves si se producen", guide: "Guía 14" },
];

const IMPORTADOR_DISTRIBUIDOR_ALTO_RIESGO: ActionItem[] = [
  { obligation: "Verificar que el proveedor ha completado la evaluación de conformidad y el marcado CE", guide: "Guía 3" },
  { obligation: "Conservar la documentación de conformidad y poder aportarla a la autoridad", guide: "Guía 15" },
  { obligation: "No introducir en el mercado ni distribuir si hay indicios de incumplimiento", guide: "Guía 1" },
];

/**
 * Cada obligación de transparencia solo aparece si su disparador
 * específico (art. 50.1 interacción, o 50.2/50.4 contenido generado)
 * está entre los `legalRefs` del resultado — no las dos siempre
 * juntas. Ver la nota de questions.ts sobre por qué se separaron.
 */
function transparenciaItems(legalRefs: string[]): ActionItem[] {
  const items: ActionItem[] = [];
  if (legalRefs.includes("art. 50.1")) {
    items.push({ obligation: "Informar de que se interactúa con un sistema de IA (p. ej. chatbot)", guide: "Guía 8" });
  }
  if (legalRefs.includes("art. 50.2 / 50.4")) {
    items.push({ obligation: "Marcar y etiquetar el contenido sintético generado o manipulado", guide: "Guía 8" });
  }
  return items;
}

function altoRiesgoItems(role: Role | undefined): ActionItem[] {
  switch (role) {
    case "proveedor":
      return PROVEEDOR_ALTO_RIESGO;
    case "responsable_despliegue":
      return RESPONSABLE_DESPLIEGUE_ALTO_RIESGO;
    case "importador":
    case "distribuidor":
    case "representante_autorizado":
      return IMPORTADOR_DISTRIBUIDOR_ALTO_RIESGO;
    default:
      // Sin rol conocido: mostrar el conjunto completo, sin filtrar por rol.
      return [
        ...PROVEEDOR_ALTO_RIESGO,
        ...RESPONSABLE_DESPLIEGUE_ALTO_RIESGO.filter(
          (item) => !PROVEEDOR_ALTO_RIESGO.some((p) => p.obligation === item.obligation)
        ),
      ];
  }
}

export function buildActionPlan(result: ClassificationResult, role: Role | undefined): ActionPlan {
  const label: ClassificationLabel = result.label;

  switch (label) {
    case "fuera_de_ambito":
      return {
        nextAction:
          "Documenta por qué el sistema queda fuera del ámbito del Reglamento (por si cambia su diseño o finalidad) y continúa con el siguiente sistema de tu inventario.",
        items: [],
      };

    case "uso_prohibido":
      return {
        nextAction:
          "Detén el desarrollo o el uso del sistema en esta finalidad y consulta asesoría legal antes de continuar. No puede comercializarse ni ponerse en servicio salvo excepción expresa del Reglamento.",
        items: [{ obligation: "Revisión jurídica de las excepciones aplicables al artículo 5", guide: "Guía 1" }],
      };

    case "alto_riesgo":
      return {
        nextAction: role
          ? "Empieza por el sistema de gestión de riesgos y la gobernanza de datos — son la base de la que dependen el resto de requisitos."
          : "Responde primero a qué rol tiene tu organización en este sistema: las obligaciones concretas dependen de ello.",
        deadlineNote:
          "Fecha límite: 2 de diciembre de 2027 si el sistema está en el Anexo III, 2 de agosto de 2028 si está en el Anexo I — confirma cuál aplica a tu caso.",
        items: altoRiesgoItems(role),
      };

    case "obligaciones_transparencia":
      return {
        nextAction: "Implementa las obligaciones de transparencia que apliquen a tu sistema, listadas abajo.",
        items: transparenciaItems(result.legalRefs),
      };

    case "sin_obligaciones_especificas":
      return {
        nextAction:
          "Aunque este árbol no detecta obligaciones específicas, comprueba igualmente las obligaciones generales: alfabetización en IA de quienes lo operan (art. 4), y si el sistema es o incorpora un modelo de IA de uso general (GPAI).",
        items: [],
      };

    case "no_determinado":
      return {
        nextAction: "Responde a las preguntas pendientes antes de poder dar un plan de acción.",
        items: [],
      };
  }
}
