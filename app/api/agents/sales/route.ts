import { type NextRequest, NextResponse } from "next/server";
import { processMessageWithAI } from "@/lib/agents/sales";
import type { SalesAgentRequest } from "@/types/agent-sales";
import { AIDecision } from "@/types/kommo";
import { analyzePaymentReceipt } from "@/lib/agents/payments";

// ENDPOINT PARA PROCESAR UN MENSAJE EN EMBUDO DE VENTAS
export async function POST(req: NextRequest) {
  try {
    const body: SalesAgentRequest = await req.json();

    if (!body.currentStatus) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan campos requeridos: messageText, currentStatus",
        },
        { status: 400 }
      );
    }

   else {
      const decision = await processMessageWithAI(
        body.messageText,
        body.currentStatus,
        body.talkId,
        body.contactContext,
        body.rules,
        body.settings,
        body.statuses,
        body.attachment
      );

      return NextResponse.json(decision, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
