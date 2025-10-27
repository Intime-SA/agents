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
    currency: z.string().optional().describe("Moneda (ARS, USD, etc.)"),
    date: z.string().optional().describe("Fecha de la transacción"),
    time: z.string().optional().describe("Hora de la transacción"),
    sender: z
      .object({
        name: z.string().optional().describe("Nombre del remitente"),
        cuit: z.string().optional().describe("CUIT del remitente"),
        platform: z
          .string()
          .optional()
          .describe("Plataforma del remitente (Mercado Pago, BNA+, etc.)"),
        cvu: z.string().optional().describe("CVU del remitente"),
        cbu: z.string().optional().describe("CBU del remitente"),
      })
      .optional()
      .describe("Información del remitente"),
    receiver: z
      .object({
        name: z.string().optional().describe("Nombre del destinatario"),
        cuit: z.string().optional().describe("CUIT del destinatario"),
        cvu: z.string().optional().describe("CVU del destinatario"),
        cbu: z.string().optional().describe("CBU del destinatario"),
        bank: z.string().optional().describe("Banco del destinatario"),
      })
      .optional()
      .describe("Información del destinatario"),
    operationNumber: z
      .string()
      .optional()
      .describe("Número de operación/transacción"),
    coelsaId: z.string().optional().describe("ID de Coelsa"),
    transactionType: z
      .string()
      .optional()
      .describe("Tipo de transacción (Transferencia, Pago, etc.)"),
    platform: z
      .string()
      .optional()
      .describe("Plataforma utilizada (Mercado Pago, BNA+, etc.)"),
    status: z.string().optional().describe("Estado de la transacción"),
    bank: z.string().optional().describe("Banco utilizado"),
    reference: z.string().optional().describe("Referencia de la transacción"),
    description: z.string().optional().describe("Descripción/motivo"),
    fee: z
      .union([z.string(), z.number()])
      .optional()
      .describe("Comisión/costo"),
    balance: z
      .union([z.string(), z.number()])
      .optional()
      .describe("Saldo restante"),
    location: z.string().optional().describe("Ubicación"),
    device: z.string().optional().describe("Dispositivo utilizado"),
    ip: z.string().optional().describe("Dirección IP"),
    notes: z.string().optional().describe("Notas adicionales"),
    rawText: z
      .string()
      .optional()
      .describe("Texto completo extraído del comprobante"),
    confidence: z
      .number()
      .optional()
      .describe("Nivel de confianza del análisis (0-100)"),
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
