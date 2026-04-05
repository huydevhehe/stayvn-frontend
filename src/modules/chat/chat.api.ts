import axios from "../../lib/axios";

export const sendMessage = (message: string) => {
  return axios.post("/chat", { message });
};