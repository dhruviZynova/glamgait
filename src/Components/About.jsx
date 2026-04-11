import React from "react";
import leftlight from "../assets/leftlight.png";
import rightlight from "../assets/rightlight.png";

const About = () => {
  return (
    <div className="relative bg-[#f3f0ed] min-h-screen flex justify-center sm:py-16 py-4 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Decorative Images */}
      <img
        src={leftlight}
        alt="decorator"
        className="hidden sm:block absolute top-0 right-24 w-16 md:w-20 opacity-100 pointer-events-none"
      />
      <img
        src={leftlight}
        alt="decorator"
        className="hidden sm:block absolute top-0 right-48 w-16 md:w-16 opacity-100 pointer-events-none"
      />
      <img
        src={leftlight}
        alt="decorator"
        className="hidden sm:block absolute top-0 left-24 w-16 md:w-20 opacity-100 pointer-events-none"
      />
      <img
        src={leftlight}
        alt="decorator"
        className="hidden sm:block absolute top-0 left-48 w-16 md:w-16 opacity-100 pointer-events-none"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl w-full">
        <h1 className="text-2xl md:text-4xl font-bold text-[#00382e] text-center mb-6">
          About Us
        </h1>

        <p className="text-gray-700 leading-relaxed text-sm md:text-base text-justify">
          <strong className="text-[#00382e] text-lg">About Glamgait</strong>
          <br />
          Glamgait develops newborn and baby photography props based on the
          specific needs of today’s photo professionals. We take pride in
          offering friendly and prompt customer service, and we value feedback
          from our clients. Our brand stands apart through its unique mission
          and exceptional products designed exclusively for newborn and
          maternity photographers.
          <br />
          <br />
          <strong className="text-[#00382e] text-lg">Our Company</strong>
          <br />
          Glamgait is a pioneering force in producing premium baby photography
          props and creative accessories that are rarely found elsewhere.
          Established in January 2020 with a small offline store in Surat,
          India, we have now expanded into a strong online presence, reaching
          photographers across the globe — one artist at a time.
          <br />
          <br />
          Run by passionate and creative individuals, Glamgait is committed to
          delivering unique props that help photographers bring their artistic
          vision to life. Our in-house designers work continuously to create
          trending, innovative concepts that allow photographers to capture
          magical and unforgettable memories. This makes our brand both
          exclusive and distinct in the industry.
          <br />
          <br />
          <strong className="text-[#00382e] text-lg">Our Mission</strong>
          <br />
          Our mission is to develop and manufacture high-quality, cruelty-free
          baby photography props that cannot be found anywhere else — while
          providing exceptional, personalized service to our customers.
          <br />
          <br />
          To fulfill this mission, we focus on delivering the following:
          <br />
          • Competitively priced and superior-quality products
          <br />
          • First-class customer service with fast shipping
          <br />
          • Use of the highest-quality, animal-friendly raw materials
          <br />
          • Durable, long-lasting products designed for years of professional
          use
          <br />
          <br />
          At Glamgait, we don’t just sell props — we help photographers create
          memories that last forever.
        </p>
      </div>
    </div>
  );
};

export default About;
