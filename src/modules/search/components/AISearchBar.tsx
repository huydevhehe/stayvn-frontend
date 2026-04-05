import { useState } from "react";
import { useSearchAI } from "../hooks/useSearchAI";
import { Search, Loader2, Sparkles } from "lucide-react";
import HotelCard from "@/components/HotelCard";

const AISearchBar = () => {
  const [query, setQuery] = useState("");
  const { handleSearch, data, message, loading } = useSearchAI();

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      {/* input */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex gap-2 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 shadow-2xl">
          <div className="flex items-center pl-3 text-primary">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            placeholder="Tìm bằng AI: Đà Lạt có khách sạn nào gần hồ không..."
            className="flex-1 bg-transparent outline-none px-3 text-base placeholder:text-slate-400"
          />

          <button
            onClick={() => handleSearch(query)}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white px-6 rounded-xl flex items-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* AI message */}
      {(message || loading) && (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                {loading ? <Loader2 size={16} className="animate-spin" /> : "🤖"}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">StayVN AI</p>
                <p className="text-slate-700 font-medium">
                    {loading ? "Mình đang tìm kiếm những lựa chọn tốt nhất cho bạn..." : message}
                </p>
            </div>
        </div>
      )}

      {/* result */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
          {data.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AISearchBar;