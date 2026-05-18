import React, { lazy, Suspense } from "react";
import { Routes, Route, BrowserRouter, Outlet } from "react-router-dom";
import "./App.css";
import { LoaderProvider } from "./Context/LoaderContext";
import { CartProvider } from "./Context/CartContext";
import { UserProvider } from "./Context/UserContext";
import GlobalLoader from "./Components/GlobalLoader";
import Navbar from "./Components/Navbar";
import { Toaster } from "react-hot-toast";
import BackToTop from "./Ui/BackToTop";
import WhatsAppIcon from "./Ui/WhatsappIcon";
import Footer from "./Components/Footer";
import SmartScrollManager from "./Components/SmartScrollManager";

// --- Lazy Loaded Components ---
// Client Pages
const HomePage = lazy(() => import("./Pages/HomePage"));
const SingleProductPage = lazy(() => import("./Pages/SingleProductPage"));
const AllProductPage = lazy(() => import("./Pages/AllProductPage"));
const AboutPage = lazy(() => import("./Pages/AboutPage"));
const SearchResults = lazy(() => import("./Components/SearchResults"));
const Contact = lazy(() => import("./Components/Contact"));

// Auth & Profile
const Login = lazy(() => import("./Components/Login"));
const Register = lazy(() => import("./Components/Register"));
const ForgotPassword = lazy(() => import("./Components/ForgotPassword"));
const ResetPassword = lazy(() => import("./Components/ResetPassword"));
const VerifyOTP = lazy(() => import("./Components/VerifyOTP"));
const PersonalInfo = lazy(() => import("./Components/PersonalInfo"));
const Profileorder = lazy(() => import("./Components/Profileorder"));
const OrderDetails = lazy(() => import("./Components/OrderDetails"));

// Cart & Checkout
const Cart = lazy(() => import("./Components/Cart"));
const Checkout = lazy(() => import("./Components/Checkout"));
const Wishlist = lazy(() => import("./Components/Wishlist"));
const SelectAddressPage = lazy(() => import("./Components/SelectAddressPage"));
const OrderConfirmation = lazy(() => import("./Components/OrderConfirmation"));

// Policies
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const ShippingPolicy = lazy(() => import("./Pages/ShippingPolicy"));
const RefundPolicy = lazy(() => import("./Pages/RefundPolicy"));
const TermsofService = lazy(() => import("./Pages/TermsofService"));
const PaymentOptions = lazy(() => import("./Pages/PaymentOptions"));
const CancellationPolicy = lazy(() => import("./Pages/CancellationPolicy"));

// Blog
const Blog = lazy(() => import("./Components/Blog"));
const SingleBlog = lazy(() => import("./Components/SingleBlog"));

// Admin Components
const AdminLayout = lazy(() => import("./Admin/AdminLayout"));
const AdminLogin = lazy(() => import("./Admin/pages/AdminLogin"));
const Dashboard = lazy(() => import("./Admin/pages/Dashboard"));
const Categories = lazy(() => import("./Admin/pages/Category"));
const SubCategories = lazy(() => import("./Admin/pages/SubCategories"));
const Colors = lazy(() => import("./Admin/pages/Color"));
const Product = lazy(() => import("./Admin/pages/Product"));
const ProductDetail = lazy(() => import("./Admin/pages/ProductDetail"));
const ContactUs = lazy(() => import("./Admin/pages/Contact"));
const Users = lazy(() => import("./Admin/pages/Users"));
const Orders = lazy(() => import("./Admin/pages/Orders"));
const InstagramSection = lazy(() => import("./Admin/pages/InstagramSection"));
const Reviews = lazy(() => import("./Admin/pages/Reviews"));
const Sliders = lazy(() => import("./Admin/pages/Slider"));
const Announcement = lazy(() => import("./Admin/pages/Announcements"));
const PromotionsManagement = lazy(() => import("./Admin/pages/PromotionsManagement"));
const Fabrics = lazy(() => import("./Admin/pages/Fabric"));
const Sizes = lazy(() => import("./Admin/pages/Size"));
const ProductAttributes = lazy(() => import("./Admin/pages/ProductAttributes"));

// Misc
const NotFound = lazy(() => import("./Components/NotFound"));

function App() {
  return (
    <UserProvider>
      <LoaderProvider>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000, // Slightly increased for better UX
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
          }}
        />
        <BrowserRouter>
          <GlobalLoader />
          <SmartScrollManager />
          <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#F3F0ED]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C2F2F]"></div></div>}>
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
                <Route path="/collections/:cate_name" element={<AllProductPage />} />
                <Route path="/collections/:cate_name/:filterValue" element={<AllProductPage />} />
                <Route path="/collections/:filterValue" element={<AllProductPage />} />
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
                <Route path="/cancellation-policy" element={<CancellationPolicy />} />
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
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </LoaderProvider>
    </UserProvider>
  );
}

export default App;
