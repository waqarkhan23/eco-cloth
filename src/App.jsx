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

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/product-detail" element={<ProductDetail />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </Router>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
