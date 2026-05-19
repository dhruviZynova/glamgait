import React, { useEffect } from "react";
import {
  Heart,
  Award,
  Users,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Globe,
  CheckCircle
} from "lucide-react";
import "../style/About.css";

// Importing assets
// import leftlight from "../assets/leftlight.png";
// import rightlight from "../assets/rightlight.png";
import aboutHeroNew from "../assets/images/indian_muslim_fashion_banner.png";
import storyImg from "../assets/hero1.jpg";
import pattern from "../assets/pattern.png";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Fabrics",
      description: "We source only the finest, breathable fabrics to ensure comfort and elegance in every garment we craft."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Modern Modesty",
      description: "Our designs blend traditional modest values with contemporary fashion trends for the modern woman."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Artisanal Quality",
      description: "Every Niqab, Burqa, and Saree is meticulously inspected to meet our high standards of craftsmanship."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Ethical Fashion",
      description: "Established in 2020, we prioritize ethical production and transparent service for our global community."
    }
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero" style={{ backgroundImage: `url(${aboutHeroNew})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-subtitle">Redefining Modesty</span>
          <h1 className="hero-title">Elegance in <br /> Every Fold</h1>
        </div>

        {/* Floating Decorators */}
        {/* <img src={leftlight} alt="" className="floating-decorator decorator-1" /> */}
        {/* <img src={rightlight} alt="" className="floating-decorator decorator-2" /> */}
      </section>

      {/* Brand Story Section */}
      <section className="about-section">
        <div className="section-grid">
          <div className="image-container animate-fadeIn">
            <img src={storyImg} alt="Kundrat Fashion" />
          </div>
          <div className="content-area">
            <span className="content-label">Our Story</span>
            <h2 className="content-title">Empowering Women Through Modest Fashion.</h2>
            <p className="content-text">
              Kundrat was born in January 2020 with a singular vision: to create a sanctuary where modesty meets high-end fashion.
              What started as a small boutique in <strong>Surat, India</strong>, has grown into a global destination for
              women who refuse to compromise on their values or their style.
              <br /><br />
              We specialize in premium Niqabs, Burqas, Sarees, and ethnic wear that celebrate the beauty of modesty.
              Our brand stands for sophistication, quality, and the empowerment of every woman to express her unique
              identity through timeless designs.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section bg-white/50">
        <div className="text-center mb-16">
          <span className="content-label">Our Philosophy</span>
          <h2 className="content-title">Crafting a New Standard</h2>
        </div>

        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">
                {value.icon}
              </div>
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Legacy/Stats Section */}
      <section className="legacy-section">
        <img src={pattern} alt="" className="legacy-bg-pattern" />
        <div className="legacy-content">
          <h2 className="content-title" style={{ color: 'white' }}>Our Global Reach</h2>
          <p className="content-text" style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '800px', margin: '0 auto' }}>
            From our roots in Surat to shipping across the globe, Kundrat has become a trusted name in modest wear.
            We take pride in our heritage and the community we've built together.
          </p>

          <div className="legacy-stats">
            <div className="stat-item">
              <h3>2020</h3>
              <p>Founded</p>
            </div>
            <div className="stat-item">
              <h3>50k+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <h3>25+</h3>
              <p>Product Categories</p>
            </div>
            <div className="stat-item">
              <h3>Global</h3>
              <p>Shipping Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="about-section text-center">
        <div className="max-w-3xl mx-auto">
          <Heart className="w-12 h-12 text-[#00382e] mx-auto mb-6" />
          <h2 className="content-title">Our Mission</h2>
          <p className="content-text italic text-2xl font-serif">
            "To provide premium, stylish, and comfortable modest wear that empowers women to feel confident
            and beautiful while staying true to their values."
          </p>
          <div className="mt-12 flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-[#00382e] font-semibold">
              <ShoppingBag className="w-5 h-5" /> Curated Collection
            </div>
            <div className="flex items-center gap-2 text-[#00382e] font-semibold">
              <Globe className="w-5 h-5" /> Worldwide Delivery
            </div>
            <div className="flex items-center gap-2 text-[#00382e] font-semibold">
              <Users className="w-5 h-5" /> Customer Centric
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
