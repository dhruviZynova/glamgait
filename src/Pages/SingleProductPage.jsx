import React from "react";
import SingleProduct from "../Components/SingleProduct";
import ReletedProduct from "../Components/ReletedProduct";
import BrandBanner from "../Components/BrandBanner";

const SingleProductPage = () => {
  return (
    <div>
      <SingleProduct />
      <ReletedProduct />
      <BrandBanner />
    </div>
  );
};

export default SingleProductPage;
