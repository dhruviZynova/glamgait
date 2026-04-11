// // import React from "react";
// // import Hero from "../Components/Hero";
// // import Categories from "../Components/Categories";
// // import FourCategories from "../Components/FourCategories";
// // import NewArrivels from "../Components/NewArrivels";
// // import Services from "../Components/Services";
// // import CustomersSay from "../Components/CustomersSay";
// // import WatchAndBuy from "../Components/WatchAndBuy";
// // import StayInLoop from "../Components/StayInLoop";

// // const HomePage = () => {
// //   return (
// //     <div>
// //       <Hero />
// //       <Categories />
// //       <NewArrivels />
// //       <FourCategories /> 
// //       <Services />
// //       <CustomersSay />
// //       <WatchAndBuy />
// //       <StayInLoop />
// //     </div>
// //   );
// // };

// // export default HomePage;

import React from "react";
import Hero from "../Components/Hero";
import Categories from "../Components/Categories";
import FourCategories from "../Components/FourCategories";
import NewArrivels from "../Components/NewArrivels";
import Services from "../Components/Services";
import CustomersSay from "../Components/CustomersSay";
import WatchAndBuy from "../Components/WatchAndBuy";
import StayInLoop from "../Components/StayInLoop";
import leftlight from "../assets/leftlight.png";
import waves from "../assets/waves.png";
import HomeHero from "../Components/HomeHero";
import CategorySection from "../Components/CategorySection";
import BannerSection from "../Components/BannerSection";
// import TopProductShowcase from "../Components/TopProductShowcase";
import LatestArrivalsByCategories from "../Components/LatestArrivalsByCategories";
import CollectionBanner from "../Components/CollectionBanner";
import FashionShowcase from "../Components/FashionShowcase";
import HolidayBanner from "../Components/HolidayBanner";
import BrandBanner from "../Components/BrandBanner";
import FAQSection from "../Components/FAQSection";

import bgImage from "../assets/images/bgimage2.png";

const HomePage = () => {
  return (
    <div className="overflow-x-hidden relative">
      {/* <Hero /> */}
      <HomeHero />

      {/* Top Product Showcase - New Section */}
      {/* <TopProductShowcase /> */}

      {/* <Categories /> */}
      <CategorySection />

      <BannerSection />

      <LatestArrivalsByCategories />

      {/* === Category Section === */}
      <section className="relative w-full overflow-hidden py-6 md:py-16">
        {/* Background Image */}
        <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[630px]">
          <img
            src={bgImage}
            alt="Modesty is the new beauty"
            className="w-full h-full object-cover object-top object-center"
          />
        </div>
      </section>

      {/* === Fashion Showcase Section === */}
      <FashionShowcase />

      {/* === Collection Banner Section === */}
      <CollectionBanner />

      {/* === Customers Say Section === */}
      <CustomersSay />

      {/* === Holiday Banner Section === */}
      <HolidayBanner />

      {/* === Brand Banner Section === */}
      <BrandBanner />

      {/* === FAQ Section === */}
      <FAQSection />

    </div>
  );
};

export default HomePage;
