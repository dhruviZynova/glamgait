import React, { useState } from "react";
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
  const [selectedColorId, setSelectedColorId] = useState(null);

  // Support both API shapes:
  // /productbycategory → product.colors[] (new format with color_id)
  // /getallproducts   → product.productcolors[] (old format with pcolor_id)
  const colorList = product?.colors || product?.productcolors || [];
  const firstColor = colorList[0];
  
  // Get the currently selected color or default to first color
  const currentColor = selectedColorId
    ? colorList.find(c => c.color_id === selectedColorId || c.pcolor_id === selectedColorId)
    : firstColor;

  // Support both ID formats: color_id (new API) or pcolor_id (old API)
  const currentColorId = currentColor?.color_id || currentColor?.pcolor_id;
  const wishlistKey = currentColorId
    ? `${product.p_id}-${currentColorId}`
    : null;

  const isWished =
    wishlistKey && wishlistMap ? !!wishlistMap[wishlistKey] : false;
  const wishlistId =
    wishlistKey && wishlistMap ? wishlistMap[wishlistKey]?.w_id || null : null;


  // Calculate discount percentage
  const discountPercentage = React.useMemo(() => {
    return product?.original_price && product?.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;
  }, [product?.original_price, product?.price]);


  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!currentColorId) {
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
        pcolor_id: currentColorId,
        psize_id: psize_id,
        product_name: product.name,
        price: product.price,
        original_price: product.original_price,
        // image_url can be in images[] (new API) or productimages[] (old API)
        image_url: currentColor?.images?.[0]?.image_url
          || currentColor?.productimages?.[0]?.image_url || '',
        color_name: currentColor?.color_name || currentColor?.color?.color_name,
        color_code: currentColor?.color_code || currentColor?.color?.color_code || "",
        size_name: firstSize?.size?.size_name || null,
        stock_qty: firstSize?.remaining_qty || 10
      };

      const existingIndex = localWishlist.findIndex(item => item.p_id === product.p_id && item.pcolor_id === currentColorId);

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
          pcolor_id: currentColorId,
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
  const totalStock = React.useMemo(() => {
    if (typeof product.total_stock === 'number') {
      return product.total_stock;
    }
    const colorList = product.productcolors || product.colors || [];
    return colorList.reduce((acc, color) => {
      const sizes = color.productsizes || color.sizes || [];
      return acc + sizes.reduce((sAcc, size) => sAcc + (Number(size.remaining_qty) || 0), 0);
    }, 0);
  }, [product?.total_stock, product?.productcolors, product?.colors]);

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
            key={currentColorId || 'default'}
            src={
              currentColor?.images?.[0]?.image_url
              || currentColor?.productimages?.[0]?.image_url
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
          <div className="color-swatches">
            {colorList.slice(0, 4).map((color, idx) => {
              const colorId = color.color_id || color.pcolor_id;
              return (
                <div
                  key={colorId || idx}
                  className={`swatch ${selectedColorId === colorId || (!selectedColorId && idx === 0) ? 'active' : ''}`}
                  title={color.color_name || color.color?.color_name || ""}
                  style={{
                    backgroundColor:
                      color.color_code || color.color?.color_code || "#ccc",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColorId(colorId);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
