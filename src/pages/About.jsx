/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FaEnvelope, FaInstagram, FaTiktok } from "react-icons/fa";

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
        <h1 className="text-5xl font-bold mb-4 text-primary">
          About Young Drip
        </h1>
        <p className="text-xl text-secondary-foreground">
          Welcome to Young Drip - Wear your vibe
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-secondary-foreground">
                Young Drip was founded in 2025 by a group of friends with a
                passion for creating unique and wearable designs. Our journey
                began with a simple goal: to create fashion that would make
                people smile.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-secondary-foreground">
                At Young Drip, we're committed to:
              </p>
              <ul className="list-disc list-inside mt-2 text-secondary-foreground">
                <li>Creating high-quality, comfortable clothes</li>
                <li>Offering affordable and fun fashion</li>
                <li>Building a community of like-minded individuals</li>
                <li>Encouraging self-expression through fashion</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">Our Passion</h2>
        <p className="mb-8 text-secondary-foreground max-w-2xl mx-auto">
          We're passionate about creating high-quality, comfortable clothes
          which include all kinds of tops and bottoms that make you feel
          confident and expressive. Our brand is built on the idea that fashion
          should be accessible, affordable, and fun.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
        <p className="mb-8 text-secondary-foreground">
          Want to learn more about us or stay up-to-date on new designs and
          promotions? Follow us on social media or drop us a line. We'd love to
          hear from you!
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          {/* <Button variant="ghost" size="icon">
                       <FaFacebookF className="w-5 h-5" />
                     </Button> */}
          <a
            href="https://www.tiktok.com/@young.drip996?_t=ZS-8uJhLofKuqg&_r=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <FaTiktok className="w-5 h-5" />
            </Button>
          </a>
          <a
            href="https://www.instagram.com/young_drip.1?igsh=bThsZGFubXY3aTc1&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="icon">
              <FaInstagram className="w-5 h-5" />
            </Button>
          </a>
          <a href="mailto:youngdrip001@gmail.com?subject=Inquiry%20from%20Young%20Drip%20Website&body=Hello%20Young%20Drip%20Team,%0A%0AI%20have%20a%20question%20about...">
            <Button variant="ghost" size="icon">
              <FaEnvelope className="w-5 h-5" />
            </Button>
          </a>
        </div>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Shop Collection <ArrowRight className="ml-2" />
        </Button>
      </motion.div>
    </animated.div>
  );
};

export default About;
