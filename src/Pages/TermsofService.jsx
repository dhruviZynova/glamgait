import React, { useState } from "react";
import { Scale, ShieldAlert, Ban, CreditCard, Globe, Info, Mail, CheckCircle2, AlertTriangle } from "lucide-react";

const TermsofService = () => {
  const [activeSection, setActiveSection] = useState("general");

  const sections = [
    { id: "general", title: "General Conditions", icon: <Info className="w-5 h-5" /> },
    { id: "store", title: "Online Store Terms", icon: <Globe className="w-5 h-5" /> },
    { id: "pricing", title: "Modifications & Prices", icon: <CreditCard className="w-5 h-5" /> },
    { id: "products", title: "Products & Services", icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: "billing", title: "Billing & Account", icon: <Scale className="w-5 h-5" /> },
    { id: "prohibited", title: "Prohibited Uses", icon: <Ban className="w-5 h-5" /> },
    { id: "liability", title: "Limitation of Liability", icon: <ShieldAlert className="w-5 h-5" /> },
    { id: "contact", title: "Contact Information", icon: <Mail className="w-5 h-5" /> },
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F3F0ED] rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[Judson]">Terms of Service</h1>
          <div className="flex items-center justify-center gap-4 text-[#F3F0ED]/80 text-sm">
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4" /> Legal Agreement
            </span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span>Last updated: June 27, 2025</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Navigation */}
          <aside className="lg:w-1/4">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 ml-4">Legal Sections</h3>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeSection === section.id
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
            
            <section id="general" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Info className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">OVERVIEW & GENERAL CONDITIONS</h2>
              </div>
              <div className="space-y-4">
                <p>
                  This website is operated by Glamgait. Throughout the site, the terms “we”, “us” and “our” refer to Glamgait. Glamgait offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                </p>
                <div className="p-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl">
                  <p className="text-amber-800 text-sm font-medium">
                    By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions.
                  </p>
                </div>
              </div>
            </section>

            <section id="store" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Globe className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">SECTION 1 – ONLINE STORE TERMS</h2>
              </div>
              <div className="space-y-4">
                <p>
                  By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
                </p>
                <ul className="list-none space-y-3">
                  {[
                    "No illegal or unauthorized use of products",
                    "Compliance with all jurisdictional laws",
                    "No transmission of worms or viruses"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-center text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#1F352F]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="pricing" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <CreditCard className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">SECTION 4 – MODIFICATIONS TO PRICES</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">Price Changes</h4>
                  <p className="text-sm">Prices for our products are subject to change without notice at any time.</p>
                </div>
                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-2">Service Continuity</h4>
                  <p className="text-sm">We reserve the right to modify or discontinue the Service without notice.</p>
                </div>
              </div>
            </section>

            <section id="products" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">SECTION 5 – PRODUCTS OR SERVICES</h2>
              </div>
              <p>
                Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
              </p>
              <div className="bg-[#1F352F]/5 p-8 rounded-3xl">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Color Disclaimer
                </h4>
                <p className="text-sm">We have made every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your monitor's display will be accurate.</p>
              </div>
            </section>

            <section id="billing" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Scale className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">SECTION 6 – BILLING ACCURACY</h2>
              </div>
              <p>
                We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
              </p>
            </section>

            <section id="prohibited" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Ban className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">SECTION 12 – PROHIBITED USES</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Unlawful purposes",
                  "Soliciting others for unlawful acts",
                  "Violating regulations & laws",
                  "Infringing intellectual property",
                  "Harassment or discrimination",
                  "Submitting false information",
                  "Uploading viruses or malware",
                  "Collecting personal data of others"
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-red-50/30 rounded-xl text-sm border border-red-100/50">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section id="liability" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <ShieldAlert className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">SECTION 13 – LIMITATION OF LIABILITY</h2>
              </div>
              <p className="italic">
                "We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free."
              </p>
              <p>
                In no case shall Glamgait, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
              </p>
            </section>

            <section id="contact" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Mail className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-[Judson]">CONTACT INFORMATION</h2>
              </div>
              <div className="bg-[#1F352F] text-white p-8 rounded-3xl text-center shadow-xl">
                <p className="mb-6 opacity-90">Questions about the Terms of Service should be sent to our support team.</p>
                <a href="mailto:support@glamgait.com" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1F352F] rounded-full font-bold hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                  support@glamgait.com
                </a>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsofService;

