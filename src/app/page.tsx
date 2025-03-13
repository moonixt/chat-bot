"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Typical from 'react-typical'

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
      <div className="bg-slate-950">
        <h1 className="flex justify-center">Chat-Bot LMM </h1>
        <div className="flex justify-center items-center h-screen">
          <Card className="bg-white  text-black w-[800px] h-[900px]">
            <CardHeader className="flex justify-center items-center">
              <CardTitle className="text-black font-bold text-4xl">CHATBOT 03mini-o gpt</CardTitle>
              <CardDescription>First ChatBot created</CardDescription>
            </CardHeader>
            <CardContent className="pt-10">
              <ScrollArea className="h-[500px] overflow-y-auto">
                <section>
                  <Avatar className="flex items-top gap-4">
                    
                    <AvatarImage className="rounded-full w-10 h-10 " src="https://e7.pngegg.com/pngimages/1001/63/png-clipart-internet-bot-computer-icons-chatbot-sticker-electronics-face-thumbnail.png"></AvatarImage>
                    {/* <h1 className="pb-10 text-3xl text-white">Olá! Eu sou o ChatBot, como posso te ajudar hoje?</h1> */}

                    <Typical className="text-2xl "
                       steps={['Olá', 3000, 'Olá! Eu sou o ChatBot!', 3000]}
                        loop={Infinity}
                        wrapper="p"
                      
                                />

                  </Avatar>
                  <Avatar className="flex items-center">
                  <p className=" text-black  pt-10 px-10 ">
                   <AvatarImage className="rounded-full h-10 w-10" src="https://e7.pngegg.com/pngimages/1001/63/png-clipart-internet-bot-computer-icons-chatbot-sticker-electronics-face-thumbnail.png">
                      
                   </AvatarImage>

                  
                    {chatResult}
                    </p>
                    </Avatar>
                  </section>  
              </ScrollArea>
            </CardContent>
            <CardFooter className="mt-auto">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="w-[650px] h-10 p-2 border-2 border-gray-300 rounded-lg"
                  placeholder="Digite uma mensagem"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  className="bg-black hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
