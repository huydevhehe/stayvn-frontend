import { useState } from "react";
import { searchAI } from "@/api/search";

export const useSearchAI = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const handleSearch = async (query: string) => {
    if (!query) return;

    setLoading(true);
    try {
      const res = await searchAI(query);

      setData(res.data.data);
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { handleSearch, data, message, loading };
};