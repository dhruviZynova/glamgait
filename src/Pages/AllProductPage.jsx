import React from 'react'
import Allproducts from '../Components/AllProducts'
// import StayInLoop from '../Components/StayInLoop'
import ScrollToTop from '../Components/ScrollToTop'
import HolidayBanner from "../Components/HolidayBanner";
import BrandBanner from "../Components/BrandBanner";

const AllProductPage = () => {
  return (
    <div>
      <Allproducts />

      {/* === Holiday Banner Section === */}
      <HolidayBanner />

      {/* === Brand Banner Section === */}
      <BrandBanner />
      {/* <StayInLoop/> */}
    </div>
  )
}

export default AllProductPage