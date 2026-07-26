"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import AIChat from "./AIChat";

export default function FloatingAIButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AIChat onClose={() => setOpen(false)} />}

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        <Bot size={30} />
      </button>
    </>
  );
}