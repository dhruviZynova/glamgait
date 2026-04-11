import { useEffect, useState } from "react";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";

const useCoupons = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axiosInstance.post(`${ApiURL}/getcoupons`);
        if (res?.data?.status === 1) {
          const today = new Date();

          const validCoupons = res.data.data.filter(
            (c) =>
              c.is_active &&
              new Date(c.start_date) <= today &&
              new Date(c.end_date) >= today
          );

          setCoupons(validCoupons);
        }
      } catch (err) {
        console.error("Coupon fetch failed");
      }
    };

    fetchCoupons();
  }, []);

  return { coupons };
};

export default useCoupons;
