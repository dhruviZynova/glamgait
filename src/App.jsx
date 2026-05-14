import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import "./App.css";
import { LoaderProvider } from "./Context/LoaderContext";
import GlobalLoader from "./Components/GlobalLoader";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import SingleProductPage from "./Pages/SingleProductPage";
import WhatsAppIcon from "./Ui/WhatsappIcon";
import NotFound from "./Components/NotFound";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import AllProductPage from "./Pages/AllProductPage";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Cart from "./Components/Cart";
import Wishlist from "./Components/Wishlist";
import AboutPage from "./Pages/AboutPage";
import Blog from "./Components/Blog";
import SingleBlog from "./Components/SingleBlog";
import Profileorder from "./Components/Profileorder";
import OrderDetails from "./Components/OrderDetails";
import PersonalInfo from "./Components/PersonalInfo";
import SelectAddressPage from "./Components/SelectAddressPage";
import BackToTop from "./Ui/BackToTop";
import Categories from "./Admin/pages/Category";
import Colors from "./Admin/pages/Color";
import Product from "./Admin/pages/Product";
import ProductDetail from "./Admin/pages/ProductDetail";
import ContactUs from "./Admin/pages/Contact";
import Users from "./Admin/pages/Users";
import Orders from "./Admin/pages/Orders";
import InstagramSection from "./Admin/pages/InstagramSection";
import Reviews from "./Admin/pages/Reviews";
import Sliders from "./Admin/pages/Slider";
import Dashboard from "./Admin/pages/Dashboard";
import AdminLayout from "./Admin/AdminLayout";
import SubCategories from "./Admin/pages/SubCategories";
import { Toaster } from "react-hot-toast";
import Fabrics from "./Admin/pages/Fabric";
import Sizes from "./Admin/pages/Size";
import ProductAttributes from "./Admin/pages/ProductAttributes";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import ShippingPolicy from "./Pages/ShippingPolicy";
import RefundPolicy from "./Pages/RefundPolicy";
import TermsofService from "./Pages/TermsofService";
import PaymentOptions from "./Pages/PaymentOptions";
import CancellationPolicy from "./Pages/CancellationPolicy";
import OrderConfirmation from "./Components/OrderConfirmation";
import Announcement from "./Admin/pages/Announcements";
import SmartScrollManager from "./Components/SmartScrollManager";
import SearchResults from "./Components/SearchResults";
import PromotionsManagement from "./Admin/pages/PromotionsManagement";
import Checkout from "./Components/Checkout";
import AdminLogin from "./Admin/pages/AdminLogin";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import VerifyOTP from "./Components/VerifyOTP";

function App() {
  return (
    <LoaderProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 500,
          style: {
            background: "#F3F0ED",
            color: "#1f2937",
            padding: "16px 20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            fontSize: "14px",
            fontWeight: 500,
            maxWidth: "300px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e", // green
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // red
              secondary: "#FFFFFF",
            },
          },
        }}
      />
      <BrowserRouter>
        <GlobalLoader />
        <SmartScrollManager />
        <Routes>
          {/* Client Routes */}
          <Route
            element={
              <>
                <Navbar />
                <Outlet />
                <Footer />
                <WhatsAppIcon />
                <BackToTop />
              </>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:slug" element={<SingleProductPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/collections/:cate_name"
              element={<AllProductPage />}
            />
            <Route
              path="/collections/:cate_name/:filterValue"
              element={<AllProductPage />}
            />
            <Route
              path="/collections/:filterValue"
              element={<AllProductPage />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<SingleBlog />} />
            <Route path="/myorders" element={<Profileorder />} />
            <Route path="/orderdetails/:orderId" element={<OrderDetails />} />
            <Route path="/myinfo" element={<PersonalInfo />} />
            <Route path="/selectaddress" element={<SelectAddressPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsofService />} />
            <Route path="/paymentoptions" element={<PaymentOptions />} />
            <Route path="/search" element={<SearchResults />} />
            <Route
              path="/cancellation-policy"
              element={<CancellationPolicy />}
            />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="announcements" element={<Announcement />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<SubCategories />} />
            <Route path="colors" element={<Colors />} />
            <Route path="product-attributes" element={<ProductAttributes />} />
            <Route path="sizes" element={<Sizes />} />
            <Route path="product" element={<Product />} />
            <Route path="product/:p_id" element={<ProductDetail />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="instagram" element={<InstagramSection />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="sliders" element={<Sliders />} />
            <Route path="offer-coupon" element={<PromotionsManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;
