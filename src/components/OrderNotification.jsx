import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Dummy data for notifications
const dummyNotifications = [
  {
    id: 1,
    orderId: "ORD-1001",
    customerName: "John Doe",
    itemsCount: 3,
    createdAt: new Date(),
    read: false,
  },
  {
    id: 2,
    orderId: "ORD-1002",
    customerName: "Jane Smith",
    itemsCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: 3,
    orderId: "ORD-1003",
    customerName: "Mike Johnson",
    itemsCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
  },
];

const OrderNotification = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [unreadCount, setUnreadCount] = useState(2);
  const [isOpen, setIsOpen] = useState(false);

  // Simulate new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        orderId: `ORD-${1000 + Math.floor(Math.random() * 1000)}`,
        customerName: ["Alice", "Bob", "Charlie", "David", "Eve"][
          Math.floor(Math.random() * 5)
        ],
        itemsCount: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(),
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-primary/10"
        >
          <Bell className="h-5 w-5 text-primary" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-background border border-border rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="font-semibold text-primary">Order Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 border-b border-border last:border-b-0 ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary">
                          New Order #{notification.orderId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(
                            new Date(notification.createdAt),
                            "MMM d, h:mm a"
                          )}
                        </p>
                        <p className="text-xs mt-1 text-muted-foreground">
                          {notification.customerName} placed an order for{" "}
                          {notification.itemsCount} items
                        </p>
                      </div>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-primary/10"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <X className="h-4 w-4 text-primary" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderNotification;
