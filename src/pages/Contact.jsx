/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import { useSpring, animated } from "react-spring";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Send } from "lucide-react";

const ContactUs = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <animated.div style={fadeIn} className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-primary">Contact Us</h1>
        <p className="text-xl text-secondary-foreground">
          We're here to help with any questions about our products or services.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Your Email" />
                <Textarea placeholder="Your Message" className="h-32" />
                <Button className="w-full">
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div> */}
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                <span>youngdrip001@gmail.com</span>
              </div>
              {/* <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <span>123 Fashion Street, Style City, 12345</span>
              </div> */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p>Monday - Friday: 9am - 6pm</p>
                <p>Saturday: 10am - 4pm</p>
                <p>Sunday: Closed</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </animated.div>
  );
};

export default ContactUs;
