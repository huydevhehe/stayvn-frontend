import axiosClient from "./axiosClient";
import { Booking, BookingStatusUpdateRequest, CreateBookingRequest } from "../types/admin";

const bookingService = {
  createBooking: async (request: CreateBookingRequest): Promise<Booking> => {
    const response = await axiosClient.post("/api/bookings", request);
    return response.data;
  },

  getUserBookings: async (userId: number): Promise<Booking[]> => {
    const response = await axiosClient.get(`/api/bookings/users/${userId}`);
    return response.data;
  },

  getHotelBookings: async (hotelId: number): Promise<Booking[]> => {
    const response = await axiosClient.get(`/api/bookings/hotels/${hotelId}`);
    return response.data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const response = await axiosClient.get("/api/bookings");
    return response.data;
  },
  getBookedDates: async (roomId: number): Promise<string[]> => {
    const response = await axiosClient.get(`/api/bookings/room/${roomId}/booked-dates`);
    return response.data;
  },
  updateBookingStatus: async (bookingId: number, request: BookingStatusUpdateRequest): Promise<Booking> => {
    const response = await axiosClient.patch(`/api/bookings/${bookingId}/status`, request);
    return response.data;
  },
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await axiosClient.get(`/api/bookings/me`);
    return response.data;
  },
  
  listForResale: async (bookingId: number, message: string): Promise<Booking> => {
    const response = await axiosClient.post(`/api/resales/${bookingId}/list`, { message });
    return response.data;
  },
  
  getResaleBookings: async (): Promise<Booking[]> => {
    const response = await axiosClient.get("/api/resales");
    return response.data;
  },
  
  buyResale: async (bookingId: number): Promise<Booking> => {
    const response = await axiosClient.post(`/api/resales/${bookingId}/buy`);
    return response.data;
  },
};

export default bookingService;
