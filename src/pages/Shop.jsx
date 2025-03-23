import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import useProductsQuery from "@/api/getProducts";
import Loader from "@/components/Loader";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: products, isLoading, isError, error } = useProductsQuery();
  const navigate = useNavigate();
  console.log(products);
  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Error loading products: {error.message}</p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }

  const filteredProducts = products
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedCategory === "All" || product.category === selectedCategory)
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-primary">
        Shop Our Collection
      </h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex w-full md:w-1/2 space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <Button onClick={handleSearch} className="text-white">
            Search
          </Button>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All Categories</option>
          <option value="Men">MEN</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
          <option value="Kids">Kids</option>
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <Card className="overflow-hidden">
                <motion.img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-64 object-contain"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/product-detail/${product._id}`)}
                />
                <CardContent
                  className="p-4"
                  onClick={() => navigate(`/product-detail/${product._id}`)}
                >
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  {/* <h5>Tagline line </h5> */}
                  <p className="text-xl font-bold text-primary">
                    PKR {product.price}
                  </p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button
                    className="w-full text-white"
                    onClick={() => navigate(`/product-detail/${product._id}`)}
                  >
                    <ShoppingCart className="mr-2 text-white" size={20} /> Add
                    to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center">No products found.</p>
      )}
    </motion.div>
  );
};

export default Shop;
