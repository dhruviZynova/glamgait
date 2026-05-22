import React, { useState } from "react";
import { XCircle, Clock, CreditCard, ShieldAlert, Mail, Info, CheckCircle2 } from "lucide-react";

const CancellationPolicy = () => {
  const [activeSection, setActiveSection] = useState("general");

  const sections = [
    { id: "general", title: "General Policy", icon: <Info className="w-5 h-5" /> },
    { id: "timeframe", title: "Cancellation Window", icon: <Clock className="w-5 h-5" /> },
    { id: "refunds", title: "Refund Process", icon: <CreditCard className="w-5 h-5" /> },
    { id: "returns", title: "Failed Deliveries", icon: <ShieldAlert className="w-5 h-5" /> },
    { id: "contact", title: "Contact Support", icon: <Mail className="w-5 h-5" /> },
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
      <div className="bg-[#1F352F] py-20 px-2 md:px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F3F0ED] rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[Judson]">Cancellation Policy</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[#F3F0ED]/80 text-sm">
            <span className="flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Hassle-Free Cancellation
            </span>
            <span className="hidden sm:inline-block w-1 h-1 bg-white/30 rounded-full"></span>
            <span>24-Hour Window</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Navigation */}
          <aside className="lg:w-1/4">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 ml-4">Policy Contents</h3>
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
          <main className="lg:w-3/4 bg-white rounded-3xl p-4 md:p-12 shadow-sm border border-gray-100 space-y-16 leading-relaxed text-gray-600">

            <section id="general" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Info className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">GENERAL POLICY</h2>
              </div>
              <p className="text-lg">
                At Kundrat, we understand that plans can change. If you unfortunately have to cancel an order, we provide a streamlined process to help you do so quickly and efficiently.
              </p>
            </section>

            <section id="timeframe" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Clock className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">CANCELLATION WINDOW</h2>
              </div>
              <div className="bg-[#1F352F]/5 p-4 md:p-8 rounded-3xl border border-[#1F352F]/10 space-y-4">
                <p className="font-medium text-[#1F352F] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Please request cancellation within 24 hours of placing the order.
                </p>
                <div className="p-4 bg-white rounded-xl border border-gray-100 text-sm">
                  <p>
                    No requests for cancellation will be entertained after 24 hours of placing the order, as the shipment process usually begins after this period.
                  </p>
                </div>
              </div>
            </section>

            <section id="refunds" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <CreditCard className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">REFUND PROCESS</h2>
              </div>
              <p>
                If you cancel your order within the 24-hour window, we will initiate a full refund. The amount will be credited back to the original payment method used (Card, UPI, or Wallet) within standard banking timelines.
              </p>
            </section>

            <section id="returns" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <ShieldAlert className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">FAILED DELIVERIES</h2>
              </div>
              <p>
                In cases where a prepaid package is not accepted by the customer and is returned to Kundrat by the courier company (Return to Origin), the refund will be processed after a deduction of ₹200 as shipping and handling charges.
              </p>
            </section>

            <section id="contact" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Mail className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">CONTACT FOR CANCELLATION</h2>
              </div>
              <div className="bg-[#1F352F] text-white p-4 py-8 md:p-8 rounded-3xl text-center shadow-xl">
                <p className="mb-6 opacity-90 text-sm md:text-base">To cancel your order, please email us with your Order ID:</p>
                <a href="mailto:support@kundrat.com" className="inline-flex items-center gap-2 px-4 md:px-8 py-3 md:py-4 bg-white text-[#1F352F] rounded-full font-bold hover:scale-105 transition-transform text-sm md:text-base shadow-lg">
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
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

export default CancellationPolicy;