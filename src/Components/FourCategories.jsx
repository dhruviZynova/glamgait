import { NavLink } from "react-router-dom";
import cat1 from "../assets/cat1.jpg";
import cat2 from "../assets/cat2.jpg";
import cat3 from "../assets/cat3.jpg";
import cat4 from "../assets/cat4.jpg";

const FourCategories = () => {
  const categories = [
    {
      id: 1,
      // to: "/kanjivaram-saree",
      label: "Kanjivaram Saree",
      subLabel: "SAREES COLLECTIONS",
      image: cat1,
      grid: "col-span-5 row-span-8",
    },
    {
      id: 2,
      // to: "/anarkali-kurtis",
      label: "Anarkali Kurtis",
      subLabel: "KURTIS COLLECTIONS",
      image: cat2,
      grid: "col-span-3 row-span-4 col-start-6",
    },
    {
      id: 3,
      // to: "/festive-kurti",
      label: "Festive KURTI",
      subLabel: "KURTIS COLLECTIONS",
      image: cat4,
      grid: "col-span-3 row-span-4 col-start-9",
    },
    {
      id: 4,
      // to: "/bridal-lehengas",
      label: "Bridal Lehengas",
      subLabel: "LEHENGAS COLLECTIONS",
      image: cat3,
      grid: "col-span-6 row-span-4 col-start-6 row-start-5",
    },
  ];

  return (
    <section className="relative px-4 py-10 md:py-16 bg-[#F3F0ED] overflow-hidden">


      <div className="max-w-7xl mx-auto relative z-20">
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-11 grid-rows-8 gap-5">
          {categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={cat.to}
              className={`relative overflow-hidden rounded-2xl group ${cat.grid}`}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <div className="text-white">
                  <p className="text-xs md:text-[10px] lg:text-[16px] font-medium uppercase tracking-wider bg-black text-white px-2 py-1 inline-block rounded-sm mb-2">
                    {cat.subLabel}
                  </p>
                  <p className="text-[14px] md:text-[16px] lg:text-[22px] font-semibold">
                    {cat.label}
                  </p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={cat.to}
              className="relative overflow-hidden rounded-2xl group"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="min-w-auto h-[250px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <div className="text-white">
                  <p className="text-[10px] font-medium uppercase tracking-wider bg-white text-black px-1 py-0.5 inline-block rounded-sm mb-1">
                    {cat.subLabel}
                  </p>
                  <p className="text-sm font-semibold">{cat.label}</p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourCategories;
