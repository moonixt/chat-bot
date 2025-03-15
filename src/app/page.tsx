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

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    setIsLoading(true); // Define o estado de carregamento como verdadeiro
    setChatResult(""); // Reseta o resultado do chat antes de iniciar

    // Faz a requisição para a API do chat
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputValue }),
    });

    // Lê a resposta da API como um stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      let result = "";
      while (true) {
        const { done, value } = await reader.read(); // Lê o próximo pedaço de dados do stream
        if (done) break; // Sai do loop se não houver mais dados
        result += decoder.decode(value, { stream: true }); // Decodifica o valor lido e adiciona ao resultado
        setChatResult((prev) => prev + decoder.decode(value, { stream: true })); // Atualiza o estado do resultado do chat
      }
    }
    setPrevResult((prev) => [...prev, chatResult]); // Adiciona o resultado atual aos resultados anteriores
    setInputValue(""); // Reseta o valor do input após o submit
    setIsLoading(false); // Define o estado de carregamento como falso
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
                      {prevResult.map(
                        (result, index) =>
                          result && (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <AvatarImage
                                className="rounded-full h-10 w-10 border-4 border-slate-300"
                                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                              ></AvatarImage>
                              <p>{result}</p>
                            </div>
                          )
                      )}
                      {chatResult && (
                        <div className="flex items-center gap-2">
                          <AvatarImage
                            className="rounded-full h-10 w-10 border-4 border-blue-300"
                            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                          ></AvatarImage>
                          <p>{chatResult}</p>
                        </div>
                      )}
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
