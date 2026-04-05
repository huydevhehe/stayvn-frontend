import { useState } from "react";
import { useChat } from "./chat.hook";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, send, loading } = useChat();

  const handleSend = async () => {
    if (!input) return;
    await send(input);
    setInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[60%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && <div>AI đang trả lời...</div>}
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded"
          onClick={handleSend}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}