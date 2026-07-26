"use client";

import { useState } from "react";
import { X, Bot, Send } from "lucide-react";
import { sendMessageToAI } from "@/lib/api/ai";

interface Props {
  onClose: () => void;
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function AIChat({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Hello! I'm Learnify AI. Ask me anything about your lessons.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await sendMessageToAI(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: response.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50">

      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="text-violet-600" size={22} />
          <h2 className="font-bold">Learnify AI</h2>
        </div>

        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] p-3 rounded-xl ${
              message.sender === "user"
                ? "ml-auto bg-violet-600 text-white"
                : "bg-slate-100 text-black"
            }`}
          >
            {message.text}
          </div>
        ))}

        {loading && (
          <div className="bg-slate-100 p-3 rounded-xl w-fit">
            Thinking...
          </div>
        )}

      </div>

      <div className="border-t p-4 flex gap-2">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Ask Learnify AI..."
          className="flex-1 border rounded-xl px-4 py-2 outline-none"
        />

        <button
          onClick={handleSend}
          className="bg-violet-600 text-white rounded-xl px-4"
        >
          <Send size={18} />
        </button>

      </div>

    </div>
  );
}