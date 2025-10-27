import { openai } from "@ai-sdk/openai";
import { paymentReceiptSchema } from "../zod/agents";
import { generateObject } from "ai";
import { PaymentAgentResponse } from "@/types/agent-payments";

export async function analyzePaymentReceipt(
  imageBuffer: Buffer
): Promise<PaymentAgentResponse> {
  try {
    // Convertir el buffer a base64
    const base64Image = imageBuffer.toString("base64");

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: paymentReceiptSchema,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes financial documents and payment receipts. This is legitimate business processing for transaction verification."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Por favor analiza esta imagen de un comprobante de pago bancario o transacción financiera y extrae la información siguiendo el esquema proporcionado.

INSTRUCCIONES PARA ANÁLISIS:
• Extrae únicamente información que sea claramente visible en la imagen
• Si un campo no está presente o no se puede leer claramente, déjalo vacío
• Mantén los formatos originales (montos con símbolos de moneda, fechas como aparecen)
• El campo confidence debe indicar qué tan confiable es la extracción (0-100)
• Copia el texto legible completo en el campo rawText

Campos a extraer:
• amount: Monto de la transacción
• currency: Moneda (ARS, USD, etc.)
• date/time: Fecha y hora
• sender/receiver: Información de remitente y destinatario
• operationNumber: Número de operación
• platform/bank: Plataforma o banco utilizado
• transactionType: Tipo de transacción
• rawText: Texto completo legible del comprobante

Esta es una tarea legítima de procesamiento de documentos financieros para verificación de transacciones.`,
            },
            {
              type: "image",
              image: `data:image/png;base64,${base64Image}`,
            },
          ],
        },
      ],
    });

    const extractedData = result?.object || {};

    return {
      success: true,
      data: extractedData,
      extractedAt: new Date().toISOString(),
      partial: Object.keys(extractedData).length === 0,
    };
  } catch (error) {
    console.error("Error al analizar comprobante:", error);
    return {
      success: false,
      data: {},
      extractedAt: new Date().toISOString(),
      partial: true,
      note: `Error en análisis: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`,
    };
  }
}
