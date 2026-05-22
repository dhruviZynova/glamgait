import React, { useEffect, useRef, useState } from "react";
import VideoCard from "./VideoCard";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";

const WatchAndBuy = () => {
  const containerRef = useRef(null);

  const [finalProducts, setFinalProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(`${ApiURL}/getproducts`, {
        limit: 10,
        is_expert_choice: 1,
      });

      const data = response.data.data || [];

      // IMPORTANT → duplicate in state, not DOM
      setFinalProducts([...data, ...data]);


    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <section className="relative bg-[#F3F0ED] py-16 overflow-visible">
      <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
        <h2 className="text-[30px] md:text-[34px] font-bold text-gray-800 mb-2">
          Watch & Buy
        </h2>
        <p className="text-[12px] md:text-[16px] text-gray-600">
          Explore our latest collection with video previews and shop now!
        </p>
      </div>

      <div
        ref={containerRef}
        className="group relative z-10 w-full overflow-x-auto scrollbar-hide"
      >
        <ul className={`flex w-max flex-nowrap gap-6 py-4 px-4 animate-scroll`}>
          {finalProducts.map((product, index) => (
            <li key={`${product.p_id}-${index}`} className="shrink-0 w-80">
              <VideoCard product={product} />
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .group:hover .animate-scroll {
          animation-play-state: paused;
        }
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default WatchAndBuy;
