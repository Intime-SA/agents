import { paymentReceiptSchema } from "@/lib/zod/agents"
import { z } from "zod"

// ===== AGENT PAYMENTS =====
export type PaymentReceipt = z.infer<typeof paymentReceiptSchema>

export interface PaymentAgentRequest {
  attachment: {
    link: string,
    file_name: string,
    type: string
  }
}

export interface PaymentAgentResponse {
  success: boolean,
  data: PaymentReceipt,
  extractedAt: string,
  partial: boolean,
  note?: string
}
