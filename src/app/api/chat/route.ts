import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ 
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 1️⃣ Lê o corpo da requisição (o que o usuário digitou)
    const { message } = await req.json();

    // 2️⃣ Faz a requisição para a OpenAI com streaming ativado
    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      stream: true, // 🔥 Ativa o modo streaming
    });

    // 3️⃣ Cria um stream de resposta para o frontend
    const encoder = new TextEncoder(); // Converte texto para bytes
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          // 🔄 Para cada parte da resposta recebida da OpenAI...
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content)); // Envia para o frontend
        }
        controller.close(); // Finaliza o stream quando terminar
      },
    });

    // 4️⃣ Retorna o stream para o frontend
    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 });
  }
}
