import { useState } from "react";
import { Link, Outlet, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChartBar, FaBox, FaSignOutAlt } from "react-icons/fa";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // TODO: Implement actual authentication check
  const isAuthenticated = true; // This should be replaced with your actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const sidebarItems = [
    { icon: FaChartBar, text: "Dashboard", path: "/admin" },
    { icon: FaBox, text: "Products", path: "/admin/products" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: isSidebarOpen ? 240 : 80 }}
        animate={{ width: isSidebarOpen ? 240 : 80 }}
        className="bg-primary text-primary-foreground p-4 flex flex-col"
      >
        <div className="flex items-center justify-between mb-8">
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
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center p-2 hover:bg-primary-foreground/10 rounded"
                >
                  <item.icon className="w-6 h-6 mr-2" />
                  {isSidebarOpen && <span>{item.text}</span>}
                </Link>
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
      <main className="flex-grow p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
