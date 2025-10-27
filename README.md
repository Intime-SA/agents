# Vercel AI Agents API

API de agentes inteligentes construida con el AI SDK v5 de Vercel para procesamiento de mensajes, análisis de clientes y verificación de pagos.

## 🤖 Agentes Disponibles

### 1. Sales Agent (`/api/agents/sales`)
Analiza mensajes de clientes y determina cambios de estado en el proceso de ventas.

**Características:**
- Análisis de intención del cliente
- Determinación automática de estados
- Contexto histórico de conversaciones
- Reglas de negocio personalizables
- Respuestas sugeridas

**Modelo:** GPT-5

**Request:**
\`\`\`json
{
  "messageText": "¿Me pasas el usuario?",
  "currentStatus": "Revisar",
  "contactId": "12345",
  "talkId": "talk_67890",
  "context": {
    "userName": "Juan Pérez",
    "clientId": "+5491123456789",
    "recentMessages": [
      {
        "text": "Hola, quiero cargar saldo",
        "type": "incoming",
        "createdAt": "2025-01-26T10:00:00Z",
        "authorName": "Juan Pérez"
      }
    ]
  },
  "rules": [
    {
      "priority": 1,
      "rule": "Si el cliente pide usuario, cambiar a PidioUsuario"
    }
  ],
  "settings": {
    "context": "Plataforma de carga de saldo online",
    "message": "Bienvenido a nuestro servicio"
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "timestamp": "2025-01-26T10:05:00Z",
  "processingTime": 1234,
  "decision": {
    "currentStatus": "Revisar",
    "newStatus": "PidioUsuario",
    "shouldChange": true,
    "reasoning": "El cliente solicitó explícitamente el usuario",
    "confidence": 0.95,
    "suggestedResponse": "Claro, te envío el usuario por privado"
  }
}
\`\`\`

### 2. Client Agent (`/api/agents/clients`)
Analiza y clasifica clientes basándose en sus mensajes e historial.

**Características:**
- Clasificación de tipo de cliente
- Análisis de sentimiento
- Asignación de prioridad
- Etiquetado automático
- Recomendaciones de acción

**Modelo:** GPT-5

**Request:**
\`\`\`json
{
  "messageText": "URGENTE: Necesito ayuda con mi cuenta YA!",
  "contactId": "12345",
  "clientHistory": {
    "totalInteractions": 15,
    "lastInteraction": "2025-01-25T15:30:00Z",
    "averageResponseTime": 120
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "timestamp": "2025-01-26T10:05:00Z",
  "processingTime": 987,
  "analysis": {
    "clientType": "returning",
    "sentiment": "urgent",
    "priority": 9,
    "tags": ["urgente", "cuenta", "soporte-tecnico"],
    "suggestedAction": "Atender inmediatamente - cliente recurrente con problema urgente",
    "confidence": 0.92
  }
}
\`\`\`

### 3. Payment Agent (`/api/agents/payments`)
Analiza comprobantes de pago y extrae información estructurada.

**Características:**
- Extracción de datos de comprobantes
- Reconocimiento de montos y fechas
- Identificación de remitente/destinatario
- Verificación de montos esperados
- Soporte para múltiples plataformas

**Modelo:** GPT-4o (con visión)

**Request:**
\`\`\`json
{
  "imageBuffer": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "contactId": "12345",
  "expectedAmount": 5000
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "timestamp": "2025-01-26T10:05:00Z",
  "processingTime": 2345,
  "partial": false,
  "verified": true,
  "data": {
    "amount": 5000,
    "currency": "ARS",
    "date": "2025-01-26",
    "time": "10:00:00",
    "sender": {
      "name": "Juan Pérez",
      "cuit": "20-12345678-9",
      "platform": "Mercado Pago",
      "cvu": "0000003100012345678901"
    },
    "receiver": {
      "name": "Mi Empresa SRL",
      "cvu": "0000003100098765432109",
      "bank": "Banco Galicia"
    },
    "operationNumber": "123456789",
    "transactionType": "Transferencia",
    "platform": "Mercado Pago",
    "status": "Aprobada",
    "confidence": 95
  }
}
\`\`\`

## 🚀 Uso

### Instalación

\`\`\`bash
npm install
\`\`\`

### Variables de Entorno

El proyecto usa el Vercel AI Gateway por defecto, que maneja automáticamente las claves API. No necesitas configurar variables de entorno adicionales.

### Desarrollo

\`\`\`bash
npm run dev
\`\`\`

### Producción

\`\`\`bash
npm run build
npm start
\`\`\`

## 📝 Tipos TypeScript

Todos los tipos están definidos en `types/agents.ts`:

- `SalesAgentRequest` / `SalesAgentResponse`
- `ClientAgentRequest` / `ClientAgentResponse`
- `PaymentAgentRequest` / `PaymentAgentResponse`

## 🔧 Personalización

### Agregar Nuevas Reglas de Negocio

Modifica el array `rules` en el request del Sales Agent:

\`\`\`typescript
{
  rules: [
    { priority: 1, rule: "Regla de máxima prioridad" },
    { priority: 2, rule: "Regla de prioridad media" },
    { priority: 10, rule: "Regla de menor prioridad" }
  ]
}
\`\`\`

### Cambiar Modelos

Edita los archivos en `lib/agents/`:

\`\`\`typescript
// Para cambiar el modelo
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5', // Cambiar aquí
  // ...
})
\`\`\`

## 📊 Logs y Debugging

Todos los agentes incluyen logs detallados con el prefijo `[v0]`:

- `🤖` Inicio de procesamiento
- `✅` Procesamiento exitoso
- `❌` Error en procesamiento
- `📨` Request recibido

## 🛡️ Manejo de Errores

Todos los endpoints incluyen:
- Validación de campos requeridos
- Manejo de errores con fallbacks
- Respuestas estructuradas con códigos HTTP apropiados
- Logs detallados para debugging

## 📄 Licencia

MIT
# agents
