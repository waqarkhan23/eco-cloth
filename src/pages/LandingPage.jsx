/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/utils/axios";
import { Badge } from "@/components/ui/badge";
const fallbackImages = ["/abanner1.png", "/abanner2.png", "/abanner3.png"];

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bannerImages, setBannerImages] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get("/banners");
        const fetchedBanners = response.data;
        setBannerImages(
          fetchedBanners.length > 0
            ? fetchedBanners.map((banner) => banner.imageUrl)
            : fallbackImages
        );
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBannerImages(fallbackImages);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/get-featured-products");
        setFeaturedProducts(response.data.products);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);
  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }));

  const parallaxEffect = (x, y) => {
    const dampen = 50; // Increase for more subtle movement
    return `translate3d(${x / dampen}px, ${y / dampen}px, 0)`;
  };
  console.log(featuredProducts);
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
    className="absolute inset-0 w-full aspect-[16/9] max-h-[1080px] max-w-[1920px] mx-auto"
    initial={{ opacity: 0, scale: 1.1 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 1.5 }}
  >
    <animated.img
      src={bannerImages[currentImageIndex]}
      alt="Background"
      className="w-full h-full object-fill"
      style={{ 
        transform: xy.to(parallaxEffect),
        backgroundColor: 'black' // Adds black background for any potential gaps
      }}
    />
  </motion.div>
</AnimatePresence>

      {/* Overlay with gradient */}
      <div className="absolute inset-0 w-full aspect-[16/9] max-h-[1080px] max-w-[1920px] mx-auto bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 text-center bg-clip-text"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Young Drip
        </motion.h1>
        <motion.p
          className="text-xl md:text-3xl mb-8 text-center max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Wear Your Vibe
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
          {isLoading ? (
            <p className="text-center">Loading featured products...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center">
              No featured products available at the moment.
            </p>
          ) : (
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {featuredProducts.map((product) => (
                  <CarouselItem
                    key={product._id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Card className="overflow-hidden group relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        <div className="relative h-80 overflow-hidden">
                          <motion.img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <CardContent className="p-5 bg-white/90 backdrop-blur-sm absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-lg font-semibold mb-2 text-primary">
                            {product.name}
                          </h3>
                          <p className="text-xl font-bold text-black mb-2">
                            PKR {product.price}
                          </p>
                          <Button
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            onClick={() =>
                              navigate(`/product-detail/${product._id}`)
                            }
                          >
                            View Details
                          </Button>
                        </CardContent>
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-primary text-white px-2 py-1 text-xs font-semibold">
                            Featured
                          </Badge>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </section>

      {/* Featured Collections with hover effects */}
      {/* <section className="relative py-24 bg-secondary">
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
      </section> */}
    </div>
  );
};

export default LandingPage;
