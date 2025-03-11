/* eslint-disable react/no-unescaped-entities */
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { removeFromCart } from "@/store/cartSlice"; // Import the removeFromCart action

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price + 150,
    0
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  const formatPrice = (price) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  console.log(cartItems);
  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-4xl font-bold mb-8 text-primary">Your Cart</h1>
      {cartItems.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingCart className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/">
            <Button size="lg" className="text-white">
              <ShoppingBag className="mr-2 text-white" size={20} />
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div className="md:col-span-2" variants={containerVariants}>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                className="flex items-center space-x-4 mb-6 bg-white p-4 rounded-lg shadow-md"
                variants={itemVariants}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">PKR {formatPrice(item.price)}</p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>PKR {formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Shipping Cost</span>
              <span>PKR 150</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>PKR {formatPrice(totalPrice)}</span>
            </div>
            <Link to="/checkout">
              <Button className="w-full text-white">Proceed to Checkout</Button>
            </Link>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
