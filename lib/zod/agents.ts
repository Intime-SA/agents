import z from "zod";





// ===== AGENT SALES =====
export const salesDecisionSchema = z.object({
  currentStatus: z.enum([
    "Revisar",
    "PidioUsuario",
    "PidioCbuAlias",
    "RevisarImagen",  
    "Cargo",
    "NoCargo",
    "NoAtender",
    "sin-status",
  ]),
  newStatus: z.enum([
    "Revisar",
    "PidioUsuario",
    "PidioCbuAlias",
    "RevisarImagen",
    "NoCargo",
    "NoAtender",
    "sin-status",
  ]),
  shouldChange: z.boolean(),
  reasoning: z.string(),
  confidence: z.number().min(0).max(1),
});




// ===== AGENT PAYMENTS =====
export const paymentReceiptSchema = z
  .object({
    amount: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (typeof val === "string") {
          // Convertir string a number, manejando formatos monetarios argentinos
          const cleaned = val.replace(/[^\d.,]/g, "");
          // Si hay punto y coma, asumir formato argentino (coma = decimal, punto = miles)
          if (cleaned.includes(",") && cleaned.includes(".")) {
            const num = parseFloat(cleaned.replace(".", "").replace(",", "."));
            return isNaN(num) ? undefined : num;
          }
          // Si solo hay puntos, asumir que son separadores de miles (formato argentino)
          else if (cleaned.includes(".") && !cleaned.includes(",")) {
            const num = parseFloat(cleaned.replace(/\./g, ""));
            return isNaN(num) ? undefined : num;
          }
          // Si solo hay coma, asumir formato decimal estándar
          else if (cleaned.includes(",")) {
            const num = parseFloat(cleaned.replace(",", "."));
            return isNaN(num) ? undefined : num;
          }
          // Sin separadores, convertir directamente
          else {
            const num = parseFloat(cleaned);
            return isNaN(num) ? undefined : num;
          }
        }
        return val;
      })
      .describe("Monto de la transacción"),
    date: z.string().optional().describe("Fecha de la transacción"),
    time: z.string().optional().describe("Hora de la transacción"),
    sender: z
      .object({
        name: z.string().optional().describe("Nombre del remitente"),
        cuit: z.string().optional().describe("CUIT del remitente, sin -"),
        platform: z
          .string()
          .optional()
          .describe("Plataforma del remitente (Mercado Pago, BNA+, etc.)"),
        cvu: z.string().optional().describe("CVU del remitente, 22 digitos numericos"),
        cbu: z.string().optional().describe("CBU del remitente, 22 digitos numericos"),
      })
      .optional()
      .describe("Información del remitente"),
    operationNumber: z
      .string()
      .optional()
      .describe("Número de operación/transacción, debe tener 22 caracteres alfanuméricos"),
  })
  .describe("Esquema estructurado para análisis de comprobantes de pago");





  
// ===== AGENT CLIENTS =====
export const clientAnalysisSchema = z.object({
  clientType: z
    .enum(["new", "returning", "vip", "problematic", "unknown"])
    .describe("Tipo de cliente identificado"),
  sentiment: z
    .enum(["positive", "neutral", "negative", "urgent"])
    .describe("Sentimiento del mensaje"),
  priority: z.number().min(1).max(10).describe("Prioridad de atención (1-10)"),
  tags: z.array(z.string()).describe("Etiquetas relevantes del cliente"),
  suggestedAction: z.string().describe("Acción sugerida para el equipo"),
  confidence: z.number().min(0).max(1),
});
