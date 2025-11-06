import { type NextRequest, NextResponse } from "next/server";
import { analyzePaymentReceipt } from "@/lib/agents/payments";
import type { PaymentAgentRequest } from "@/types/agent-payments";

const PDFCO_API_KEY =
  "invertimesa@gmail.com_LN3uOC4bRMUznKvP38mjDa3ULCzXmbfyrJdcvJY9uJlgugGkSTkl11CVkHEEaAW3";

/**
 * 🔹 Sube un PDF local (buffer/base64) a PDF.co y devuelve la URL temporal.
 */
async function uploadPdfToPdfCo(pdfBuffer: Buffer): Promise<string> {
  const base64Pdf = pdfBuffer.toString("base64");

  const uploadResponse = await fetch("https://api.pdf.co/v1/file/upload/base64", {
    method: "POST",
    headers: {
      "x-api-key": PDFCO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file: base64Pdf,
      name: "comprobante.pdf",
    }),
  });

  const uploadData = await uploadResponse.json();
  if (!uploadData.url) {
    console.error("❌ Error al subir PDF:", uploadData);
    throw new Error(uploadData.message || "Error al subir el PDF a PDF.co");
  }

  console.log("✅ PDF subido a PDF.co:", uploadData.url);
  return uploadData.url;
}

/**
 * 🔹 Convierte un PDF alojado en PDF.co (o accesible públicamente) a imagen PNG.
 * Devuelve la primera página convertida.
 */
async function convertUploadedPdfToImage(tempPdfUrl: string): Promise<string> {
  const convertResponse = await fetch("https://api.pdf.co/v1/pdf/convert/to/png", {
    method: "POST",
    headers: {
      "x-api-key": PDFCO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: tempPdfUrl,
      pages: "0-", // todas las páginas
      async: false,
    }),
  });

  const convertData = await convertResponse.json();

  // ✅ Si devuelve un array de URLs, tomamos la primera
  const imageUrl =
    convertData.url ||
    (Array.isArray(convertData.urls) && convertData.urls.length > 0
      ? convertData.urls[0]
      : null);

  if (!imageUrl) {
    console.error("❌ Error al convertir PDF:", convertData);
    throw new Error(convertData.message || "Error al convertir PDF a imagen");
  }

  console.log("✅ Imagen generada en PDF.co:", imageUrl);
  return imageUrl;
}

/**
 * 🔹 Convierte un PDF a imagen, intentando primero con la URL directa
 *    y haciendo fallback al upload en PDF.co si la URL no es accesible.
 */
async function convertPdfSmart(pdfUrl: string): Promise<string> {
  try {
    console.log("🔹 Intentando conversión directa de la URL...");
    return await convertUploadedPdfToImage(pdfUrl);
  } catch (err) {
    console.warn("⚠️ Conversión directa falló, intentando vía upload a PDF.co:", (err as Error).message);

    // Descargar el PDF manualmente
    const pdfArrayBuffer = await fetch(pdfUrl).then((res) => res.arrayBuffer());
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Subirlo y volver a convertir
    const tempUrl = await uploadPdfToPdfCo(pdfBuffer);
    return await convertUploadedPdfToImage(tempUrl);
  }
}

/**
 * 🔹 Endpoint principal: convierte y analiza comprobantes de pago.
 */
export async function POST(req: NextRequest) {
  try {
    const body: PaymentAgentRequest = await req.json();

    if (!body.attachment?.link) {
      return NextResponse.json(
        { success: false, error: "Se requiere attachment.link" },
        { status: 400 }
      );
    }

    console.log("📄 Link del comprobante:", body.attachment.link);

    // 1️⃣ Convertir el PDF a imagen (automáticamente elige el mejor método)
    const imageUrl = await convertPdfSmart(body.attachment.link);

    // 2️⃣ Descargar la imagen convertida
    const imageBuffer = await fetch(imageUrl).then((res) => res.arrayBuffer());

    // 3️⃣ Analizar el comprobante (usa tu agente de pagos existente)
    const result = await analyzePaymentReceipt(Buffer.from(imageBuffer));

    // 4️⃣ Responder con el resultado del análisis
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("🚨 Error al analizar comprobante:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
