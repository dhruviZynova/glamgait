import React, { useState } from "react";
import { Shield, Lock, Eye, FileText, Database, UserCheck, Bell, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("collection");

  const sections = [
    { id: "collection", title: "Information Collection", icon: <Database className="w-5 h-5" /> },
    { id: "cookies", title: "Cookies & Tracking", icon: <Eye className="w-5 h-5" /> },
    { id: "usage", title: "How We Use Data", icon: <FileText className="w-5 h-5" /> },
    { id: "sharing", title: "Sharing Information", icon: <UserCheck className="w-5 h-5" /> },
    { id: "optout", title: "Your Choices", icon: <Lock className="w-5 h-5" /> },
    { id: "rights", title: "Your Rights", icon: <Shield className="w-5 h-5" /> },
    { id: "contact", title: "Contact Us", icon: <Mail className="w-5 h-5" /> },
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[Judson]">Privacy Policy</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[#F3F0ED]/80 text-sm">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Secure & Private
            </span>
            <span className="hidden sm:inline-block w-1 h-1 bg-white/30 rounded-full"></span>
            <span>Last updated: June 27, 2025</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Navigation */}
          <aside className="lg:w-1/4">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 ml-4">Contents</h3>
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

            <section id="collection" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Database className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold font-[Judson]">PERSONAL INFORMATION WE COLLECT</h2>
              </div>
              <div className="space-y-4">
                <p>
                  When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. We may also collect information about you through social media sites you use to access our Site depending the permissions you have given for access to your information.
                </p>
                <p>
                  Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information.”
                </p>
              </div>
            </section>

            <section id="cookies" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Eye className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold font-[Judson]">COOKIES & OTHER TRACKING TECHNOLOGIES</h2>
              </div>
              <div className="space-y-6">
                <p>We and our service providers use cookies, beacons & embedded scripts in connection with the Sites.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Cookies", desc: "Data files placed on your device to remember settings and market products." },
                    { title: "Log Files", desc: "Track actions occurring on the Site like IP address and browser type." },
                    { title: "Web Beacons", desc: "Electronic files used to record information about how you browse." },
                    { title: "Embedded Scripts", desc: "Temporary code to collect information about link interactions." }
                  ].map((item, i) => (
                    <div key={i} className="p-4 md:p-6 bg-[#FDFCFB] rounded-2xl border border-gray-100 hover:border-[#1F352F]/20 transition-colors">
                      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="usage" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <FileText className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold font-[Judson]">HOW DO WE USE YOUR PERSONAL INFORMATION?</h2>
              </div>
              <div className="space-y-4 bg-gray-50 p-4 md:p-8 rounded-3xl border border-dashed border-gray-200">
                <ul className="grid md:grid-cols-2 gap-x-12 gap-y-4 list-none">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-[#1F352F] rounded-full mt-2.5"></div>
                    <p>Fulfill orders placed through the Site</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-[#1F352F] rounded-full mt-2.5"></div>
                    <p>Screen orders for potential risk or fraud</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-[#1F352F] rounded-full mt-2.5"></div>
                    <p>Provide information/advertising based on preferences</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-[#1F352F] rounded-full mt-2.5"></div>
                    <p>Improve and optimize our Site experience</p>
                  </li>
                </ul>
              </div>
            </section>

            <section id="sharing" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <UserCheck className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold font-[Judson]">SHARING YOUR PERSONAL INFORMATION</h2>
              </div>
              <p>
                We may share your Personal Information with third parties as described in this Privacy Policy or otherwise with your permission. We reserve the right to transfer data, including aggregate and de-identified data derived from Personal Information, for lawful purposes in our discretion.
              </p>
              <div className="prose prose-sm text-gray-600 max-w-none">
                <p><strong>Service Providers:</strong> We hire other companies to perform certain business-related functions like mailing information and hosting services.</p>
                <p><strong>Legal Requirements:</strong> We may share information to comply with applicable laws and regulations or to protect our rights.</p>
              </div>
            </section>

            <section id="optout" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Lock className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold font-[Judson]">OUR OPT-OUT POLICY</h2>
              </div>
              <p>You can opt out of targeted advertising by visiting these platforms:</p>
              <div className="flex flex-wrap gap-4">
                {["Facebook", "Google", "Bing"].map((plat) => (
                  <button key={plat} className="px-6 py-2 bg-gray-100 hover:bg-[#1F352F] hover:text-white rounded-full text-sm transition-all">
                    {plat} Settings
                  </button>
                ))}
              </div>
            </section>

            <section id="rights" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Shield className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold font-[Judson]">YOUR DATA RIGHTS</h2>
              </div>
              <p>
                If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted.
              </p>
            </section>

            <section id="contact" className="space-y-6 scroll-mt-32">
              <div className="flex items-center gap-4 text-gray-900">
                <div className="p-3 bg-[#F3F0ED] rounded-2xl">
                  <Mail className="w-6 h-6 text-[#1F352F]" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold font-[Judson]">CONTACT US</h2>
              </div>
              <div className="bg-[#1F352F] text-white p-4 py-8 md:p-8 rounded-3xl text-center shadow-xl">
                <p className="mb-6 opacity-90 text-sm md:text-base">Questions about our privacy practices? Our team is here to help.</p>
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

export default PrivacyPolicy;

