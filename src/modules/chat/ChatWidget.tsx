import { useEffect, useRef, useState } from "react";
import { useChat } from "./chat.hook";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, send, loading } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // 🔥 auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
  const text = input;   // giữ lại nội dung
  setInput("");         // 🔥 clear ngay lập tức
  await send(text);
};

  return (
    <>
      {/* button */}
      <div
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full cursor-pointer shadow-xl"
        onClick={() => setOpen(!open)}
      >
        💬
      </div>

      {open && (
        <div className="fixed bottom-20 right-5 w-[360px] h-[520px] bg-white shadow-2xl rounded-xl flex flex-col border">

          {/* header */}
          <div className="p-3 border-b font-semibold text-blue-600">
            AI Assistant
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] text-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {/* loading */}
            {loading && (
              <div className="text-gray-400 text-sm italic">
                AI đang trả lời...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* input */}
          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 border rounded p-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."

              // 🔥 ENTER gửi
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <button
              className="bg-blue-500 text-white px-3 rounded"
              onClick={handleSend}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
}