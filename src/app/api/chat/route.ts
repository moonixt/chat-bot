import OpenAI from "openai"; // Importa a biblioteca OpenAI
import { NextResponse } from "next/server"; // Importa NextResponse do Next.js
import { config } from "dotenv";
config();


// 1️⃣ Cria um cliente para a API da OpenAI

const client = new OpenAI({
  // baseURL: "https://models.inference.ai.azure.com", // URL base da API da OpenAI
  // apiKey: process.env.OPENAI_API_KEY, // Chave da API da OpenAI
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
  
});

export async function POST(req: Request) {
  try {
    // 1️⃣ Lê o corpo da requisição (o que o usuário digitou)
    const { message } = await req.json();

    // 2️⃣ Faz a requisição para a OpenAI com streaming ativado
    const stream = await client.chat.completions.create({
      // model: "gpt-4o-mini", // Modelo utilizado para a geração de texto
        model: "llama-3.3-70b-versatile", 
      messages: [{ role: "user", content: message }], // Mensagem do usuário
      stream: true, // 🔥 Ativa o modo streaming
    });

    // 3️⃣ Cria um stream de resposta para o frontend
    const encoder = new TextEncoder(); // Converte texto para bytes
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          // 🔄 Para cada parte da resposta recebida da OpenAI...
          const content = chunk.choices[0]?.delta?.content || ""; // Conteúdo da resposta
          controller.enqueue(encoder.encode(content)); // Envia para o frontend
        }
        controller.close(); // Finaliza o stream quando terminar
      },
    });

    // 4️⃣ Retorna o stream para o frontend
    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" }, // Define o tipo de conteúdo como texto
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    ); // Retorna erro em caso de falha
  }
}
