/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const images = ["/banner1.jpg", "/banner2.png", "/banner4.jpeg"];

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Full-screen image slider */}
      <AnimatePresence initial={false}>
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome to EcoCloth
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-center max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Discover sustainable fashion that doesn't compromise on style.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/shop">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Shop Now
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Parallax sections */}
      <section className="relative py-24 bg-background">
        <motion.div
          className="container mx-auto px-4"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-primary">
            Our Mission
          </h2>
          <p className="text-lg text-center max-w-3xl mx-auto text-secondary-foreground">
            At EcoCloth, we're committed to creating a more sustainable future
            through eco-friendly fashion. Our garments are crafted with care for
            both you and the planet.
          </p>
        </motion.div>
      </section>

      <section className="relative py-24 bg-secondary">
        <motion.div
          className="container mx-auto px-4"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-secondary-foreground">
            Featured Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Summer Breeze", "Eco Essentials", "Urban Chic"].map(
              (collection, index) => (
                <motion.div
                  key={collection}
                  className="bg-card p-6 rounded-lg shadow-lg"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                    {collection}
                  </h3>
                  <p className="text-card-foreground/80">
                    Discover our latest sustainable styles.
                  </p>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
