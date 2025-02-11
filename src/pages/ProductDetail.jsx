import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Mock product data (replace with actual data fetching logic)
const product = {
  id: 1,
  name: "Cotton Suit For Women",
  price: 29.99,
  description:
    "Made from 100% organic cotton, this t-shirt is both stylish and sustainable.",
  images: ["/productalt3.jpeg", "/productalt1.jpeg", "/productalt2.jpeg"],
  category: "Tops",
  rating: 4.5,
  reviews: 128,
  sizes: ["XS", "S", "M", "L", "XL"],
  colors: ["White", "Black", "Gray", "Blue"],
};

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Carousel */}
        <div className="relative">
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <motion.img
                      src={img}
                      alt={`${product.name} - view ${index + 1}`}
                      className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex justify-center mt-4 space-x-2">
            {product.images.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt={`${product.name} - thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover rounded-md cursor-pointer"
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <motion.h1
            className="text-4xl font-bold mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {product.name}
          </motion.h1>
          <motion.div
            className="flex items-center mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="secondary" className="mr-2">
              {product.category}
            </Badge>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({product.reviews} reviews)
              </span>
            </div>
          </motion.div>
          <motion.p
            className="text-3xl font-bold text-primary mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ${product.price.toFixed(2)}
          </motion.p>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {product.description}
          </motion.p>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Size</h3>
            <div className="flex space-x-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Color</h3>
            <div className="flex space-x-2">
              {product.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Add to Cart and Wishlist */}
          <div className="flex space-x-4 mb-6">
            <Button className="flex-1">
              <ShoppingCart className="mr-2" size={20} /> Add to Cart
            </Button>
            <Button variant="outline">
              <Heart className="mr-2" size={20} /> Add to Wishlist
            </Button>
          </div>

          {/* Share */}
          <Button variant="ghost">
            <Share2 className="mr-2" size={20} /> Share
          </Button>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <p>{product.description}</p>
        </TabsContent>
        <TabsContent value="specifications" className="mt-4">
          <ul className="list-disc pl-5">
            <li>Material: 100% Organic Cotton</li>
            <li>Care: Machine wash cold, tumble dry low</li>
            <li>Made in: Ethical factory in Portugal</li>
            <li>
              Sustainability: Uses 91% less water than conventional cotton
            </li>
          </ul>
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <p>Customer reviews will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProductDetail;
