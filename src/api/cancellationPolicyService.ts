import axiosClient from "./axiosClient";
import { CancellationPolicy, CreateCancellationPolicyRequest } from "../types/admin";

const cancellationPolicyService = {
  getCancellationPolicy: async (hotelId: number): Promise<CancellationPolicy> => {
    const response = await axiosClient.get(`/hotels/${hotelId}/cancellation-policy`);
    return response.data;
  },
  createOrUpdateCancellationPolicy: async (
    hotelId: number,
    request: CreateCancellationPolicyRequest
  ): Promise<CancellationPolicy> => {
    const response = await axiosClient.post(`/hotels/${hotelId}/cancellation-policy`, request);
    return response.data;
  },
};

export default cancellationPolicyService;
