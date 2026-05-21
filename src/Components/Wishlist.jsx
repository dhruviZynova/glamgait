import React, { useEffect, useState, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { userInfo, ApiURL } from "../Variable";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import wishlistempty from "../assets/wishlistempty.png";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userDataRaw = userInfo();
  const userData = React.useMemo(() => userDataRaw, [JSON.stringify(userDataRaw)]);

  const isFetchingRef = useRef(false);
  const fetchWishlist = useCallback(async () => {
    try {
      if (!userData?.u_id) {
        const localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
        const mappedLocalWishlist = localWishlist.map((item, index) => ({
          ...item,
          w_id: `local-${index}`
        }));
        setWishlistItems(mappedLocalWishlist);
        setLoading(false);
        return;
      }

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      const identifier = userData.u_id;
      const query = `u_id=${identifier}`;

      const res = await axiosInstance.get(`${ApiURL}/getwishlist?${query}`);

      if (res.data.status === 1) {
        setWishlistItems(res.data.data || []);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.error(err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [userData?.u_id]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (w_id) => {
    if (!userData?.u_id && typeof w_id === 'string' && w_id.startsWith('local-')) {
      const localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      const index = parseInt(w_id.split('-')[1]);
      localWishlist.splice(index, 1);
      localStorage.setItem('localWishlist', JSON.stringify(localWishlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
      fetchWishlist();
      return;
    }

    try {
      const res = await axiosInstance.post(`${ApiURL}/removewishlist`, {
        w_id,
      });
      if (res.data.status === 1) {
        setWishlistItems((prev) => prev.filter((item) => item.w_id !== w_id));
        window.dispatchEvent(new Event('wishlistUpdated'));
        // toast.success("Removed from wishlist");
      }
    } catch (err) {
      toast.error(err.message || "Failed to remove");
    }
  };

  const handleMoveToCart = async (item) => {
    if (!userData?.u_id) {
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      const existingItemIndex = localCart.findIndex(cartItem =>
        cartItem.p_id === item.p_id &&
        cartItem.pcolor_id === item.pcolor_id &&
        cartItem.psize_id === (item.psize_id || null)
      );
      if (existingItemIndex !== -1) {
        localCart[existingItemIndex].quantity += 1;
      } else {
        localCart.push({
          p_id: item.p_id,
          pcolor_id: item.pcolor_id,
          psize_id: item.psize_id || null,
          quantity: 1,
          product_name: item.product_name,
          price: item.price,
          original_price: item.original_price,
          image_url: item.image_url,
          color_name: item.color_name,
          size_name: item.size_name,
          available_stock: item.stock_qty || item.available_stock
        });
      }
      localStorage.setItem('localCart', JSON.stringify(localCart));
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success("Moved to cart!");
      handleRemove(item.w_id);
      return;
    }

    try {
      const payload = {
        p_id: item.p_id,
        pcolor_id: item.pcolor_id,
        psize_id: item.psize_id || null,
        quantity: 1,
        u_id: userData.u_id,
        guest_id: null,
      };

      const res = await axiosInstance.post(
        `${ApiURL}/createcart`,
        payload,
        { headers: { Authorization: `Bearer ${userData.auth_token}` } }
      );

      if (res.data.status === 1) {
        toast.success("Moved to cart!");
        window.dispatchEvent(new Event('cartUpdated'));
        handleRemove(item.w_id); // Auto-remove from wishlist
      } else {
        toast.error(res.data.description || "Out of stock");
      }
    } catch (err) {
      toast.error(err.message || "Failed to move to cart");
    }
  };

  return (
    <div className="bg-[#f3f0ed] min-h-screen px-4 md:px-10 py-10 ">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-600 mt-10">Loading...</p>
        ) : wishlistItems.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                {wishlistItems.map((item) => (
                  <div
                    key={item.w_id}
                    className="bg-white rounded-2xl flex flex-col md:flex-row gap-4 p-4 mb-4 shadow-sm relative"
                  >
                    <button
                      onClick={() => handleRemove(item.w_id)}
                      className="absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer"
                    >
                      <X size={18} />
                    </button>

                    <div className="flex items-center justify-center">
                      <img
                        src={`${ApiURL}/assets/Products/${item.image_url}`}
                        alt={item.product_name}
                        className="w-40 h-60 md:w-28 md:h-40 object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex flex-col flex-1 gap-2 justify-center">
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ₹{item.price.toFixed(2)}{" "}
                          {item.original_price > item.price && (
                            <span className="line-through text-gray-400 text-sm">
                              ₹{item.original_price.toFixed(2)}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Color: {item.color_name}
                          {item.size_name && ` • Size: ${item.size_name}`}
                        </p>
                        {item.stock_qty === 0 ? (
                          <p className="text-red-600 text-sm font-medium mt-1">
                            Out of Stock
                          </p>
                        ) : item.stock_qty <= 5 ? (
                          <p className="text-orange-600 text-sm font-medium mt-1">
                            Only {item.stock_qty} left
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center md:ml-4">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={item.stock_qty === 0}
                        className={`border px-3 py-2 text-sm rounded-md transition whitespace-nowrap cursor-pointer ${item.stock_qty > 0
                          ? "hover:bg-[#02382A] hover:text-white"
                          : "opacity-60 cursor-not-allowed"
                          }`}
                      >
                        {item.stock_qty > 0 ? "MOVE TO CART" : "UNAVAILABLE"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#F3F0ED] h-screen flex items-center justify-center p-4 w-full">
            <div className="text-center">
              <div className="w-40 h-24 md:w-[300px] md:h-[200px] mx-auto">
                <img
                  src={wishlistempty}
                  alt="Empty Wishlist"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="xl:text-[34px] text-[24px] text-black font-bold mt-5">
                Your Wishlist Is Empty.
              </h1>
              <p className="text-[#807D7E] text-[14px] text-center max-w-md mx-auto mt-2">
                You don’t have any products in the wishlist yet. You will find a
                lot of interesting products on our Shop page.
              </p>
              <div className="text-center bg-[#02382A] text-white px-4 py-1.5 rounded-[8px] w-fit mt-5 mx-auto">
                <Link to="/">Continue Shopping</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
