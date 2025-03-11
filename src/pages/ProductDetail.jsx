import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
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
import { useParams } from "react-router-dom";
import useProductDetailsQuery from "@/api/getProductDetails";
import Loader from "@/components/Loader";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "@/store/cartSlice";

const sanitizeHTML = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.innerHTML;
};

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const { id } = useParams();

  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }

    try {
      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0].url,
          size: selectedSize,
          color: selectedColor,
        })
      );
      toast.success(`${product.name} has been added to your cart.`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProductDetailsQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }
  const formatPrice = (price) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
              {product.images &&
                product.images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <motion.img
                        src={img.url}
                        alt={`${product.name} - view ${index + 1}`}
                        className="w-full h-[500px] object-contain rounded-lg shadow-lg"
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
            {product.images &&
              product.images.map((img, index) => (
                <motion.img
                  key={index}
                  src={img.url}
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
            <Badge className="mr-2 bg-black text-white">
              {product.category}
            </Badge>
          </motion.div>
          <motion.p
            className="text-3xl font-bold text-primary mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            PKR {formatPrice(product.price)}
          </motion.p>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(product.description),
            }}
          />

          {/* Size Selection */}
          {product.sizes && (
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
          )}

          {/* Color Selection */}
          {product.colors && (
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
          )}

          {/* Add to Cart and Wishlist */}
          <div className="flex space-x-4 mb-6">
            <Button className="flex-1 text-white" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2" size={20} /> Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <p
            className="text-gray-600 mb-6"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(product.description),
            }}
          />
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
        <TabsContent value="policies" className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Product Policies</h3>
          <ul className="list-disc pl-5">
            <li>
              <strong>Return Policy:</strong> 30-day return policy for unworn
              items in original condition with tags attached.
            </li>
            <li>
              <strong>Exchange Policy:</strong> Free size exchanges within 60
              days of purchase.
            </li>
            <li>
              <strong>Shipping Policy:</strong> Free standard shipping on orders
              over PKR 5000. Express shipping available at additional cost.
            </li>
            <li>
              <strong>Warranty:</strong> 1-year warranty against manufacturing
              defects.
            </li>
          </ul>
          <p className="mt-4">
            For more detailed information on our policies, please visit our{" "}
            <a href="/policies" className="text-blue-600 hover:underline">
              Policies Page
            </a>
            .
          </p>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProductDetail;
