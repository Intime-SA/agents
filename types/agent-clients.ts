import { clientAnalysisSchema } from "@/lib/zod/agents"
import { z } from "zod"

export type ClientAnalysis = z.infer<typeof clientAnalysisSchema>

export interface ClientAgentRequest {
  messageText: string
  contactId: string
  clientHistory?: {
    totalInteractions?: number
    lastInteraction?: string
    averageResponseTime?: number
  }
}

export interface ClientAgentResponse {
  analysis: ClientAnalysis
}
