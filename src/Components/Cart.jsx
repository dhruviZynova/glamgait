import React, { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import cartempty from "../assets/cartempty.png";
import axiosInstance from "../Axios/axios";
import { ApiURL, userInfo } from "../Variable";
import { getGuestId } from "../utils/guest";
import toast from "react-hot-toast";
import categorie from "../assets/images/categorie5.png";
import BrandBanner from "./BrandBanner";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = userInfo();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!user?.u_id && !!user?.auth_token;

  const fetchCart = async () => {
    try {
      if (!isLoggedIn) {
        const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        const mappedLocalCart = localCart.map((item, index) => ({
          ...item,
          cart_id: `local-${index}`
        }));
        setCartItems(mappedLocalCart);
        setLoading(false);
        return;
      }
      const identifier = user.u_id;
      const query = `u_id=${identifier}`;
      const res = await axiosInstance.get(`${ApiURL}/getcart?${query}`);

      if (res.data.status === 1) {
        setCartItems(res.data.data || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCartQty = async (cart_id, quantity) => {
    if (!isLoggedIn && typeof cart_id === 'string' && cart_id.startsWith('local-')) {
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      const index = parseInt(cart_id.split('-')[1]);
      if (localCart[index]) {
        localCart[index].quantity = quantity;
        localStorage.setItem('localCart', JSON.stringify(localCart));
        window.dispatchEvent(new Event('cartUpdated'));
        fetchCart();
      }
      return;
    }

    try {
      const res = await axiosInstance.post(`${ApiURL}/updatecart`, {
        cart_id,
        quantity,
      });

      if (res.data.status === 1) {
        window.dispatchEvent(new Event('cartUpdated'));
        fetchCart();
      } else {
        toast.error(res.data.description || "Not enough stock");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (cart_id) => {
    if (!isLoggedIn && typeof cart_id === 'string' && cart_id.startsWith('local-')) {
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      const index = parseInt(cart_id.split('-')[1]);
      localCart.splice(index, 1);
      localStorage.setItem('localCart', JSON.stringify(localCart));
      window.dispatchEvent(new Event('cartUpdated'));
      fetchCart();
      toast.success("Removed from cart");
      return;
    }

    try {
      const res = await axiosInstance.post(`${ApiURL}/removecart`, { cart_id });
      if (res.data.status === 1) {
        setCartItems((prev) => prev.filter((item) => item.cart_id !== cart_id));
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success("Removed from cart");
      }
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  const increaseQty = (cart_id, currentQty, availableStock) => {
    if (currentQty < availableStock) {
      updateCartQty(cart_id, currentQty + 1);
    } else {
      toast.error(`Only ${availableStock} available`);
    }
  };

  const decreaseQty = (cart_id, currentQty) => {
    if (currentQty > 1) {
      updateCartQty(cart_id, currentQty - 1);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login to proceed to checkout");
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems,
        isGuest: false,
        guestId: null,
      },
    });
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const taxes = 0;
  const delivery = 0;
  const grandTotal = subtotal + taxes + delivery;

  const dummyProducts = [
    {
      p_id: "d1",
      name: "Black Burqa",
      price: 132,
      original_price: 188,
      slug: "black-burqa-1",
      productcolors: [
        {
          pcolor_id: "c1",
          color: { color_name: "Black", color_code: "#1a1a1b" },
          productimages: [{ image_url: categorie }]
        },
        { pcolor_id: "c2", color: { color_name: "Grey", color_code: "#565656" } },
        { pcolor_id: "c3", color: { color_name: "Beige", color_code: "#9f8262" } },
        { pcolor_id: "c4", color: { color_name: "Dark", color_code: "#2a2a2a" } }
      ]
    },
    {
      p_id: "d2",
      name: "Black Burqa",
      price: 132,
      original_price: 188,
      slug: "black-burqa-2",
      productcolors: [
        {
          pcolor_id: "c5",
          color: { color_name: "Black", color_code: "#1a1a1b" },
          productimages: [{ image_url: categorie }]
        },
        { pcolor_id: "c6", color: { color_name: "Grey", color_code: "#565656" } },
        { pcolor_id: "c7", color: { color_name: "Beige", color_code: "#9f8262" } },
        { pcolor_id: "c8", color: { color_name: "Dark", color_code: "#2a2a2a" } }
      ]
    },
    {
      p_id: "d3",
      name: "Black Burqa",
      price: 132,
      original_price: 188,
      slug: "black-burqa-3",
      productcolors: [
        {
          pcolor_id: "c9",
          color: { color_name: "Black", color_code: "#1a1a1b" },
          productimages: [{ image_url: categorie }]
        },
        { pcolor_id: "c10", color: { color_name: "Grey", color_code: "#565656" } },
        { pcolor_id: "c11", color: { color_name: "Beige", color_code: "#9f8262" } },
        { pcolor_id: "c12", color: { color_name: "Dark", color_code: "#2a2a2a" } }
      ]
    },
    {
      p_id: "d4",
      name: "Black Burqa",
      price: 132,
      original_price: 188,
      slug: "black-burqa-4",
      productcolors: [
        {
          pcolor_id: "c13",
          color: { color_name: "Black", color_code: "#1a1a1b" },
          productimages: [{ image_url: categorie }]
        },
        { pcolor_id: "c14", color: { color_name: "Grey", color_code: "#565656" } },
        { pcolor_id: "c15", color: { color_name: "Beige", color_code: "#9f8262" } },
        { pcolor_id: "c16", color: { color_name: "Dark", color_code: "#2a2a2a" } }
      ]
    },
    {
      p_id: "d5",
      name: "Black Burqa",
      price: 132,
      original_price: 188,
      slug: "black-burqa-4",
      productcolors: [
        {
          pcolor_id: "c17",
          color: { color_name: "Black", color_code: "#1a1a1b" },
          productimages: [{ image_url: categorie }]
        },
        { pcolor_id: "c18", color: { color_name: "Grey", color_code: "#565656" } },
        { pcolor_id: "c19", color: { color_name: "Beige", color_code: "#9f8262" } },
        { pcolor_id: "c20", color: { color_name: "Dark", color_code: "#2a2a2a" } }
      ]
    }
  ];

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAF7F2] h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-40 h-24 md:w-[300px] md:h-[200px] mx-auto">
            <img
              src={cartempty}
              alt="Empty Cart"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold mt-5">Your Cart Is Empty.</h1>
          <p className="text-gray-500 text-sm mt-2">
            You don’t have any products in your cart yet. Start exploring our
            Shop page!
          </p>
          <div className="mt-5">
            <Link
              to="/"
              className="bg-[#1B2926] text-white px-6 py-2 rounded-md hover:bg-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-16 px-4 md:px-10 lg:px-20">
        <div className="">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section - Cart Items */}
            <div className="flex-1">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-hidden rounded-[10px] border border-[#DEDFE1]">
                <table className="w-full border-collapse">
                  <thead className="bg-[#E7DCD2]">
                    <tr>
                      <th className="py-4 px-6 text-left font-medium text-lg text-[#000000] font-[Oxygen] font-400 font-[18px]">Product</th>
                      <th className="py-4 px-6 text-center font-medium text-lg text-[#000000] font-[Oxygen] font-400 font-[18px]">Price</th>
                      <th className="py-4 px-6 text-center font-medium text-lg text-[#000000] font-[Oxygen] font-400 font-[18px]">Quantity</th>
                      <th className="py-4 px-6 text-right font-medium text-lg text-[#000000] font-[Oxygen] font-400 font-[18px]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={item.cart_id} className={`group ${index !== 0 ? 'border-t border-gray-200' : ''}`}>
                        <td className="py-8 px-6">
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() => handleRemove(item.cart_id)}
                              className="transition-colors cursor-pointer"
                            >
                              <X size={18} className="text-[#3D3D3D]" />
                            </button>
                            <img
                              src={`${ApiURL}/assets/Products/${item.image_url}`}
                              alt={item.product_name}
                              className="w-20 h-24 object-cover rounded"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-[#3D3D3D] font-[Oxygen] font-400 font-[18px]">{item.product_name}</span>
                              <span className="text-sm text-[#949494] font-[Oxygen] font-400 font-[16px]">
                                {item.color_name}
                                {item.size_name && ` / ${item.size_name}`}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-6 text-center">
                          <span className="text-[#949494] font-[Oxygen] font-400 font-[18px]">₹{item.price.toFixed(0)}</span>
                        </td>
                        <td className="py-8 px-6">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center border border-[#D7D7D7] rounded-full py-2 px-4 bg-white">
                              <button
                                onClick={() => decreaseQty(item.cart_id, item.quantity)}
                                className="text-[#414141] cursor-pointer"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="mx-6 w-4 text-center text-[#3D3D3D]">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  increaseQty(
                                    item.cart_id,
                                    item.quantity,
                                    item.available_stock
                                  )
                                }
                                className="text-[#414141] cursor-pointer"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-8 px-6 text-right">
                          <span className="text-[#949494] font-[Oxygen] font-400 font-[18px]">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {cartItems.map((item) => (
                  <div key={item.cart_id} className="bg-white p-4 rounded-xl relative">
                    <button
                      onClick={() => handleRemove(item.cart_id)}
                      className="absolute top-4 left-4 text-[#000000]"
                    >
                      <X size={18} />
                    </button>
                    <div className="flex flex-col items-center gap-4">
                      <img
                        src={`${ApiURL}/assets/Products/${item.image_url}`}
                        alt={item.product_name}
                        className="w-32 h-40 object-cover rounded-lg"
                      />
                      <div className="text-center w-full">
                        <span className="font-medium text-[#3D3D3D] font-[Oxygen] font-400 font-[20px]">{item.product_name}</span>
                        <p className="text-gray-400 text-sm mb-4">
                          {item.color_name} {item.size_name && ` / ${item.size_name}`}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                          <span className="text-gray-600 font-medium">₹{item.price.toFixed(0)}</span>

                          <div className="flex items-center border border-gray-200 rounded-full py-1 px-3">
                            <button onClick={() => decreaseQty(item.cart_id, item.quantity)} className="text-gray-400"><Minus size={14} /></button>
                            <span className="mx-3 w-4 text-center">{item.quantity}</span>
                            <button onClick={() => increaseQty(item.cart_id, item.quantity, item.available_stock)} className="text-gray-400"><Plus size={14} /></button>
                          </div>

                          <span className="font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Section - Summary */}
            <div className="w-full lg:w-[380px] h-fit">
              <div className="rounded-[10px] overflow-hidden border border-[#DEDFE1]">
                <div className="bg-[#E7DCD2] py-4 px-6">
                  <h3 className="text-lg font-medium text-[#000000] font-[Oxygen] font-400 font-[18px]">Cart Total</h3>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center py-6 px-6">
                    <span className="uppercase tracking-wider text-sm font-medium text-[#4A4A4A] font-[Oxygen] font-400 font-[16px]">SUBTOTAL</span>
                    <span className="text-[#949494] font-[Oxygen] font-400 font-[16px]">₹{subtotal.toFixed(0)}</span>
                  </div>

                  <div className="border-t border-gray-200 flex justify-between items-center py-6 px-6">
                    <span className="uppercase tracking-wider text-sm font-medium text-[#4A4A4A] font-[Oxygen] font-400 font-[16px]">DISCOUNT</span>
                    <span className="text-[#949494] font-[Oxygen] font-400 font-[16px]">---</span>
                  </div>

                  <div className="border-t border-gray-200 flex justify-between items-center py-6 px-6">
                    <span className="uppercase tracking-wider text-sm font-medium text-[#4A4A4A] font-[Oxygen] font-400 font-[16px]">TOTAL</span>
                    <span className="text-[#949494] font-[Oxygen] font-400 font-[16px]">₹{grandTotal.toFixed(0)}</span>
                  </div>

                  <div className="">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-[#1C2F2F] text-white py-4 font-medium tracking-wide hover:bg-black transition-all active:scale-[0.98] font-[Oxygen] cursor-pointer"
                    >
                      Proceed To Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* You May Also Like Section */}
          <div className="mt-16 sm:mt-18">
            <h2 className="text-[20px] md:text-[34px] font-700 text-[#3D3D3D] font-[Oxygen] mb-8 md:mb-12">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 pb-8">
              {dummyProducts.map((product) => (
                <div key={product.p_id} className="group cursor-pointer">
                  {/* Image Container */}
                  <div className="relative aspect-[3.5/4.5] overflow-hidden rounded-2xl bg-[#E8E8E8] mb-3">
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white text-[#E11D48] px-3 py-1 rounded text-[12px] font-bold shadow-sm">
                        30% off
                      </span>
                    </div>
                    <img
                      src={product.productcolors[0].productimages[0].image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[14px] md:text-[16px] font-semibold text-[#1A1A1A] font-[Oxygen]">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#A1A1A1] line-through font-[Oxygen]">
                          ₹{product.original_price}
                        </span>
                        <span className="text-[13px] md:text-[15px] font-bold text-[#1A1A1A] font-[Oxygen]">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>

                    <p className="text-[12px] md:text-[14px] text-[#949494] font-[Oxygen]">
                      {product.productcolors[0].color.color_name}
                    </p>

                    {/* Swatches */}
                    <div className="flex gap-2 pt-1">
                      {product.productcolors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-[#D1D1D1] cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.color.color_code }}
                          title={color.color.color_name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BrandBanner />
    </>
  );
};

export default Cart;
