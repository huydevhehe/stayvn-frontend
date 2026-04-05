import axiosClient from "./axiosClient";
import { CreateHotelRequest, Hotel, UpdateHotelRequest } from "../types/admin";

const hotelService = {
  getHotels: async (): Promise<Hotel[]> => {
    const response = await axiosClient.get("/hotels");
    return response.data;
  },
  getHotelById: async (id: number): Promise<Hotel> => {
    const response = await axiosClient.get(`/hotels/${id}`);
    return response.data;
  },
  createHotel: async (request: CreateHotelRequest): Promise<Hotel> => {
    const response = await axiosClient.post("/hotels", request);
    return response.data;
  },
  updateHotel: async (id: number, request: UpdateHotelRequest): Promise<Hotel> => {
    const response = await axiosClient.put(`/hotels/${id}`, request);
    return response.data;
  },
  uploadHotelImage: async (hotelId: number, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("image", file);
    await axiosClient.post(`/hotels/${hotelId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteHotelImage: async (imageId: number): Promise<void> => {
    await axiosClient.delete(`/hotel-images/${imageId}`);
  },

  deleteHotel: async (id: number): Promise<void> => {
    await axiosClient.delete(`/hotels/${id}`);
  },

  getSimilarHotels: async (hotelId: number): Promise<any[]> => {
    const response = await axiosClient.get(`/hotels/${hotelId}/similar`);
    return response.data;
  },

  searchHotels: async (
    keyword: string,
    maxPrice: number,
    stars: number[],
    minRating: number,
    amenityIds: number[]
  ): Promise<any[]> => {
    const params: any = {};

    if (keyword) params.keyword = keyword;
    if (maxPrice) params.maxPrice = maxPrice;

    if (stars && stars.length > 0) {
      params.stars = stars.join(",");
    }

    if (minRating !== undefined) {
      params.minRating = minRating;
    }

    if (amenityIds && amenityIds.length > 0) {
      params.amenityIds = amenityIds.join(",");
    }

    const response = await axiosClient.get("/hotels/search", { params });

    return response.data;
  }
};

export default hotelService;
