export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
  talkId?: string;
  leadId?: string;
  [key: string]: any;
}

export interface LeadStatusChange {
  id: string;
  old_status_id: string;
  status_id: string;
  modified_user_id: string;
}

export const logAiResponseReceived = (response: any, confidence: number) =>
  logger.aiResponseReceived(response, confidence);
export const logAiProcessingError = (error: any) =>
  logger.aiProcessingError(error);
export const logAiPromptSent = (prompt: string, systemMessage: string) =>
  logger.aiPromptSent(prompt, systemMessage);

class Logger {
  private currentLevel: LogLevel = LogLevel.INFO;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
    // En desarrollo mostramos más logs, en producción también mostramos INFO para debugging
    this.currentLevel = this.isProduction ? LogLevel.INFO : LogLevel.DEBUG;
  }

  private formatLog(
    level: LogLevel,
    message: string,
    data?: any,
    context?: Partial<LogContext>
  ): LogContext {
    const logContext: LogContext = {
      timestamp: new Date().toISOString(),
      level: LogLevel[level],
      message,
      ...context,
    };

    if (data !== undefined) {
      logContext.data = data;
    }

    return logContext;
  }

  private logToConsole(
    level: LogLevel,
    message: string,
    data?: any,
    context?: Partial<LogContext>
  ) {
    const logContext = this.formatLog(level, message, data, context);

    // En producción, usar console.log para todos los niveles para máxima visibilidad en Vercel
    if (this.isProduction) {
      if (data !== undefined && data !== null) {
        console.log(`[${level}] ${message}`, data);
      } else {
        console.log(`[${level}] ${message}`);
      }
      // También log estructurado para mejor parsing
      console.log(JSON.stringify(logContext));
    } else {
      // En desarrollo mantener los console methods normales
      if (level === LogLevel.DEBUG || level === LogLevel.INFO) {
        console.log(message, data ? data : "");
      } else if (level === LogLevel.WARN) {
        console.warn(message, data ? data : "");
      } else if (level === LogLevel.ERROR) {
        console.error(message, data ? data : "");
      }
    }
  }

  debug(message: string, data?: any, context?: Partial<LogContext>) {
    if (this.currentLevel <= LogLevel.DEBUG) {
      this.logToConsole(LogLevel.DEBUG, message, data, context);
    }
  }

  info(message: string, data?: any, context?: Partial<LogContext>) {
    if (this.currentLevel <= LogLevel.INFO) {
      this.logToConsole(LogLevel.INFO, message, data, context);
    }
  }

  warn(message: string, data?: any, context?: Partial<LogContext>) {
    if (this.currentLevel <= LogLevel.WARN) {
      this.logToConsole(LogLevel.WARN, message, data, context);
    }
  }

  error(message: string, data?: any, context?: Partial<LogContext>) {
    if (this.currentLevel <= LogLevel.ERROR) {
      this.logToConsole(LogLevel.ERROR, message, data, context);
    }
  }

  // Logs para AI processing detallado
  aiPromptSent(prompt: string, systemMessage: string) {
    this.debug("🤖 PROMPT ENVIADO A AI", { prompt, systemMessage });
  }

  aiResponseReceived(response: any, confidence: number) {
    this.info(
      `🤖 RESPUESTA DE AI recibida (confianza: ${(confidence * 100).toFixed(
        1
      )}%)`,
      response
    );
  }

  aiProcessingError(error: any) {
    this.error("Error processing message with AI", error);
  }
}

// Instancia singleton del logger
export const logger = new Logger();
