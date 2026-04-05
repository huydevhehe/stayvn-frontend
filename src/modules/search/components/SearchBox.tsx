import { useState } from "react";
import { useSearchAI } from "../hooks/useSearchAI";
import HotelCard from "@/components/HotelCard";
import { Loader2, Sparkles } from "lucide-react";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const { handleSearch, data, message, loading } = useSearchAI();

  return (
    <div className="p-0 space-y-4">
      {/* Input */}
      <div className="flex gap-2 bg-slate-100 p-2 rounded-xl border focus-within:border-primary/50 transition-colors">
        <input
          className="bg-transparent outline-none flex-1 px-2 text-sm"
          placeholder="Hỏi AI: Đà Nẵng có khách sạn nào đẹp..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
        />

        <button
          className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          onClick={() => handleSearch(query)}
          disabled={loading}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
        </button>
      </div>

      {/* Message AI */}
      {(message || loading) && (
        <div className="bg-slate-50 border rounded-xl p-3 text-sm text-slate-600 italic animate-in fade-in slide-in-from-top-1">
          {loading ? "Đang truy vấn trí tuệ nhân tạo..." : `🤖 ${message}`}
        </div>
      )}

      {/* Result */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto p-1 custom-scrollbar">
          {data.map((hotel) => (
            <div key={hotel.id} className="scale-95 origin-top hover:scale-100 transition-transform">
                <HotelCard hotel={hotel} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;