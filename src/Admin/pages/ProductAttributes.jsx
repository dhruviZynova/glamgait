import { useState } from "react";
import Fabrics from "./Fabric";
import Occasions from "./Occasion";
import Works from "./Works";
import {
  ArrowLeftIcon,
  SwatchIcon,
  SparklesIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import Styles from "./Style";

const ProductAttributes = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      name: "Fabrics",
      component: <Fabrics />,
      icon: <SwatchIcon className="h-8 w-8 text-gray-600" />,
      description: "Manage fabric types for sarees",
    },
    {
      name: "Works",
      component: <Works />,
      icon: <SparklesIcon className="h-8 w-8 text-gray-600" />,
      description: "Manage work styles and patterns",
    },
    {
      name: "Occasions",
      component: <Occasions />,
      icon: <CalendarIcon className="h-8 w-8 text-gray-600" />,
      description: "Manage occasions for sarees",
    },
    {
      name: "Style",
      component: <Styles />,
      icon: <SwatchIcon className="h-8 w-8 text-gray-600" />,
      description: "Manage Styles types for sarees",
    },
  ];

  const handleSectionClick = (sectionName) => {
    setActiveSection(sectionName);
  };

  const handleBackClick = () => {
    setActiveSection(null);
  };

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Product Attributes
      </h1>
      {activeSection ? (
        <div>
          <button
            onClick={handleBackClick}
            className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 cursor-pointer"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Attributes</span>
          </button>
          {
            sections.find((section) => section.name === activeSection)
              ?.component
          }
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <button
              key={section.name}
              onClick={() => handleSectionClick(section.name)}
              className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-200">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {section.name}
                </h2>
                <p className="text-sm text-gray-500 text-center">
                  {section.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductAttributes;
