import axiosClient from "./axiosClient";

const monthlyRentalService = {
  getAll: async () => {
    const res = await axiosClient.get(`/api/monthly-rentals`);
    return res.data;
  },

  getById: async (id: number) => {
    const res = await axiosClient.get(`/api/monthly-rentals/${id}`);
    return res.data;
  },

  create: async (data: any) => {
    const res = await axiosClient.post(`/api/monthly-rentals`, data);
    return res.data;
  },

  update: async (id: number, data: any) => {
    const res = await axiosClient.put(`/api/monthly-rentals/${id}`, data);
    return res.data;
  },

  delete: async (id: number) => {
    await axiosClient.delete(`/api/monthly-rentals/${id}`);
  },

  uploadImages: async (id: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });
    const res = await axiosClient.post(`/api/monthly-rentals/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  deleteImage: async (imageId: number) => {
    await axiosClient.delete(`/api/monthly-rentals/images/${imageId}`);
  },

  getImages: async (id: number) => {
    const res = await axiosClient.get(`/api/monthly-rentals/${id}/images`);
    return res.data;
  },
};

export default monthlyRentalService;