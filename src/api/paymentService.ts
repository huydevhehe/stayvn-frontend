import axiosClient from "./axiosClient";
import { Payment, UpdatePaymentStatusRequest } from "../types/admin";

const paymentService = {
  getPaymentsByBookingId: async (bookingId: number): Promise<Payment[]> => {
    const response = await axiosClient.get(`/bookings/${bookingId}/payments`);
    return response.data;
  },
  updatePaymentStatus: async (paymentId: number, request: UpdatePaymentStatusRequest): Promise<Payment> => {
    const response = await axiosClient.patch(`/payments/${paymentId}/status`, request);
    return response.data;
  },
};

export default paymentService;
