import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddProduct = () => {
  const mutationFn = async (product) => {
    try {
      const response = await api.post("/add-product", product);
      toast.success("Product added successfully!");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add Product");
    }
  };
  return useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      toast.success("Product added successfully!");
    },
    onError: (error) => toast.error(`Failed to add Product: ${error.message}`),
  });
};
