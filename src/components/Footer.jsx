import { Link } from "react-router-dom";
import { FaInstagram, FaEnvelope, FaTiktok } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

const Footer = () => {
  return (
    <footer className="bg-background text-text border-t border-accent">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Young Drip</h2>
            <p className="text-muted-foreground">Wear your vibe.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "Shop", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {["FAQ"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-secondary">
              Stay Updated
            </h3>
            <p className="mb-4 text-muted-foreground">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-background border-accent"
              />
              <Button className="w-full text-white">Subscribe</Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 Young Drip. All rights reserved.
          </div>
          <div className="flex space-x-4">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
