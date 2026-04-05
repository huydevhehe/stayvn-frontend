import axiosClient from "./axiosClient";

const monthlyBookingService = {
  book: async (userId: number, rentalId: number, startDate: string, months: number) => {
    const res = await axiosClient.post(`/api/monthly-bookings`, null, {
      params: { userId, rentalId, startDate, months }
    });
    return res.data;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await axiosClient.patch(`/api/monthly-bookings/${id}/status`, null, {
      params: { status }
    });
    return res.data;
  },

  getByUser: async (userId: number) => {
    const res = await axiosClient.get(`/api/monthly-bookings/user/${userId}`);
    return res.data;
  },

  getAll: async () => {
    const res = await axiosClient.get(`/api/monthly-bookings`);
    return res.data;
  },

  getById: async (id: number) => {
    const res = await axiosClient.get(`/api/monthly-bookings/${id}`);
    return res.data;
  },
};

export default monthlyBookingService;
