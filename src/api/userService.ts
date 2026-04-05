import axiosClient from "./axiosClient";
import { User } from "../types/auth";

const userService = {
  getAllUsers: async () => {
    const response = await axiosClient.get<User[]>("/users");
    return response.data;
  },
  
  updateLoyaltyStatus: async (userId: number, isLoyalty: boolean) => {
    const response = await axiosClient.put<User>(`/users/${userId}/loyalty`, null, {
      params: { isLoyalty }
    });
    return response.data;
  },

  updateProfile: async (userId: number, data: any) => {
    const response = await axiosClient.put<User>(`/users/${userId}`, data);
    return response.data;
  },

  updateAvatar: async (userId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosClient.post<User>(`/users/${userId}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  changePassword: async (userId: number, data: any) => {
    const response = await axiosClient.post(`/users/${userId}/change-password`, data);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await axiosClient.delete(`/users/${userId}`);
    return response.data;
  }
};

export default userService;
