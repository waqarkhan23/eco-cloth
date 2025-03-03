import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";

import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import AdminLayout from "./pages/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Products from "./pages/Admin/Products";
import AddProduct from "./pages/Admin/AddProduct";
import AllOrders from "./pages/Admin/AllOrders";
import ManageOrders from "./pages/Admin/ManageOrders";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoutes";
import About from "./pages/About";
import ContactUs from "./pages/Contact";
import FAQ from "./pages/FAQ";
import BannerContent from "./pages/Admin/BannerContent";
const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route
                  path="/"
                  element={
                    <>
                      <Header />
                      <main className="flex-grow">
                        <LandingPage />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <>
                      <Header />
                      <main className="flex-grow">
                        <Shop />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <>
                      <Header />
                      <main className="flex-grow">
                        <About />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <>
                      <Header />
                      <main className="flex-grow">
                        <Cart />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <>
                      <Header />
                      <main className="flex-grow">
                        <ContactUs />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/faq"
                  element={
                    <>
                      <Header />
                      <main className="flex-grow">
                        <FAQ />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <>
                      <Header />
                      <main className="flex-grow">
                        <Checkout />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/product-detail/:id"
                  element={
                    <>
                      <Header />
                      <main className="flex-grow">
                        <ProductDetail />
                      </main>
                      <Footer />
                    </>
                  }
                />
                <Route path="/login" element={<Login />} />

                {/* Admin routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route path="orders" element={<AllOrders />} />
                    <Route path="orders/manage" element={<ManageOrders />} />
                    <Route path="banner" element={<BannerContent />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <Toaster position="top-right" />
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
