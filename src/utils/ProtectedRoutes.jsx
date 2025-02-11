/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import HRLayout from "@/layouts/HRLayout";
import EmployeeLayout from "@/layouts/EmployeeLayout";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Choose the appropriate layout based on the user's role
  const Layout = user.role === "hr" ? HRLayout : EmployeeLayout;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;
