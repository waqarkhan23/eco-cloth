import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Mock product data (replace with actual data fetching logic)
const products = [
  {
    id: 1,
    name: "Eco-Friendly T-Shirt",
    price: 29.99,
    image: "/product1.jpeg",
    category: "Tops",
  },
  {
    id: 2,
    name: "Recycled Denim Jeans",
    price: 79.99,
    image: "/product5.jpeg",
    category: "Bottoms",
  },
  {
    id: 3,
    name: "Organic Cotton Dress",
    price: 89.99,
    image: "/product4.jpeg",
    category: "Dresses",
  },
  {
    id: 4,
    name: "Sustainable Sneakers",
    price: 99.99,
    image: "/product3.jpeg",
    category: "Shoes",
  },
  {
    id: 5,
    name: "Bamboo Fiber Socks",
    price: 12.99,
    image: "/product2.jpeg",
    category: "Accessories",
  },
  {
    id: 6,
    name: "Hemp Backpack",
    price: 59.99,
    image: "/product1.jpeg",
    category: "Accessories",
  },
  // Add more products as needed
];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || product.category === selectedCategory)
  );

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
        <div className="relative w-full md:w-1/3">
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
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="All">All Categories</option>
          <option value="Tops">Tops</option>
          <option value="Bottoms">Bottoms</option>
          <option value="Dresses">Dresses</option>
          <option value="Shoes">Shoes</option>
          <option value="Accessories">Accessories</option>
        </select>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="mr-2" size={20} /> Filter
        </Button>
      </div>

      {/* Product Grid */}
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
            <Card
              className="overflow-hidden"
              onClick={() => navigate("/product-detail")}
            >
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <p className="text-xl font-bold text-primary">
                  PKR {product.price.toFixed(2)}
                </p>
              </CardContent>
              <CardFooter className="p-4">
                <Button className="w-full">
                  <ShoppingCart className="mr-2" size={20} /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Shop;
