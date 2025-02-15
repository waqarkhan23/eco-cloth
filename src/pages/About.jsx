import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shirt, Truck, ThumbsUp } from "lucide-react";

const About = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <animated.div
      style={fadeIn}
      className="min-h-screen bg-gradient-to-b from-background to-secondary p-8"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-5xl font-bold mb-4 text-primary">About Stylista</h1>
        <p className="text-xl text-secondary-foreground">
          Your one-stop destination for trendy and affordable fashion.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: Shirt,
            title: "Quality Fashion",
            desc: "Curated collections of stylish clothing",
          },
          {
            icon: Truck,
            title: "Fast Delivery",
            desc: "Quick and reliable shipping worldwide",
          },
          {
            icon: ThumbsUp,
            title: "Customer Satisfaction",
            desc: "Easy returns and excellent support",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardContent className="flex flex-col items-center p-6">
                <item.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-center text-secondary-foreground">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Start Shopping Now</h2>
        <p className="mb-8 text-secondary-foreground">
          Discover the latest trends and express your unique style.
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Shop Collection <ArrowRight className="ml-2" />
        </Button>
      </motion.div>
    </animated.div>
  );
};

export default About;
