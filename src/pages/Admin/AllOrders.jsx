import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Eye, Search, Filter, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";

const statusColors = {
  Processing: "bg-yellow-500",
  Shipped: "bg-blue-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/orders", {
        params: {
          search: searchTerm,
          status: statusFilter !== "All" ? statusFilter : undefined,
          sortBy,
          sortOrder,
        },
      });
      setOrders(response.data.orders || []);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };
  console.log(orders);
  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  const handleRefresh = () => {
    fetchOrders();
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (response.data.success) {
        toast.success("Status updated successfully");
        fetchOrders(); // Refresh the orders list
      } else {
        toast("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast("Failed to update order status");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-1/3">
              <Input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2" size={20} />
                  Sort By
                  <ChevronDown className="ml-2" size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSort("date")}>
                  Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("total")}>
                  Total
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="w-full md:w-auto" onClick={handleRefresh}>
              <RefreshCw className="mr-2" size={20} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {orders.map((order) => (
            <motion.div
              key={order._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{order.orderId}</span>
                    <Badge className={statusColors[order.orderStatus]}>
                      {order.orderStatus}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">{`${order.customerInfo.firstName} ${order.customerInfo.lastName}`}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), "PPP")}
                    </p>
                    <p className="text-lg font-bold">
                      {order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm">{order.orderItems.length} item(s)</p>
                    <div className="flex justify-between items-center mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2" size={16} />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Order Details - {order.orderId}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                Customer Information
                              </h3>
                              <p>
                                <strong>Name:</strong>{" "}
                                {`${order.customerInfo.firstName} ${order.customerInfo.lastName}`}
                              </p>
                              <p>
                                <strong>Email:</strong>{" "}
                                {order.customerInfo.email}
                              </p>
                              <p>
                                <strong>Phone:</strong>{" "}
                                {order.customerInfo.phoneNumber}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                Order Information
                              </h3>
                              <p>
                                <strong>Order ID:</strong> {order.orderId}
                              </p>
                              <p>
                                <strong>Date:</strong>{" "}
                                {format(
                                  new Date(order.createdAt),
                                  "PPP 'at' pp"
                                )}
                              </p>
                              <p>
                                <strong>Total Amount:</strong> $
                                {order.totalAmount.toFixed(2)}
                              </p>
                              <p>
                                <strong>Status:</strong> {order.orderStatus}
                              </p>
                              <p>
                                <strong>Payment Method:</strong>{" "}
                                {order.paymentMethod}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                Shipping Address
                              </h3>
                              <p>{order.shippingAddress.address}</p>
                              <p>
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.province}{" "}
                                {order.shippingAddress.postalCode}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-2">
                                Order Items
                              </h3>
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <th className="text-left">Product</th>
                                    <th className="text-left">Size</th>
                                    <th className="text-left">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.orderItems.map((item, index) => {
                                    console.log("Order Item:", item.product);
                                    return (
                                      <tr key={index}>
                                        <td>{item.product.name}</td>
                                        <td>{item.size}</td>
                                        <td>{item.product.price}</td>
                                      </tr>
                                    );
                                  })}
                                  <tr className="border-t">
                                    <td className="font-semibold">Subtotal</td>
                                    <td></td>
                                    <td>
                                      {order.orderItems
                                        .reduce(
                                          (sum, item) =>
                                            sum + item.product.price,
                                          0
                                        )
                                        .toFixed(2)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="font-semibold">
                                      Shipping Fee
                                    </td>
                                    <td></td>
                                    <td>150.00</td>
                                  </tr>
                                  <tr className="border-t">
                                    <td className="font-semibold">Total</td>
                                    <td></td>
                                    <td className="font-semibold">
                                      {(
                                        order.orderItems.reduce(
                                          (sum, item) =>
                                            sum + item.product.price,
                                          0
                                        ) + 150
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Select
                        value={order.orderStatus}
                        onValueChange={(newStatus) =>
                          handleStatusUpdate(order._id, newStatus)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            <Badge className={statusColors[order.orderStatus]}>
                              {order.orderStatus}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AllOrders;
