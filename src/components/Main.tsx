import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"



const Main = () => {
  return (
    <div>
    <div className=" bg-gray-100">
      <h1 className=" flex justify-center">Chat-Bot</h1>
    <div className="flex justify-center items-center h-screen">
      <Card className="bg-black text-white w-[600px] h-[500px]">
        <CardHeader className="flex justify-center items-center">
                <CardTitle>CHATBOT</CardTitle>
                <CardDescription>First ChatBot created</CardDescription>
        </CardHeader>
        <CardContent className="pt-10 pl-20">
            <p>Olá! Eu sou o ChatBot, como posso te ajudar hoje?</p>
        </CardContent>
        
        <CardFooter className=" mt-auto">
            <form >
                <input type="text" className="w-[450px] h-10 p-2 border-2 border-gray-300 rounded-lg" placeholder="Digite uma mensagem" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar</button>
            </form>
        </CardFooter>
      </Card>
      </div>
    </div>
    </div>
  )
}

export default Main
