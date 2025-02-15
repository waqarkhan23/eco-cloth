import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const deleteProduct = async (id) => {
  const response = await axios.delete(`/api/products/${id}`);
  return response.data;
};

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteProduct, {
    onSuccess: () => {
      // Invalidate and refetch the products query
      queryClient.invalidateQueries("products");
    },
  });
};

export default useDeleteProduct;
