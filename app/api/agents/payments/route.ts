import { type NextRequest, NextResponse } from "next/server";
import { analyzePaymentReceipt } from "@/lib/agents/payments";
import type { PaymentAgentRequest } from "@/types/agent-payments";

export async function POST(req: NextRequest) {
  try {
    const body: PaymentAgentRequest = await req.json();

    if (!body.attachment.link) {
      return NextResponse.json(
        {
          success: false,
          error: "Se requiere attachment.link",
        },
        { status: 400 }
      );
    }

    // Analizar el comprobante de pago
    const buffer = await fetch(body.attachment.link).then((res) => res.arrayBuffer())
    const result = await analyzePaymentReceipt(Buffer.from(buffer))

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}
