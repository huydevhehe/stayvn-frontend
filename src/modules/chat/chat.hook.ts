import { useEffect, useState } from "react";
import { sendMessage } from "./chat.api";

// 🔥 type rõ ràng (fix any)
type Message = {
  role: "user" | "ai";
  content: string;
};

export const useChat = () => {
  // 🔥 init từ localStorage (fix lỗi useEffect setState)
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat_history");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  // 🔥 lưu lại mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  // 🔥 typing effect (fix for-loop)
  const typeEffect = async (text: string) => {
    let current = "";

    for (const char of text) {
      current += char;

      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          role: "ai",
          content: current,
        };
        return newMsgs;
      });

      await new Promise((r) => setTimeout(r, 15));
    }
  };

  const send = async (text: string) => {
    if (!text.trim()) return;

    setLoading(true);

    // 🔥 thêm message user + placeholder AI
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "ai", content: "" },
    ]);

    try {
      const res = await sendMessage(text);

      await typeEffect(res.data.reply);
    } catch  {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", content: "Lỗi rồi, thử lại sau." },
      ]);
    }

    setLoading(false);
  };

  return { messages, send, loading };
};