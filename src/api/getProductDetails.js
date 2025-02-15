import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";

const fetchProductDetails = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data.product;
  } catch (error) {
    console.error("Error fetching Product Details:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch product details"
    );
  }
};

const useProductDetailsQuery = (productId) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductDetails(productId),
    enabled: !!productId,
  });
};

export default useProductDetailsQuery;
