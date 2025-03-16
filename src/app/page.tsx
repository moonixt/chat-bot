"use client"; // Indica que este código é executado no cliente

import React, { useState } from "react"; // Importa React e o hook useState
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"; // Importa componentes de cartão personalizados
import { ScrollArea } from "@radix-ui/react-scroll-area"; // Importa componente de área de rolagem
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"; // Importa componentes de avatar
import { TypeAnimation } from "react-type-animation"; // Importa componente de animação de texto

const Main = () => {
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
      const response = await fetch("http://127.0.0.1:7860/api/v1/run/8927368b-bfb6-4fc1-8431-8e10e9df368d?stream=false", {
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
              model_name: "llama-3.3-70b-versatile",
              temperature: 0.1,
              stream: true, // Se quiser stream, deve mudar a lógica abaixo
            },
          },
        }),
      });
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Resposta da API:", data);
      console.log("Outputs recebidos:", data.outputs);


      // Garante que `data.outputs` é um array válido
      if (data.outputs && Array.isArray(data.outputs) && data.outputs.length > 0) {
        const outputText =
        data.outputs?.[0]?.outputs?.[0]?.results?.message?.text 
        setChatResult(outputText);
        setPrevResult((prev) => [...prev, outputText]);
        setApiData(data); // Armazena a resposta da API no estado
      } else {
        console.error("Erro: A API não retornou um output válido.");
        setChatResult("Erro: Nenhuma resposta válida recebida.");
      }
    } catch (error) {
      console.error("Erro ao chamar a API:", error);
      setChatResult("Erro ao processar a resposta.");
    }

    setInputValue(""); // Limpar o input
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-slate-950 h-screen">
      <div>
        <h1 className="flex justify-center text-white">
          Sofia | Made by Derek W.{" "}
        </h1>
        <div className="flex justify-center items-center">
          <Card className="bg-white text-black sm:w-[900px] sm:h-[900px]">
            <CardHeader className="flex justify-center items-center">
              <CardTitle className="text-black font-bold text-4xl">
                SOFIA
              </CardTitle>
              <CardDescription>Modelo de teste V1 (sem memoria e contexto)</CardDescription>
            </CardHeader>
            <CardContent className="pt-10">
              <ScrollArea className="h-[650px] overflow-y-auto">
                <section>
                  <Avatar className="flex items-top gap-4">
                    <AvatarImage
                      className="rounded-full w-10 h-10 border-4 border-red-300"
                      src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
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
                  <section className="text-black pt-10 px-10 flex flex-col gap-4">
                                    {/* Condicional para renderizar prevResult somente se tiver mais de 2 itens */}
                                    {prevResult.length > 1 && prevResult.map((result, index) => (
                                      // Garantir que o último resultado de prevResult não seja igual ao chatResult
                                      result && (index !== prevResult.length - 1 || result !== chatResult) && (
                                        <div key={index} className="flex items-center gap-2">
                                          <AvatarImage
                                            className="rounded-full h-10 w-10 border-4 border-slate-300"
                                            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                                          />
                                          <p>{result}</p>
                                        </div>
                                      )
                                    ))}
                        {chatResult && (
                            <div className="flex items-center gap-2">
                              <AvatarImage
                                className="rounded-full h-10 w-10 border-4 border-blue-300"
                                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                              />
                              <p>{chatResult}</p>
                            </div>
                          )}
                      {/* {apiData && (
                        <div className="flex items-center gap-2">
                          <AvatarImage
                            className="rounded-full h-10 w-10 border-4 border-blue-300"
                            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
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
            </CardContent>
            <CardFooter className="mt-auto">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  className="w-[650px] h-10 p-2 border-2 border-gray-300 rounded-lg"
                  placeholder="Digite uma mensagem"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading} // Desabilita o input enquanto está carregando
                />
                <button
                  className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                  disabled={isLoading} // Desabilita o botão enquanto está carregando
                >
                  {isLoading ? "Gerando" : "Enviar"}{" "}
                  {/*exibe "Gerando" enquanto está carregando e "Enviar" quando não está*/}
                </button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className=" flex justify-center gap-1 text-white">
        <p>All rights reserved</p>
        <a href="https://github.com/moonixt" className="text-pink-600">
          {" "}
          @moonixt
        </a>
      </div>
    </div>
  );
};

export default Main; // Exporta o componente Main como padrão
