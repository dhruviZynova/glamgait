import React, { useState } from "react";
import { Truck, Package, Clock, ShieldCheck, MapPin, Mail, Info, Globe } from "lucide-react";

const ShippingPolicy = () => {
  const [activeSection, setActiveSection] = useState("commitment");

  const sections = [
    { id: "commitment", title: "Our Commitment", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: "charges", title: "Delivery Charges", icon: <Package className="w-5 h-5" /> },
    { id: "timeline", title: "Delivery Timeline", icon: <Clock className="w-5 h-5" /> },
    { id: "domestic", title: "Shipping in India", icon: <MapPin className="w-5 h-5" /> },
    { id: "lost", title: "Lost in Transit", icon: <Info className="w-5 h-5" /> },
    { id: "contact", title: "Support", icon: <Mail className="w-5 h-5" /> },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Header */}
      <div className="bg-[#1F352F] py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F3F0ED] rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[Judson]">Shipping Policy</h1>
          <div className="flex items-center justify-center gap-4 text-[#F3F0ED]/80 text-sm">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" /> Pan-India Delivery
            </span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span>Free Shipping Nationwide</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Navigation */}
          <aside className="lg:w-1/4">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 ml-4">Information</h3>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeSection === section.id
                    ? "bg-[#1F352F] text-white shadow-lg translate-x-2"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-16 leading-relaxed text-gray-600">

            <section id="commitment" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">OUR COMMITMENT</h2>
              </div>
              <p className="text-lg">
                We are committed to delivering your order accurately, in good condition, and always on time. We believe in express shipping and most of your orders are shipped within 24 hours of placement, excluding weekends and public holidays.
              </p>
            </section>

            <section id="charges" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Package className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">DELIVERY CHARGES</h2>
              </div>
              <div className="bg-[#1F352F]/5 p-8 rounded-3xl border border-[#1F352F]/10">
                <p className="text-xl font-medium text-[#1F352F] text-center italic">
                  "We are proud to offer 100% Free Shipping on all orders across India."
                </p>
              </div>
            </section>

            <section id="timeline" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Clock className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">ESTIMATED DELIVERY TIME</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Cut-off Time", value: "6:00 PM IST", desc: "For same-day processing" },
                  { title: "Processing", value: "1-2 Days", desc: "Monday – Saturday" },
                  { title: "Transit Time", value: "3-7 Days", desc: "Dependant on location" }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{item.title}</h4>
                    <p className="text-2xl font-bold text-[#1F352F] mb-1">{item.value}</p>
                    <p className="text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="domestic" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <MapPin className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">SHIPPING IN INDIA</h2>
              </div>
              <p>
                We deliver to all locations across India. To maintain the highest service levels, we partner with reputed courier services including Ecom Express, Delhivery, Shadowfax, and Speed Post.
              </p>
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl text-amber-800 text-sm border border-amber-100">
                <Info className="w-5 h-5 shrink-0" />
                <p>Please note: We do not ship internationally at this time.</p>
              </div>
            </section>

            <section id="lost" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Globe className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">LOST IN TRANSIT</h2>
              </div>
              <p>
                If a shipment is lost in transit, we wait for 15 days to confirm the status with our courier partners and then reprocess/reship the order at no additional cost to you.
              </p>
            </section>

            <section id="contact" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Mail className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">SHIPPING SUPPORT</h2>
              </div>
              <div className="bg-[#1F352F] text-white p-8 rounded-3xl text-center shadow-xl">
                <p className="mb-6 opacity-90">Have questions about your delivery status?</p>
                <a href="mailto:support@kundrat.com" className="inline-block px-8 py-4 bg-white text-[#1F352F] rounded-full font-bold hover:scale-105 transition-transform">
                  support@kundrat.com
                </a>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
