import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";

const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data.products;
  } catch (error) {
    console.error("Error fetching Products:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

const useProductsQuery = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export default useProductsQuery;
