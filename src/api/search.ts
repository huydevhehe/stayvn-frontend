import axios from "axios";

export const searchAI = (query: string) => {
  return axios.post("http://localhost:8080/api/search/ai", {
    query,
  });
};