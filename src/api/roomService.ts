import axiosClient from "./axiosClient";
import {
  CreateRoomPriceRequest,
  CreateRoomRequest,
  CreateRoomTypeRequest,
  Room,
  RoomPrice,
  RoomType,
  UpdateRoomStatusRequest
} from "../types/admin";

const roomService = {

  getRooms: async (): Promise<Room[]> => {
    const response = await axiosClient.get("/rooms");
    return response.data;
  },
  getRoomTypesByHotelId: async (hotelId: number): Promise<RoomType[]> => {
    const response = await axiosClient.get(`/hotels/${hotelId}/room-types`);
    return response.data;
  },
  createRoomType: async (request: CreateRoomTypeRequest): Promise<RoomType> => {
    const response = await axiosClient.post("/room-types", request);
    return response.data;
  },
  uploadRoomTypeImages: async (roomTypeId: number, files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    await axiosClient.post(`/room-types/${roomTypeId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  createRoom: async (request: CreateRoomRequest): Promise<Room> => {
    const response = await axiosClient.post("/rooms", request);
    return response.data;
  },
  updateRoomStatus: async (roomId: number, request: UpdateRoomStatusRequest): Promise<Room> => {
    const response = await axiosClient.patch(`/rooms/${roomId}/status`, request);
    return response.data;
  },
  getPricesByRoomTypeId: async (roomTypeId: number): Promise<RoomPrice[]> => {
    const response = await axiosClient.get(`/room-types/${roomTypeId}/prices`);
    return response.data;
  },
  createRoomPrice: async (request: CreateRoomPriceRequest): Promise<RoomPrice> => {
    const response = await axiosClient.post("/room-prices", request);
    return response.data;
  },
  updateRoomType: async (id: number, request: Partial<CreateRoomTypeRequest>): Promise<RoomType> => {
    const response = await axiosClient.put(`/room-types/${id}`, request);
    return response.data;
  },
  deleteRoomType: async (id: number): Promise<void> => {
    await axiosClient.delete(`/room-types/${id}`);
  },
  deleteRoomTypeImage: async (imageId: number): Promise<void> => {
    await axiosClient.delete(`/room-type-images/${imageId}`);
  },
};

export default roomService;
