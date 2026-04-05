import axiosClient from "./axiosClient";
import { Amenity } from "../types/admin";

const amenityService = {
  getAmenities: async (): Promise<Amenity[]> => {
    const res = await axiosClient.get("/api/amenities");
    return res.data;
  },

  createAmenity: async (name: string): Promise<Amenity> => {
    const res = await axiosClient.post("/api/amenities", { name });
    return res.data;
  },

  updateAmenity: async (id: number, name: string): Promise<Amenity> => {
    const res = await axiosClient.put(`/api/amenities/${id}`, { name });
    return res.data;
  },

  deleteAmenity: async (id: number): Promise<void> => {
    await axiosClient.delete(`/api/amenities/${id}`);
  },
};

export default amenityService;
