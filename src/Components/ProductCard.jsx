import React, { useState } from "react";
import { Heart } from "lucide-react";
import { createSlug } from "../Variable";
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
  // /productbycategory → product.colors[]   (fields: pcolor_id OR color_id, images[])
  // /getallproducts   → product.productcolors[] (fields: pcolor_id, productimages[])
  const colorList = product?.colors || product?.productcolors || [];
  const firstColor = colorList[0];

  // Get the currently selected color object, defaulting to first color
  const currentColor = selectedColorId
    ? colorList.find(c => (c.pcolor_id ?? c.color_id) === selectedColorId)
    : firstColor;

  // ALWAYS prefer pcolor_id — it is the product_color junction row ID
  // that the backend `addtowishlist` API expects.
  // color_id is the master color table ID and will cause "Invalid color".
  const currentColorId = currentColor?.pcolor_id ?? currentColor?.color_id ?? null;

  // Wishlist key must match the key built from /getwishlist response (uses pcolor_id)
  const wishlistKey = currentColorId ? `${product.p_id}-${currentColorId}` : null;

  const isWished = wishlistKey && wishlistMap ? !!wishlistMap[wishlistKey] : false;
  const wishlistId = wishlistKey && wishlistMap ? wishlistMap[wishlistKey]?.w_id || null : null;

  // Calculate discount percentage
  const discountPercentage = React.useMemo(() => {
    return product?.original_price && product?.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;
  }, [product?.original_price, product?.price]);

  // Get image URL from the selected color — do NOT hardcode index [0]; use first available
  // Both API shapes: images[] (new) or productimages[] (old)
  const currentImageUrl =
    currentColor?.images?.[0]?.image_url ||
    currentColor?.productimages?.[0]?.image_url ||
    "";

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!currentColorId) {
      toast.error("Please select a color");
      return;
    }

    // Validate: make sure the resolved color actually exists in the list
    const matchedColor = colorList.find(
      c => (c.pcolor_id ?? c.color_id) === currentColorId
    );
    if (!matchedColor) {
      toast.error("Could not resolve color — please refresh and try again.");
      return;
    }

    // Resolve the image URL from the matched color
    const imageUrl =
      matchedColor.images?.[0]?.image_url ||
      matchedColor.productimages?.[0]?.image_url ||
      "";

    // Resolve color display info (handles both API shapes)
    const colorName = matchedColor.color_name || matchedColor.color?.color_name || "";
    const colorCode = matchedColor.color_code || matchedColor.color?.color_code || "";

    // Resolve the first size for this color
    const sizesArr =
      matchedColor.productsizes ||  // getallproducts shape
      matchedColor.sizes ||          // productbycategory shape
      product.productsizes ||
      [];
    const firstSize = sizesArr[0] || null;
    const psize_id = firstSize?.psize_id || null;
    const size_name = firstSize?.size?.size_name || null;
    const stock_qty = firstSize?.remaining_qty ?? matchedColor.total_available ?? 10;

    // Debug log — verifies correct IDs before API call
    console.log("[Wishlist] product_id:", product.p_id,
      "| pcolor_id:", currentColorId,
      "| color_name:", colorName,
      "| image_url:", imageUrl);

    // ── GUEST MODE ──────────────────────────────────────────────────────────
    if (!user?.u_id) {
      let localWishlist = JSON.parse(localStorage.getItem("localWishlist") || "[]");

      const payload = {
        p_id: product.p_id,
        sc_id: product.sc_id ?? null,
        pcolor_id: currentColorId,   // always pcolor_id
        psize_id,
        product_name: product.name,
        price: product.price,
        original_price: product.original_price,
        image_url: imageUrl,
        color_name: colorName,
        color_code: colorCode,
        size_name,
        stock_qty,
      };

      const existingIndex = localWishlist.findIndex(
        item => item.p_id === product.p_id && item.pcolor_id === currentColorId
      );

      if (isWished || existingIndex !== -1) {
        if (existingIndex !== -1) localWishlist.splice(existingIndex, 1);
        localStorage.setItem("localWishlist", JSON.stringify(localWishlist));
        toast.success("Removed from wishlist");
        window.dispatchEvent(new Event("wishlistUpdated"));
        onWishlistChange && onWishlistChange();
      } else {
        localWishlist.push(payload);
        localStorage.setItem("localWishlist", JSON.stringify(localWishlist));
        toast.success("Added to wishlist");
        window.dispatchEvent(new Event("wishlistUpdated"));
        onWishlistChange && onWishlistChange();
      }
      return;
    }

    // ── LOGGED-IN MODE ───────────────────────────────────────────────────────
    try {
      if (isWished && wishlistId) {
        // Remove from wishlist
        const res = await axiosInstance.post("/removewishlist", {
          w_id: wishlistId,
        });

        if (res.data.status === 1) {
          toast.success("Removed from wishlist");
          window.dispatchEvent(new Event("wishlistUpdated"));
          onWishlistChange && onWishlistChange();
        } else {
          toast.error(res.data.description || "Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist — send pcolor_id (NOT color_id)
        const payload = {
          u_id: user.u_id,
          guest_id: null,
          p_id: product.p_id,
          sc_id: product.sc_id ?? null,
          pcolor_id: currentColorId,   // always the pcolor_id
          psize_id,
          color_name: colorName,
          color_code: colorCode,
        };

        console.log("[Wishlist] Sending to API:", payload);

        const res = await axiosInstance.post("/addtowishlist", payload);

        if (res.data.status === 1) {
          toast.success("Added to wishlist");
          window.dispatchEvent(new Event("wishlistUpdated"));
          onWishlistChange && onWishlistChange();
        } else {
          toast.error(res.data.description || "Already in wishlist");
        }
      }
    } catch (err) {
      toast.error("Wishlist action failed");
      console.error("[Wishlist] Error:", err);
    }
  };

  // Robust stock calculation
  const totalStock = React.useMemo(() => {
    if (typeof product.total_stock === "number") {
      return product.total_stock;
    }
    const list = product.productcolors || product.colors || [];
    return list.reduce((acc, color) => {
      const sizes = color.productsizes || color.sizes || [];
      return acc + sizes.reduce((sAcc, size) => sAcc + (Number(size.remaining_qty) || 0), 0);
    }, 0);
  }, [product?.total_stock, product?.productcolors, product?.colors]);

  const productSlug = product.slug || createSlug(product.name) || product.p_id;

  return (
    <div
      onClick={() => navigate(`/product/${productSlug}`)}
      style={{ textDecoration: "none", color: "inherit" }}
      key={product.p_id}
    >
      <div className="arrival-card group">
        <div className="card-image-wrapper relative group overflow-hidden">
          <span className="off-badge">{discountPercentage > 0 ? `${discountPercentage}% OFF` : ""}</span>

          {/* Wishlist Heart */}
          <button
            onClick={toggleWishlist}
            className="wishlist-heart-btn"
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={20}
              className={`wishlist-heart ${isWished ? "wishlist-active" : "wishlist-inactive"}`}
            />
          </button>

          <img
            key={currentColorId || "default"}
            src={currentImageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Stock Status Badge */}
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
              // Prefer pcolor_id — the actual DB row ID the API expects
              const colorId = color.pcolor_id ?? color.color_id;
              return (
                <div
                  key={colorId ?? idx}
                  className={`swatch ${selectedColorId === colorId || (!selectedColorId && idx === 0) ? "active" : ""
                    }`}
                  title={color.color_name || color.color?.color_name || ""}
                  style={{
                    backgroundColor: color.color_code || color.color?.color_code || "#ccc",
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
