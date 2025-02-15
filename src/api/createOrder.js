import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateOrder = () => {
  const mutationFn = async (orderData) => {
    try {
      const response = await api.post("/create-order", orderData);
      toast.success("Order created successfully!");
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create order"
      );
    }
  };

  return useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      toast.success("Order created successfully!");
    },
    onError: (error) => toast.error(`Failed to create order: ${error.message}`),
  });
};
