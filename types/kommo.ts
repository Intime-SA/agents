// Status que el bot puede asignar como nuevos (excluye "Cargo" por restricción de seguridad)
export type LeadStatus = "Revisar" | "PidioUsuario" | "PidioCbuAlias" | "Cargo" | "RevisarImagen" | "NoCargo" | "NoAtender" | "Seguimiento" | "Ganado" | "Perdido" | "sin-status" | "CreoUsuario" 
  
// Status que el bot puede asignar como nuevos (excluye "Cargo" por restricción de seguridad)
export type BotAssignableStatus = "Revisar" | "PidioUsuario" | "PidioCbuAlias" | "RevisarImagen" | "NoCargo" | "NoAtender" | "sin-status"

// interface para la decisión de la IA
export interface AIDecision {
    currentStatus: LeadStatus
    newStatus: BotAssignableStatus
    shouldChange: boolean
    reasoning: string
    confidence: number
    attachment?: any
  }

// Interface para documentos de settings
export interface SettingsDocument {
  _id?: string;
  accountCBU: string;
  context: string;
  message: string;
  createdAt?: string;
  updatedAt?: string;
  accountName: string;
  walink?: string;
  numbers?: Array<{
    name: string;
    phone: string;
  }>;
}

// Interface para documentos de status
export interface StatusDocument {
  _id?: string;
  statusId: string;
  name: string;
  description: string;
  kommo_id: string | null;
  color?: string; // Color en formato hex (opcional)
  createdAt: string;
  updatedAt: string;
}

// Interfaz para el contexto histórico de un contacto
export interface ContactContext {
  contactId: string;
  userInfo?: {
    name: string;
    clientId: string;
    source: string;
    sourceName: string;
    firstMessage: string;
    firstMessageDate: string;
  };
  activeLeads: Array<{
    leadId: string;
    status?: string;
    createdAt: string;
    lastActivity?: string;
  }>;
  recentMessages: Array<{
    text: string;
    type: "incoming" | "outgoing";
    createdAt: string;
    authorName: string;
  }>;
  activeTasks: Array<{
    talkId: string;
    isInWork: boolean;
    isRead: boolean;
    createdAt: string;
    lastActivity?: string;
  }>;
  botActions: Array<{
    messageText: string;
    aiDecision: {
      currentStatus: string;
      newStatus: string;
      shouldChange: boolean;
      reasoning: string;
      confidence: number;
    };
    statusUpdateResult: {
      success: boolean;
      error?: string;
    };
    processingTimestamp: string;
  }>;
  summary: {
    totalMessages: number;
    lastActivity: string;
    currentStatus?: string;
    conversationDuration: string;
  };
}