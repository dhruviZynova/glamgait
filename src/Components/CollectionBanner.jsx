import React from 'react';

import img1 from '../assets/images/collection1.png';
import img2 from '../assets/images/collection2.png';
import img3 from '../assets/images/collection3.png';
import img4 from '../assets/images/collection4.png';

/*
  KEY CONCEPT:
  - `perspective` must be on the PARENT container (not inside each child's transform)
  - `transformOrigin: 'center center'` on each card = cards rotate around their center,
     with `translateY` creating a symmetrical arch effect.
*/

const cards = [
  {
    src: img1,
    alt: 'Traditional Elegance',
    label: 'Abaya Collection',
    rotateY: '25deg',
    scale: 1.05,
    translateY: '10px',
    translateX: '0px',
    z: 1
  },
  {
    src: img2,
    alt: 'Modern Style',
    label: 'Hijab Sets',
    rotateY: '8deg',
    scale: 0.95,
    translateY: '12px',
    translateX: '12px', // Pull towards center to close middle gap
    z: 2
  },
  {
    src: img3,
    alt: 'Casual Modesty',
    label: 'Prayer Wear',
    rotateY: '-8deg',
    scale: 0.95,
    translateY: '12px',
    translateX: '-12px', // Pull towards center to close middle gap
    z: 3
  },
  {
    src: img4,
    alt: 'Luxury Edit',
    label: 'Luxury Niqabs',
    rotateY: '-25deg',
    scale: 1.05,
    translateY: '10px',
    translateX: '0px',
    z: 4
  },
];

const CollectionBanner = () => {
  return (
    <section
      className="w-full py-6 md:py-16 overflow-hidden flex flex-col items-center px-2 md:px-8 xl:px-24"
    >
      {/* Header */}
      <div className="text-center mb-12 md:mb-20 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Judson'] font-bold font-700 text-[#000000] mb-4 leading-tight">
          Explore Our Latest Collections <br className="hidden sm:block" /> Designed For You
        </h2>
        <p className="text-[#767676] font-Poppins font-400 text-base max-w-2xl mx-auto">
          Discover our curated categories where timeless tradition meets contemporary style.
          Crafted with care for your everyday elegance.
        </p>
      </div>

      {/* ===== DESKTOP: perspective on parent, rotate from center ===== */}
      <div
        className="hidden md:flex w-full px-8 items-center justify-center"
        style={{
          perspective: '1400px',
          perspectiveOrigin: 'center center',
          gap: '12px',
        }}
      >
        {cards.map((card, i) => {
          const isFirst = i === 0;
          const isLast = i === cards.length - 1;
          const borderRadiusStyle = isFirst
            ? '20px 0 0 20px'
            : isLast
              ? '0 20px 20px 0'
              : '0';

          return (
            <div
              key={i}
              className="flex-1 group cursor-pointer transition-all duration-700 ease-in-out"
              style={{
                transform: `rotateY(${card.rotateY}) scale(${card.scale}) translateY(${card.translateY}) translateX(${card.translateX || '0px'})`,
                transformOrigin: 'center center',
                zIndex: card.z,
                position: 'relative',
              }}
            >
              <div
                className="overflow-hidden relative"
                style={{ borderRadius: borderRadiusStyle }}
              >
                <img
                  src={card.src}
                  alt={card.alt}
                  className="w-full object-cover block group-hover:scale-110 transition-transform duration-700"
                  style={{ aspectRatio: '3/4' }}
                />
                {/* Overlay with Label */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span className="text-white text-1xl md:text-2xl font-700 font-bold mb-2 font-Playfair Display transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 tracking-wide">
                    {card.label}
                  </span>
                  <button className="text-white/80 text-sm font-semibold uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    Shop Now <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== MOBILE: grid layout, all cards visible ===== */}
      <div className="grid md:hidden w-full px-4 gap-4 pb-6 grid-cols-1 sm:grid-cols-2">
        {cards.map((card, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden relative w-full"
          >
            <img
              src={card.src}
              alt={card.alt}
              className="w-full object-cover block"
              style={{ aspectRatio: '5/4' }}
            />
            {/* Mobile Label Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-transparent to-transparent flex flex-col justify-end p-5">
              <span className="text-white text-xl font-700 font-bold mb-2 font-Playfair Display">{card.label}</span>
              <span className="text-white/80 text-xs mt-1 uppercase tracking-wider">Shop Now</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionBanner;
