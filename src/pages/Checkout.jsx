/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrder } from "@/api/createOrder";
import { useNavigate } from "react-router-dom";
import { clearCart } from "@/store/cartSlice";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: createOrder } = useCreateOrder();
  const [orderData, setOrderData] = useState({
    customerInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    shippingAddress: {
      address: "",
      city: "",
      province: "",
      postalCode: "",
    },
    paymentMethod: "Cash on Delivery",
    orderItems: [],
    totalAmount: 0,
  });

  const handleInputChange = (section, field, value) => {
    setOrderData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const orderItems = cartItems.map((item) => ({
      product: item.id,
      size: item.size,
    }));
    setOrderData((prevData) => ({
      ...prevData,
      totalAmount: total,
      orderItems: orderItems,
    }));
  }, [cartItems]);

  // ... existing handleInputChange function

  const handleSubmit = async (e) => {
    e.preventDefault();
    createOrder(orderData, {
      onSuccess: () => {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          dispatch(clearCart());
          navigate("/");
        }, 5000);
      },
      onError: (error) => {
        console.error("Failed to create order:", error);
      },
    });
  };

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

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-primary"
        variants={itemVariants}
      >
        Checkout
      </motion.h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Please enter your personal details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={orderData.customerInfo.firstName}
                      onChange={(e) =>
                        handleInputChange(
                          "customerInfo",
                          "firstName",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={orderData.customerInfo.lastName}
                      onChange={(e) =>
                        handleInputChange(
                          "customerInfo",
                          "lastName",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={orderData.customerInfo.email}
                    onChange={(e) =>
                      handleInputChange("customerInfo", "email", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={orderData.customerInfo.phoneNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "customerInfo",
                        "phoneNumber",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>
                  Please enter your shipping details.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={orderData.shippingAddress.address}
                    onChange={(e) =>
                      handleInputChange(
                        "shippingAddress",
                        "address",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={orderData.shippingAddress.city}
                      onChange={(e) =>
                        handleInputChange(
                          "shippingAddress",
                          "city",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      value={orderData.shippingAddress.province}
                      onChange={(e) =>
                        handleInputChange(
                          "shippingAddress",
                          "province",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={orderData.shippingAddress.postalCode}
                    onChange={(e) =>
                      handleInputChange(
                        "shippingAddress",
                        "postalCode",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div className="mt-8 max-w-2xl" variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose your payment option.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue="Cash on Delivery"
                onValueChange={(value) =>
                  handleInputChange("paymentMethod", "", value)
                }
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Cash on Delivery" id="cod" />
                  <Label htmlFor="cod" className="flex items-center">
                    <Truck className="mr-2" /> Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full text-white">
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </form>

      <motion.div className="mt-8" variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>PKR {formatPrice(item.price)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {formatPrice(orderData.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>PKR 150</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>PKR {formatPrice(orderData.totalAmount + 150)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-lg shadow-lg text-center"
          >
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Order Placed Successfully!
            </h2>
            <p className="mb-4">Your order will be delivered in 5-7 days.</p>
            <p className="font-bold mb-4">
              Total Amount: PKR {formatPrice(orderData.totalAmount + 150)}
            </p>
            <p>Redirecting to home page...</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Checkout;
