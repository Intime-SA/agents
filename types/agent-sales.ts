import { salesDecisionSchema } from "@/lib/zod/agents"
import { z } from "zod"
import { ContactContext, LeadStatus, SettingsDocument, StatusDocument } from "./kommo"

export type SalesDecision = z.infer<typeof salesDecisionSchema>

export interface SalesAgentRequest {
  messageText: string,
  currentStatus: LeadStatus,
  talkId: string,
  contactContext?: ContactContext,
  rules?: Array<{ priority: number; rule: string }>,
  settings?: SettingsDocument | null | undefined,
  statuses?: StatusDocument[] | null,
  attachment?: {
    type: string;
    link: string;
    file_name: string;
  },
}

export interface SalesAgentResponse {
  decision: SalesDecision
}

