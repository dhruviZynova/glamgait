import { X } from "lucide-react";
import img1 from "../assets/Group1702127085.png";
import img2 from "../assets/Group1702127084.png";

const ReturnsDetails = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* ❌ Close Icon */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {/* 🧾 Icons Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex flex-col items-center">
            <img
              src={img1}
              alt="Return"
              className="w-12 h-12"
            />
            <p className="text-center text-sm font-medium mt-2">
              Return within 7 days
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={img2}
              alt="Exchange"
              className="w-12 h-12 grayscale"
            />
            <p className="text-center text-sm font-medium mt-2 text-gray-500 line-through">
              Exchange within 7 days
            </p>
          </div>
        </div>

        {/* 🧾 Conditions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">
            What are the conditions for return/exchange?
          </h2>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✔️</span> Wrong/Damaged Items
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✔️</span> Quality Issue
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-2">✔️</span> Did not like the
              product
            </li>
          </ul>
        </div>

        {/* 🧾 Steps */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">How to place a return?</h2>
          <ol className="relative border-l border-green-400 space-y-6 text-sm pl-5">
            <li className="ml-3">
              <div className="absolute w-3 h-3 bg-green-500 rounded-full left-[-6px] top-[6px]" />
              <p className="font-medium">Select a method</p>
              <p className="text-gray-600">
                Go to My orders → Order Details → Return
              </p>
            </li>
            <li className="ml-3">
              <div className="absolute w-3 h-3 bg-green-500 rounded-full left-[-6px] top-[6px]" />
              <p className="font-medium">Submit return request</p>
              <ul className="text-gray-600 list-disc ml-5">
                <li>Submit the reason</li>
                <li>Submit Product Images and Unboxing Video.</li>
              </ul>
            </li>
            <li className="ml-3">
              <div className="absolute w-3 h-3 bg-green-500 rounded-full left-[-6px] top-[6px]" />
              <p className="font-medium">Product pickup</p>
              <p className="text-gray-600">
                The product will be picked up only if it is found to be in
                original condition with tags and packaging
              </p>
            </li>
            <li className="ml-3">
              <div className="absolute w-3 h-3 bg-green-500 rounded-full left-[-6px] top-[6px]" />
              <p className="font-medium">Return</p>
              <p className="text-gray-600">
                Refund will be initiated after the product is received and
                verified by us
              </p>
            </li>
          </ol>
        </div>

        {/* 🧾 Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-[#02382A] text-white w-full py-3 rounded font-semibold cursor-pointer"
          >
            OKAY, GO BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnsDetails;