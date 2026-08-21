import React, { useState, useEffect, useCallback } from "react";
import { X, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import cartempty from "../assets/cartempty.png";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";
import toast from "react-hot-toast";
import BrandBanner from "./BrandBanner";
import ProductCard from "./ProductCard";
import CartSkeleton from "./skeletons/CartSkeleton";
import { useCart, useUpdateCartQty, useRemoveFromCart } from "../hooks/useCart";
import { useUser } from "../Context/UserContext";
import ScrollReveal from "./Ui/ScrollReveal";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { data: cartItems = [], isLoading: loading } = useCart();
  const updateQtyMutation = useUpdateCartQty();
  const removeCartMutation = useRemoveFromCart();

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [wishlistMap, setWishlistMap] = useState({});
  // Per-item action loading sets
  const [removingIds, setRemovingIds] = useState(new Set());
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const isLoggedIn = !!user?.u_id && !!user?.auth_token;

  const fetchRecommended = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`${ApiURL}/getproducts`);
      if (res.data.status === 1) {
        setRecommendedProducts((res.data.data || []).slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching recommended products:", error);
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!user?.u_id) {
      const local = JSON.parse(localStorage.getItem("localWishlist") || "[]");
      const map = {};
      local.forEach((item, i) => {
        map[`${item.p_id}-${item.pcolor_id}`] = { wished: true, w_id: `local-${i}` };
      });
      setWishlistMap(map);
      return;
    }
    try {
      const res = await axiosInstance.get(`/getwishlist?u_id=${user.u_id}`);
      if (res.data.status === 1) {
        const items = res.data.data || [];
        const map = {};
        items.forEach((item) => {
          const key = `${item.p_id}-${item.pcolor_id}`;
          map[key] = {
            wished: true,
            w_id: item.w_id,
          };
        });
        setWishlistMap(map);
      }
    } catch (err) {
      console.error("Wishlist fetch failed", err);
    }
  }, [user?.u_id]);

  useEffect(() => {
    fetchRecommended();
    fetchWishlist();
  }, [fetchRecommended, fetchWishlist]);

  const updateCartQty = async (cart_id, quantity) => {
    if (updatingIds.has(cart_id)) return; // prevent duplicate
    setUpdatingIds((prev) => new Set(prev).add(cart_id));

    updateQtyMutation.mutate(
      { cart_id, quantity },
      {
        onSettled: () => {
          setUpdatingIds((prev) => {
            const next = new Set(prev);
            next.delete(cart_id);
            return next;
          });
        },
      }
    );
  };

  const handleRemove = async (cart_id) => {
    if (removingIds.has(cart_id)) return; // prevent duplicate
    setRemovingIds((prev) => new Set(prev).add(cart_id));

    removeCartMutation.mutate(cart_id, {
      onSettled: () => {
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(cart_id);
          return next;
        });
      },
    });
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

  if (loading) {
    return (
      <div className="min-h-screen pt-16 px-4 md:px-10 lg:px-20">
        <CartSkeleton count={3} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
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
      <div className="min-h-screen px-2 md:px-10 py-10 font-poppins">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Cart Items */}
          <ScrollReveal animation="fade-right" duration={800} className="flex-1">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-[10px] border border-[#DEDFE1]">
              <table className="w-full border-collapse">
                <thead className="bg-[#E7DCD2]">
                  <tr>
                    <th className="py-4 px-6 text-left font-medium text-lg text-[#000000] font-[Oxygen] font-400 font-[18px]">Product</th>
                    <th className="py-4 px-6 text-center font-medium text-lg text-[#000000] font-[Oxygen] font-400 font-[18px]">Price</th>
                    <th className="py-4 px-6 text-center font-medium text-lg text-[#000000] font-[Oxygen] font-400 font-[18px]">Quantity</th>
                    <th className="py-4 px-6 text-right font-medium text-lg text-[#000000] font-[Oxygen] font-400 font-[18px]">Total</th>
                    <th className="py-4 px-4 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={item.cart_id} className={`group ${index !== 0 ? 'border-t border-gray-200' : ''}`}>
                      <td className="py-8 px-6">
                        <div className="flex items-center gap-6">
                          <img
                            src={item.image_url.startsWith("http") ? item.image_url : `${ApiURL}/assets/Products/${item.image_url}`}
                            alt={item.product_name}
                            className="w-20 h-24 object-cover rounded-lg shadow-xs"
                          />
                          <div className="flex flex-col gap-1.5">
                            <Link
                              to={`/product/${item.p_id}`}
                              className="font-serif font-medium text-base text-[#1C2F2F] hover:text-[#8B1A1A] transition-colors capitalize leading-snug"
                            >
                              {item.product_name}
                            </Link>

                            <div className="flex flex-wrap items-center gap-2 text-xs font-sans mt-0.5">
                              {/* SKU Badge */}
                              {item.sku && String(item.sku).trim() !== "" && (
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50/80 border border-amber-200/80 text-xs">
                                  <span className="text-amber-700/70 font-normal">SKU:</span>
                                  <span className="font-semibold text-amber-900 uppercase">{item.sku}</span>
                                </div>
                              )}

                              {/* Color Badge */}
                              {item.color_name && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/80 border border-gray-200/80 text-gray-700">
                                  {item.color_code && (
                                    <span
                                      className="w-3 h-3 rounded-full border border-black/15 flex-shrink-0 shadow-xs"
                                      style={{ backgroundColor: item.color_code }}
                                      title={item.color_name}
                                    />
                                  )}
                                  <span className="capitalize font-medium text-xs text-gray-700">{item.color_name}</span>
                                </div>
                              )}

                              {/* Size Badge */}
                              {(() => {
                                const sizeVal = item.size_name || item.size;
                                return sizeVal &&
                                  sizeVal.trim() !== "" &&
                                  sizeVal.toLowerCase() !== "na" &&
                                  sizeVal.toLowerCase() !== "n/a" &&
                                  sizeVal.toLowerCase() !== "free size" &&
                                  sizeVal.toLowerCase() !== "free-size" ? (
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1C2F2F]/5 border border-[#1C2F2F]/15 text-xs">
                                    <span className="text-gray-500 font-normal">Size:</span>
                                    <span className="font-semibold text-[#1C2F2F] uppercase">{sizeVal}</span>
                                  </div>
                                ) : null;
                              })()}
                            </div>
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
                              disabled={updatingIds.has(item.cart_id) || item.quantity <= 1}
                              className="text-[#414141] cursor-pointer disabled:opacity-40"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="mx-6 w-4 text-center text-[#3D3D3D]">
                              {updatingIds.has(item.cart_id)
                                ? <Loader2 size={12} className="animate-spin inline" />
                                : item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQty(item.cart_id, item.quantity, item.available_stock)}
                              disabled={updatingIds.has(item.cart_id)}
                              className="text-[#414141] cursor-pointer disabled:opacity-40"
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
                      <td className="py-8 px-4 text-center">
                        <button
                          onClick={() => handleRemove(item.cart_id)}
                          disabled={removingIds.has(item.cart_id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all cursor-pointer disabled:opacity-50"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          {removingIds.has(item.cart_id)
                            ? <Loader2 size={16} className="animate-spin text-red-500" />
                            : <Trash2 size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {cartItems.map((item) => (
                <div key={item.cart_id} className="bg-white p-4 rounded-xl relative border border-gray-100 shadow-xs">
                  <button
                    onClick={() => handleRemove(item.cart_id)}
                    disabled={removingIds.has(item.cart_id)}
                    className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer disabled:opacity-50"
                    aria-label="Remove item"
                  >
                    {removingIds.has(item.cart_id)
                      ? <Loader2 size={16} className="animate-spin text-red-500" />
                      : <Trash2 size={17} />}
                  </button>
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={item.image_url.startsWith("http") ? item.image_url : `${ApiURL}/assets/Products/${item.image_url}`}
                      alt={item.product_name}
                      className="w-32 h-40 object-cover rounded-lg"
                    />
                    <div className="text-start w-full">
                      <Link
                        to={`/product/${item.p_id}`}
                        className="font-serif font-medium text-base text-[#1C2F2F] hover:text-[#8B1A1A] transition-colors capitalize leading-snug block mb-2"
                      >
                        {item.product_name}
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-sans mb-4">
                        {/* SKU Badge */}
                        {item.sku && String(item.sku).trim() !== "" && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50/80 border border-amber-200/80 text-xs">
                            <span className="text-amber-700/70 font-normal">SKU:</span>
                            <span className="font-semibold text-amber-900 uppercase">{item.sku}</span>
                          </div>
                        )}

                        {/* Color Badge */}
                        {item.color_name && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/80 border border-gray-200/80 text-gray-700">
                            {item.color_code && (
                              <span
                                className="w-3 h-3 rounded-full border border-black/15 flex-shrink-0 shadow-xs"
                                style={{ backgroundColor: item.color_code }}
                                title={item.color_name}
                              />
                            )}
                            <span className="capitalize font-medium text-xs text-gray-700">{item.color_name}</span>
                          </div>
                        )}

                        {/* Size Badge */}
                        {(() => {
                          const sizeVal = item.size_name || item.size;
                          return sizeVal &&
                            sizeVal.trim() !== "" &&
                            sizeVal.toLowerCase() !== "na" &&
                            sizeVal.toLowerCase() !== "n/a" &&
                            sizeVal.toLowerCase() !== "free size" &&
                            sizeVal.toLowerCase() !== "free-size" ? (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1C2F2F]/5 border border-[#1C2F2F]/15 text-xs">
                              <span className="text-gray-500 font-normal">Size:</span>
                              <span className="font-semibold text-[#1C2F2F] uppercase">{sizeVal}</span>
                            </div>
                          ) : null;
                        })()}
                      </div>

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
          </ScrollReveal>

          {/* Right Section - Summary */}
          <ScrollReveal animation="fade-left" duration={800} className="w-full lg:w-[380px] h-fit">
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
          </ScrollReveal>
        </div>

        {/* You May Also Like Section */}
        {(() => {
          const filtered = recommendedProducts.filter(
            (product) => !cartItems.some((item) => String(item.p_id) === String(product.p_id))
          );
          if (filtered.length === 0) return null;

          return (
            <ScrollReveal animation="fade-up" duration={800} className="mt-16 md:mt-20">
              <h2 className="text-[20px] md:text-[34px] font-700 text-[#3D3D3D] font-[Oxygen] mb-8 md:mb-12">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-6 pb-8">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.p_id}
                    product={product}
                    wishlistMap={wishlistMap}
                    onWishlistChange={fetchWishlist}
                  />
                ))}
              </div>
            </ScrollReveal>
          );
        })()}
      </div>
      <BrandBanner />
    </>
  );
};

export default Cart;