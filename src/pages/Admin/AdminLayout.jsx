import { useState } from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChartBar,
  FaBox,
  FaSignOutAlt,
  FaPlus,
  FaList,
  FaChevronDown,
  FaShoppingCart,
  FaClipboardList,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrderNotification from "@/components/OrderNotification";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // TODO: Implement actual authentication check
  const isAuthenticated = true; // This should be replaced with your actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const sidebarItems = [
    { icon: FaChartBar, text: "Dashboard", path: "/admin" },
    {
      icon: FaBox,
      text: "Products",
      children: [
        { icon: FaPlus, text: "Add Product", path: "/admin/products/add" },
        { icon: FaList, text: "Product List", path: "/admin/products" },
      ],
    },
    {
      icon: FaShoppingCart,
      text: "Orders",
      children: [
        { icon: FaClipboardList, text: "All Orders", path: "/admin/orders" },
        // { icon: FaList, text: "Manage Orders", path: "/admin/orders/manage" },
      ],
    },
    { icon: FaQuestionCircle, text: "Q&A Management", path: "/admin/qa" },
    { icon: FaChartBar, text: "Banners", path: "/admin/banner" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: isSidebarOpen ? 240 : 80 }}
        animate={{ width: isSidebarOpen ? 240 : 80 }}
        className="bg-primary text-primary-foreground p-4 flex flex-col"
      >
        <div className="flex items-center justify-between mb-8 text-white">
          <h1 className={`text-xl font-bold ${isSidebarOpen ? "" : "hidden"}`}>
            Admin Panel
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-2xl"
          >
            {isSidebarOpen ? "←" : "→"}
          </button>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index} className="text-white">
                {item.children ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center text-white w-full p-2 rounded">
                      <item.icon className="w-6 h-6 mr-2" />
                      {isSidebarOpen && (
                        <>
                          <span className="flex-grow text-left text-white">
                            {item.text}
                          </span>
                          <FaChevronDown className="w-4 h-4 text-white" />
                        </>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {item.children.map((child, childIndex) => (
                        <DropdownMenuItem key={childIndex} asChild>
                          <Link
                            to={child.path}
                            className="flex items-center p-2 hover:bg-primary-foreground/10 rounded"
                          >
                            <child.icon className="w-4 h-4 mr-2" />
                            <span>{child.text}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center p-2 hover:bg-primary-foreground/10 rounded"
                  >
                    <item.icon className="w-6 h-6 mr-2" />
                    {isSidebarOpen && <span>{item.text}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <button className="flex items-center p-2 hover:bg-primary-foreground/10 rounded mt-auto">
          <FaSignOutAlt className="w-6 h-6 mr-2" />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-primary">
              Admin Dashboard
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <OrderNotification />
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
