"use client"; // Indica que este código é executado no cliente

import React, { useState } from "react"; // Importa React e o hook useState
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"; // Importa componentes de cartão personalizados
import { ScrollArea } from "@radix-ui/react-scroll-area"; // Importa componente de área de rolagem
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"; // Importa componentes de avatar
import { TypeAnimation } from "react-type-animation"; // Importa componente de animação de texto

const Ia = () => {
  // Estado para armazenar o valor do input
  const [inputValue, setInputValue] = useState("");
  // Estado para armazenar o resultado do chat
  const [chatResult, setChatResult] = useState("");
  // Estado para controlar o estado de carregamento
  const [isLoading, setIsLoading] = useState(false);
  // Estado para armazenar resultados anteriores do chat
  const [prevResult, setPrevResult] = useState<string[]>([]);
  // Estado para armazenar a resposta da API
  const [apiData, setApiData] = useState<any>(null);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setChatResult("");
  
    try {
      const response = await fetch("http://127.0.0.1:7860/api/v1/run/8927368b-bfb6-4fc1-8431-8e10e9df368d?stream=true", {
        method: "POST",
        headers: {
          "Authorization": "Bearer <TOKEN>",
          "x-api-key": "sk-KykJlYkuyTbE8uBllk6sk5NStElyVvRPgbsZV_qPN_s",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          output_type: "chat",
          input_type: "chat",
          tweaks: {
            "ChatInput-C95xY": {
              input_value: inputValue, // Aqui entra o valor digitado no input
              sender: "User",
              sender_name: "User",
              should_store_message: true,
            },
            "ChatOutput-sG4tO": {
              clean_data: true,
              data_template: "{text}",
              should_store_message: true,
            },
            "GroqModel-l81mn": {
              api_key: "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",
              base_url: "https://api.groq.com",
              model_name: "gemma2-9b-it",
              temperature: 0.1,
              stream: true, // Se quiser stream, deve mudar a lógica abaixo
            },
          },
        }),
      });
        if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Erro: A resposta não contém um corpo legível (ReadableStream)");
    }

    const decoder = new TextDecoder();
    let accumulatedText = ""; // Texto acumulado da resposta
    let partialLine = ""; // Linha parcial para processamento

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decodifica o chunk atual
        const chunk = decoder.decode(value, { stream: true });
        
        // Acumula o chunk no buffer de linha parcial
        partialLine += chunk;
        
        // Divide o texto por quebras de linha para processar cada evento JSON
        const lines = partialLine.split('\n');
        
        // A última linha pode estar incompleta
        partialLine = lines.pop() || '';
        
        // Processa cada linha completa
        for (const line of lines) {
          if (line.trim() === '') continue; // Ignora linhas vazias
          
          try {
            const event = JSON.parse(line);
            
            // Verifica se é um evento de token
            if (event.event === "token" && event.data && event.data.chunk !== undefined) {
              // Acumula o texto do token
              accumulatedText += event.data.chunk;
              
              // Atualiza a UI em tempo real com o texto acumulado
              setChatResult(accumulatedText);
            }
          } catch (e) {
            console.error("Erro ao processar linha JSON:", line, e);
          }
        }
      }
      
      // Quando terminar a leitura completa do stream, adiciona ao histórico
      if (accumulatedText) {
        setPrevResult(prev => [...prev, accumulatedText]);
      }
      
    } catch (error) {
      console.error("Erro ao processar stream:", error);
    }

  } catch (error) {
    console.error("Erro ao processar stream:", error);
  }

  setInputValue(""); // Limpa o input
  setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-black w-full h-full text-white flex flex-col">
        <div className="pt-4 sm:pt-6">
          <div className="text-white font-bold text-4xl flex justify-center">
            <h1>SOFIA</h1>
          </div>
          <div className="text-white-200 flex justify-center">
            <p>Modelo treinado</p>
          </div>
        </div>
        <div className="mt-2 flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-180px)] overflow-y-auto ">
            <section>
              <Avatar className="flex items-top gap-4">
                <AvatarImage
                  className="rounded-full w-10 h-10 border-4 border-red-300 object-cover"
                  src="https://i.pinimg.com/736x/64/88/0b/64880b9b0fe5b53bbe3f7280d262b33f.jpg"
                ></AvatarImage>
                {/* Componente TypeAnimation para exibir texto animado */}
                <TypeAnimation
                  className="text-2xl"
                  sequence={[
                    "Olá",
                    1000,
                    "Olá! Eu sou a Sofia!",
                    1000,
                    "Como posso te ajudar?",
                    1000,
                    "Digite uma mensagem para começarmos!",
                    1000,
                    "Pode ser qualquer coisa!😊",
                    1000,
                  ]}
                  speed={50}
                  repeat={Infinity}
                />
              </Avatar>
              <Avatar>
              <section className="text-white pt-10 px-10 flex flex-col gap-4">
                                {/* Condicional para renderizar prevResult somente se tiver mais de 2 itens */}
                                {prevResult.length > 1 && prevResult.map((result, index) => (
                                  // Garantir que o último resultado de prevResult não seja igual ao chatResult
                                  result && (index !== prevResult.length - 1 || result !== chatResult) && (
                                    <div key={index} className="flex items-center gap-2">
                                      <AvatarImage
                                        className="rounded-full h-10 w-10 border-4 border-slate-300"
                                        src="https://i.pinimg.com/736x/64/88/0b/64880b9b0fe5b53bbe3f7280d262b33f.jpg"
                                      />
                                      <p>{result}</p>
                                    </div>
                                  )
                                ))}
                    {chatResult && (
                        <div className="flex items-center gap-2 xl:text-2xl">
                          <AvatarImage
                            className="rounded-full h-20 w-20 border-4 border-blue-300"
                            src="https://i.pinimg.com/736x/64/88/0b/64880b9b0fe5b53bbe3f7280d262b33f.jpg"
                          />
                          <p>{chatResult}</p>
                        </div>
                      )}
                  {/* {apiData && (
                    <div className="flex items-center gap-2">
                      <AvatarImage
                        className="rounded-full h-10 w-10 border-4 border-blue-300"
                        src="https://i.pinimg.com/736x/64/88/0b/64880b9b0fe5b53bbe3f7280d262b33f.jpg"
                      ></AvatarImage>
                      {apiData.outputs.map((output: any, index: any) => (
                        <p key={index}>{}</p>
                      ))}
                    </div>
                  )} */}
                </section>
              </Avatar>
            </section>
          </ScrollArea>
        </div>
        <div className="w-full p-2 sm:p-4 pb-safe">
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4">
            <input
              type="text"
              className="h-12 sm:h-20 w-full p-2 border-2 border-gray-300 rounded-lg"
              placeholder="Digite uma mensagem"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              className="px-4"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Gerando" : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Ia; // Exporta o componente Main como padrão
