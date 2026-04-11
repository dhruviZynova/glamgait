import s1 from "../assets/s1.svg";
import s2 from "../assets/s2.svg";
import s3 from "../assets/s3.svg";
import s4 from "../assets/s4.svg";
import HomePageBanner from "../Components/HomePageBanner";
import singlebanner from "../assets/singlebanner.jpg";

const Services = () => {
  return (
    <div className="bg-[#F3F0ED] z-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:flex justify-between items-center gap-2 md:gap-6 px-6 py-6 md:py-10 md:px-12 2xl:px-40 container mx-auto">
        <div className="flex items-start gap-3">
          <img
            src={s1}
            alt="High Quality"
            className="w-6 h-6 xl:w-12 xl:h-12 mt-1"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-800 xl:text-[18px]">
              High Quality
            </h3>
            <p className="text-xs text-gray-600 xl:text-[14px]">
              crafted from top materials
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <img
            src={s2}
            alt="Warranty Protection"
            className="w-6 h-6 xl:w-12 xl:h-12 mt-1"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-800 xl:text-[18px]">
              Warranty Protection
            </h3>
            <p className="text-xs text-gray-600 xl:text-[14px]">
              Trusted Quality Assurance
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <img
            src={s3}
            alt="Free Shipping"
            className="w-6 h-6 xl:w-12 xl:h-12 mt-1"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-800 xl:text-[18px]">
              Free Shipping
            </h3>
            <p className="text-xs text-gray-600 xl:text-[14px]">
              Quick & Secure Delivery
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <img
            src={s4}
            alt="24/7 Support"
            className="w-6 h-6 xl:w-12 xl:h-12 mt-1"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-800 xl:text-[18px]">
              24 / 7 Support
            </h3>
            <p className="text-xs text-gray-600 xl:text-[14px]">
              Dedicated support
            </p>
          </div>
        </div>
      </div>
      <div>
        <HomePageBanner
          title="Discover Timeless Comfort"
          bgImage={singlebanner}
        />
      </div>
    </div>
  );
};

export default Services;
