import React, { useState } from "react";
import { RefreshCw, XCircle, AlertTriangle, CheckCircle2, ShieldCheck, Mail, Info, CreditCard } from "lucide-react";

const RefundPolicy = () => {
  const [activeSection, setActiveSection] = useState("cancellation");

  const sections = [
    { id: "cancellation", title: "Cancellation Policy", icon: <XCircle className="w-5 h-5" /> },
    { id: "refunds", title: "Refund Policy", icon: <CreditCard className="w-5 h-5" /> },
    { id: "replacements", title: "Replacement Process", icon: <RefreshCw className="w-5 h-5" /> },
    { id: "not-accepted", title: "Non-Returnable Items", icon: <AlertTriangle className="w-5 h-5" /> },
    { id: "returns", title: "Returns Policy", icon: <CheckCircle2 className="w-5 h-5" /> },
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
      <div className="bg-[#1F352F] py-20 px-2 md:px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F3F0ED] rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[Judson]">Refund & Returns</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[#F3F0ED]/80 text-sm">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Buyer Protection
            </span>
            <span className="hidden sm:inline-block w-1 h-1 bg-white/30 rounded-full"></span>
            <span>Easy Replacements</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Navigation */}
          <aside className="lg:w-1/4">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 ml-4">Policy Sections</h3>
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

            <section id="cancellation" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <XCircle className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">CANCELLATION POLICY</h2>
              </div>
              <div className="space-y-4">
                <p>
                  We make every effort to fulfill all orders placed. However, please note that there may be certain orders that we are unable to process and must cancel due to limitations on quantities available, inaccuracies in product/pricing information, or fraud prevention.
                </p>
                <div className="p-4 md:p-6 bg-red-50 border-l-4 border-red-400 rounded-r-2xl">
                  <p className="text-red-800 text-sm">
                    Orders can only be cancelled if they have not been processed or shipped. Once an order enters the shipping phase (often within an hour), cancellation is no longer possible.
                  </p>
                </div>
              </div>
            </section>

            <section id="refunds" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <CreditCard className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">REFUND POLICY</h2>
              </div>
              <p>
                Once a purchase is made, it is considered final. We encourage customers to review their selections carefully. If a product arrives damaged or defective, please contact our support team immediately for a resolution.
              </p>
              <div className="flex items-start gap-3 p-4 bg-[#F3F0ED] rounded-xl text-sm border border-gray-200">
                <Info className="w-5 h-5 text-[#1F352F] shrink-0 mt-0.5" />
                <p>Shipping and COD fees are non-refundable in all cases.</p>
              </div>
            </section>

            <section id="replacements" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <RefreshCw className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">REPLACEMENT PROCESS</h2>
              </div>
              <div className="space-y-4">
                <p>For damaged or defective items, we offer a structured replacement process:</p>
                <ol className="space-y-4">
                  {[
                    "Contact support within 5-7 days of delivery with photo/video evidence.",
                    "Our team will assess the claim and guide you through the next steps.",
                    "If approved, return the item in its original packaging with all tags.",
                    "Once received and inspected, a replacement will be dispatched based on stock availability."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <span className="flex-shrink-0 w-8 h-8 bg-[#1F352F] text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </span>
                      <p className="text-sm self-center">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section id="not-accepted" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <AlertTriangle className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">NON-RETURNABLE CONDITIONS</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Products that are washed, worn, or damaged by use",
                  "Missing parts or accessories from the full set",
                  "Items not in their original condition/packaging",
                  "Individual items from a combo/set pack",
                  "Returns based solely on personal preference/dislike",
                  "Products damaged during improper handling by customer"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-red-50/30 rounded-xl text-sm border border-red-100/50">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section id="returns" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">RETURNS LOGISTICS</h2>
              </div>
              <div className="space-y-4">
                <p>
                  The entire returns process typically takes 6-8 business days. We request your patience as we ensure the quality of returned goods.
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#1F352F] shrink-0 mt-0.5" />
                    <span>Reverse pickup is arranged within 3-6 business days in eligible cases.</span>
                  </li>
                  <li className="flex gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#1F352F] shrink-0 mt-0.5" />
                    <span>If you self-ship, we refund courier charges up to ₹120 (with receipt).</span>
                  </li>
                </ul>
              </div>
            </section>

            <section id="contact" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900 text-left">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Mail className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">NEED ASSISTANCE?</h2>
              </div>
              <div className="bg-[#1F352F] text-white p-4 py-8 md:p-8 rounded-3xl text-center shadow-xl">
                <p className="mb-6 opacity-90 text-sm md:text-base">Our support team is ready to help with your return or exchange.</p>
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

export default RefundPolicy;
