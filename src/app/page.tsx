"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const Main = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatResult, setChatResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setChatResult(""); // Reseta o chat antes de iniciar

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputValue }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setChatResult((prev) => prev + decoder.decode(value, { stream: true }));
      }
    }

    setInputValue(""); // Reseta o valor do input após o submit
    setIsLoading(false);
  };

  return (
    <div>
      <div className="bg-gray-100">
        <h1 className="flex justify-center">Chat-Bot</h1>
        <div className="flex justify-center items-center h-screen">
          <Card className="bg-black text-white w-[600px] h-[800px]">
            <CardHeader className="flex justify-center items-center">
              <CardTitle className="text-red-600 font-bold text-4xl">CHATBOT</CardTitle>
              <CardDescription>First ChatBot created</CardDescription>
            </CardHeader>
            <CardContent className="pt-10">
              <ScrollArea className="h-[500px] overflow-y-auto">
                <h1 className="pb-10 text-3xl text-blue-400">Olá! Eu sou o ChatBot, como posso te ajudar hoje?</h1>
                <p className=" text-2xl ">{chatResult}</p>
              </ScrollArea>
            </CardContent>
            <CardFooter className="mt-auto">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="w-[450px] h-10 p-2 border-2 border-gray-300 rounded-lg"
                  placeholder="Digite uma mensagem"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Gerando" : "Enviar"}
                </button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Main;
