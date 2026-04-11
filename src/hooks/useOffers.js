import { useEffect, useState } from "react";
import axiosInstance from "../Axios/axios";
import { ApiURL } from "../Variable";

const useOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axiosInstance.post(`${ApiURL}/getoffers`);
        if (res?.data?.status === 1) {
          setOffers(
            res.data.data.filter((o) => o.is_active)
          );
        }
      } catch (err) {
        console.error("Offer fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return { offers, loading };
};

export default useOffers;
