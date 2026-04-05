import axiosClient from "./axiosClient";
import { RoomKey } from "../types/admin";

const roomKeyService = {
  generateKey: async (bookingId: number) => {
    const response = await axiosClient.post<RoomKey>(`/api/room-keys/generate/${bookingId}`);
    return response.data;
  },
  
  getMyActiveKey: async (userId: number) => {
    const response = await axiosClient.get<RoomKey>(`/api/room-keys/my-active`, {
      params: { userId }
    });
    return response.data;
  },
  
  getAllActiveKeys: async () => {
    const response = await axiosClient.get<RoomKey[]>(`/api/room-keys/all-active`);
    return response.data;
  },
  
  revokeKey: async (bookingId: number) => {
    await axiosClient.post(`/api/room-keys/revoke/${bookingId}`);
  }
};

export default roomKeyService;
