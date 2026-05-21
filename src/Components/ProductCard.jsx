import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ApiURL, createSlug } from "../Variable";
import { useUser } from "../Context/UserContext";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import "../style/ProductCard.css";

const ProductCard = ({
  product,
  wishlistMap,
  onWishlistChange,
}) => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Support both API shapes:
  // /productbycategory → product.colors[]
  // /getallproducts   → product.productcolors[]
  const colorList = product?.colors || product?.productcolors || [];
  const firstColor = colorList[0];

  const wishlistKey = firstColor?.pcolor_id
    ? `${product.p_id}-${firstColor.pcolor_id}`
    : null;

  const isWished =
    wishlistKey && wishlistMap ? !!wishlistMap[wishlistKey] : false;
  const wishlistId =
    wishlistKey && wishlistMap ? wishlistMap[wishlistKey]?.w_id || null : null;


  // Calculate discount percentage
  const discountPercentage =
    product?.original_price && product?.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;


  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!firstColor?.pcolor_id) {
      toast.error("Please select a color");
      return;
    }

    if (!user?.u_id) {
      let localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');
      const firstSize = product.productsizes?.[0];
      const psize_id = firstSize?.psize_id || null;

      const payload = {
        p_id: product.p_id,
        sc_id: product.sc_id,
        pcolor_id: firstColor.pcolor_id,
        psize_id: psize_id,
        product_name: product.name,
        price: product.price,
        original_price: product.original_price,
        // image_url can be in images[] (new API) or productimages[] (old API)
        image_url: firstColor?.images?.[0]?.image_url
          || firstColor?.productimages?.[0]?.image_url || '',
        color_name: firstColor?.color_name || firstColor?.color?.color_name,
        size_name: firstSize?.size?.size_name || null,
        stock_qty: firstSize?.remaining_qty || 10
      };

      const existingIndex = localWishlist.findIndex(item => item.p_id === product.p_id && item.pcolor_id === firstColor.pcolor_id);

      if (isWished || existingIndex !== -1) {
        if (existingIndex !== -1) localWishlist.splice(existingIndex, 1);
        localStorage.setItem('localWishlist', JSON.stringify(localWishlist));
        toast.success("Removed from wishlist");
        window.dispatchEvent(new Event('wishlistUpdated'));
        onWishlistChange && onWishlistChange();
      } else {
        localWishlist.push(payload);
        localStorage.setItem('localWishlist', JSON.stringify(localWishlist));
        toast.success("Added to wishlist");
        window.dispatchEvent(new Event('wishlistUpdated'));
        onWishlistChange && onWishlistChange();
      }
      return;
    }

    try {
      if (isWished && wishlistId) {
        const res = await axiosInstance.post(`${ApiURL}/removewishlist`, {
          w_id: wishlistId,
        });

        if (res.data.status === 1) {
          toast.success("Removed from wishlist");
          window.dispatchEvent(new Event('wishlistUpdated'));
          onWishlistChange();
        }
      } else {
        const firstSize = product.productsizes?.[0];
        const psize_id = firstSize?.psize_id || null;

        const payload = {
          u_id: user.u_id,
          guest_id: null,
          p_id: product.p_id,
          sc_id: product.sc_id,
          pcolor_id: firstColor.pcolor_id,
          psize_id: psize_id,
        };

        const res = await axiosInstance.post(
          `${ApiURL}/addtowishlist`,
          payload,
        );

        if (res.data.status === 1) {
          toast.success("Added to wishlist");
          window.dispatchEvent(new Event('wishlistUpdated'));
          onWishlistChange();
        } else {
          toast.error(res.data.description || "Already in wishlist");
        }
      }
    } catch (err) {
      toast.error("Wishlist action failed");
      console.error(err);
    }
  };

  // Robust stock calculation
  const totalStock = typeof product.total_stock === 'number'
    ? product.total_stock
    : (product.productcolors || product.colors || []).reduce((acc, color) => {
      const sizes = color.productsizes || color.sizes || [];
      return acc + sizes.reduce((sAcc, size) => sAcc + (Number(size.remaining_qty) || 0), 0);
    }, 0);

  // Logic: Pehlo Slug check karo, agal nahi hoy to ID use karo.
  const productSlug = product.slug || createSlug(product.name) || product.p_id;

  return (
    <div
      onClick={() => navigate(`/product/${productSlug}`)}
      style={{ textDecoration: "none", color: "inherit" }}
      key={product.p_id}
    >
      <div className="arrival-card group">
        <div className="card-image-wrapper relative group overflow-hidden">
          <span className="off-badge">{discountPercentage > 0 ? `${discountPercentage}% OFF` : ''}</span>
          {/* Wishlist Heart */}
          <button
            onClick={toggleWishlist}
            className="wishlist-heart-btn"
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={20}
              className={`wishlist-heart ${isWished
                ? "wishlist-active"
                : "wishlist-inactive"
                }`}
            />
          </button>
          <img
            src={
              firstColor?.images?.[0]?.image_url
              || firstColor?.productimages?.[0]?.image_url
              || ''
            }
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Stock Status Badge - Overlay on Image on hover (Only if low or out of stock) */}
          {totalStock <= 5 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
              {totalStock <= 0 ? (
                <span className="px-4 py-2 bg-red-600 text-white text-[11px] font-bold rounded-full uppercase tracking-widest shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  Out of Stock
                </span>
              ) : (
                <span className="px-4 py-2 bg-orange-500 text-white text-[11px] font-bold rounded-full uppercase tracking-widest shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  Low Stock ({totalStock})
                </span>
              )}
            </div>
          )}
        </div>
        <div className="card-info pt-3">
          <div className="info-header">
            <h3 className="product-name">{product.name}</h3>
            <div className="product-price">
              {product.original_price > product.price && (
                <span className="original-price">₹{product.original_price}</span>
              )}
              <span>₹{product.price}</span>
            </div>
          </div>
          <p className="category-tag">
            {firstColor?.color_name || firstColor?.color?.color_name || product.category?.cate_name || ""}
          </p>
          <div className="color-swatches">
            {colorList.slice(0, 4).map((color, idx) => (
              <div
                key={color.pcolor_id || idx}
                className="swatch"
                title={color.color_name || color.color?.color_name || ""}
                style={{
                  backgroundColor:
                    color.color_code || color.color?.color_code || "#ccc",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
