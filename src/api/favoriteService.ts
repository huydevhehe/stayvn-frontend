import axiosClient from "./axiosClient";
import { Hotel } from "../types/admin";

const favoriteService = {
  addFavorite: async (hotelId: number): Promise<void> => {
    await axiosClient.post(`/api/favorites/${hotelId}`);
  },

  removeFavorite: async (hotelId: number): Promise<void> => {
    await axiosClient.delete(`/api/favorites/${hotelId}`);
  },

  getFavoriteHotels: async (): Promise<Hotel[]> => {
    const response = await axiosClient.get("/api/favorites");
    return response.data;
  },

  isFavorite: async (hotelId: number): Promise<boolean> => {
    try {
      const response = await axiosClient.get(`/api/favorites/${hotelId}/status`);
      return response.data;
    } catch (error) {
      return false;
    }
  },

  toggleFavorite: async (hotelId: number, currentStatus: boolean): Promise<boolean> => {
    if (currentStatus) {
      await favoriteService.removeFavorite(hotelId);
      return false;
    } else {
      await favoriteService.addFavorite(hotelId);
      return true;
    }
  }
};

export default favoriteService;
