import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "@/store/store";
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
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
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
              path="/product-detail"
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
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
