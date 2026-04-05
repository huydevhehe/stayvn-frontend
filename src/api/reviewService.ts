import axiosClient from "./axiosClient";
import { Review, UpdateReviewStatusRequest } from "../types/admin";

const reviewService = {
  getReviewsByHotelId: async (hotelId: number): Promise<Review[]> => {
    const response = await axiosClient.get(`/hotels/${hotelId}/reviews`);
    return response.data;
  },
  createReview: async (data: {
    hotelId: number;
    rating: number;
    comment: string;
  }) => {
    const res = await axiosClient.post("/reviews", data);
    return res.data;
  },
  updateReviewStatus: async (reviewId: number, request: UpdateReviewStatusRequest): Promise<Review> => {
    const response = await axiosClient.patch(`/reviews/${reviewId}/status`, request);
    return response.data;
  },
};

export default reviewService;
