import { generateObject } from "ai"
import { clientAnalysisSchema, type ClientAgentRequest, type ClientAnalysis } from "@/types/agent-sales"

export async function analyzeClient(request: ClientAgentRequest): Promise<ClientAnalysis> {
  const startTime = Date.now()

  const systemMessage = `
Eres un analista de clientes experto que evalúa mensajes para clasificar clientes y determinar prioridades de atención.

Tu objetivo es:
1. Identificar el tipo de cliente (nuevo, recurrente, VIP, problemático)
2. Detectar el sentimiento del mensaje (positivo, neutral, negativo, urgente)
3. Asignar una prioridad de atención (1-10, donde 10 es máxima prioridad)
4. Sugerir etiquetas relevantes
5. Recomendar una acción para el equipo

Considera:
- Clientes nuevos requieren atención especial
- Mensajes urgentes o negativos necesitan prioridad alta
- Clientes VIP siempre tienen prioridad
- Clientes problemáticos deben ser identificados temprano
`

  const prompt = `
Analiza este mensaje de cliente:

Mensaje: "${request.messageText}"
Contact ID: "${request.contactId}"

${
  request.clientHistory
    ? `
Historial del cliente:
- Total de interacciones: ${request.clientHistory.totalInteractions || "Desconocido"}
- Última interacción: ${request.clientHistory.lastInteraction || "Desconocido"}
- Tiempo promedio de respuesta: ${request.clientHistory.averageResponseTime || "Desconocido"}
`
    : "Sin historial disponible (posiblemente cliente nuevo)"
}

Proporciona un análisis completo del cliente y recomendaciones de acción.
`

  try {
    console.log("[v0] 🤖 Client Agent - Analizando cliente:", {
      messageText: request.messageText,
      contactId: request.contactId,
    })

    const { object } = await generateObject({
      model: "openai/gpt-5",
      schema: clientAnalysisSchema,
      system: systemMessage,
      prompt: prompt,
    })

    const processingTime = Date.now() - startTime
    console.log("[v0] ✅ Client Agent - Análisis completado:", {
      clientType: object.clientType,
      sentiment: object.sentiment,
      priority: object.priority,
      processingTime: `${processingTime}ms`,
    })

    return object
  } catch (error) {
    console.error("[v0] ❌ Client Agent - Error:", error)

    // Fallback analysis
    return {
      clientType: "unknown",
      sentiment: "neutral",
      priority: 5,
      tags: ["error-analysis"],
      suggestedAction: "Revisar manualmente - error en análisis automático",
      confidence: 0,
    }
  }
}
