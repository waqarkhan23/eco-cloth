/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
const images = ["/abanner1.png", "/abanner2.png", "/abanner3.png"];
// Add this array of sample products
const sampleProducts = [
  {
    id: 1,
    name: "Eco-Friendly T-Shirt",
    price: "$29.99",
    image: "/product1.jpeg",
  },
  {
    id: 2,
    name: "Recycled Denim Jeans",
    price: "$59.99",
    image: "/product2.jpeg",
  },
  {
    id: 3,
    name: "Organic Cotton Dress",
    price: "$79.99",
    image: "/product3.jpeg",
  },
  {
    id: 4,
    name: "Sustainable Sneakers",
    price: "$89.99",
    image: "/product4.jpeg",
  },
];
const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }));

  const parallaxEffect = (x, y) => {
    const dampen = 50; // Increase for more subtle movement
    return `translate3d(${x / dampen}px, ${y / dampen}px, 0)`;
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      onMouseMove={({ clientX: x, clientY: y }) =>
        set({ xy: [x - window.innerWidth / 2, y - window.innerHeight / 2] })
      }
    >
      {/* Full-screen image slider with 3D effect */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5 }}
        >
          <animated.img
            src={images[currentImageIndex]}
            alt="Background"
            className="w-full h-full object-cover"
            style={{ transform: xy.to(parallaxEffect) }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Stylelista
        </motion.h1>
        <motion.p
          className="text-xl md:text-3xl mb-8 text-center max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Sustainable fashion for a stylish future
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/shop">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
            >
              Explore Collection
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>

      <section className="relative py-24 bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-primary">
            Featured Products
          </h2>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {sampleProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-center p-6">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover mb-4 rounded-md"
                        />
                        <h3 className="font-semibold text-lg mb-2">
                          {product.name}
                        </h3>
                        <p className="text-primary">{product.price}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Featured Collections with hover effects */}
      <section className="relative py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-secondary-foreground">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Summer Breeze", "Eco Essentials", "Urban Chic"].map(
              (collection, index) => (
                <motion.div
                  key={collection}
                  className="bg-card p-6 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                    {collection}
                  </h3>
                  <p className="text-card-foreground/80">
                    Discover our latest sustainable styles.
                  </p>
                  <motion.div
                    className="mt-4 bg-primary text-white px-4 py-2 rounded inline-block"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Explore
                  </motion.div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
