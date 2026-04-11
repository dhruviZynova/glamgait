import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ApiURL } from "../Variable";
import axiosInstance from "../Axios/axios";
import toast from "react-hot-toast";
import { getGuestId } from "../utils/guest";

import "../style/ProductCard.css";

const ProductCard = ({
  product,
  wishlistMap,
  onWishlistChange,
}) => {

  // Slug generate kare helper function (Optional: Agar API slug nahi ape to name thi banavi sake)
  const createSlug = (name) => {
    if (!name) return "";
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const wishlistKey = product?.productcolors?.[0]?.pcolor_id
    ? `${product.p_id}-${product.productcolors[0].pcolor_id}`
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

    if (!product?.productcolors?.[0]?.pcolor_id) {
      toast.error("Please select a color");
      return;
    }

    try {
      if (isWished && wishlistId) {
        const res = await axiosInstance.post(`${ApiURL}/removewishlist`, {
          w_id: wishlistId,
        });

        if (res.data.status === 1) {
          toast.success("Removed from wishlist");
          onWishlistChange();
        }
      } else {
        const firstSize = product.productsizes?.[0];
        const psize_id = firstSize?.psize_id || null;

        const payload = {
          u_id: null,
          guest_id: getGuestId(),
          p_id: product.p_id,
          sc_id: product.sc_id,
          pcolor_id: product.productcolors[0].pcolor_id,
          psize_id: psize_id,
        };

        const res = await axiosInstance.post(
          `${ApiURL}/addtowishlist`,
          payload,
        );

        if (res.data.status === 1) {
          toast.success("Added to wishlist");
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

  // Logic: Pehlo Slug check karo, agal nahi hoy to ID use karo.
  const productSlug = product.slug || createSlug(product.name) || product.p_id;

  return (
    <Link
      to={`/product/${productSlug}`}
      style={{ textDecoration: "none", color: "inherit" }}
      key={product.p_id}
    >
      {/* <p>{console.log("product slug:", product.name, "product id:", product.p_id)}</p>  <-- Console log remove karyu che clean rite */}

      <div className="arrival-card">
        <div className="card-image-wrapper">
          <span className="off-badge">{discountPercentage > 0 ? `${discountPercentage}% OFF` : ''}</span>
          {/* Wishlist Heart */}
          <button
            onClick={toggleWishlist}
            className="wishlist-heart-btn"
          >
            <Heart
              size={20}
              className={`wishlist-heart ${isWished
                ? "wishlist-active"
                : "wishlist-inactive"
                }`}
            />
          </button>
          <img src={`${ApiURL}/assets/Products/${product?.productcolors?.[0]?.productimages?.[0]?.image_url || ''}`} alt={product.name} />
        </div>
        <div className="card-info">
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
            {product?.productcolors?.[0]?.color?.color_name || product.category?.cate_name || ""}
          </p>
          <div className="color-swatches">
            {product.productcolors?.slice(0, 4).map((color) => (
              <div
                key={color.pcolor_id}
                className="swatch"
                style={{ backgroundColor: color.color?.color_code }}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
