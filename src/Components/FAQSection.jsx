import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import faqbgimg from '../assets/images/faqbgimg.webp';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className={`border border-gray-300 rounded-2xl mb-4 overflow-hidden transition-all duration-300 bg-[#ffffffcc]`}>
            <button
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                onClick={onClick}
            >
                <span className="text-[#333333] font-Montserrat font-medium text-base md:text-lg pr-4">
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
            </button>
            <div
                className={`px-6 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
            >
                <p className="text-gray-600 font-Montserrat text-sm md:text-base leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major debit and credit cards, UPI, Net Banking, and secure wallet payments. Cash on Delivery (COD) is available on selected pin codes across India."
        },
        {
            question: "How long does delivery take?",
            answer: "Orders are usually delivered within 3–7 business days depending on your location. You will receive a tracking link once your order is shipped."
        },
        {
            question: "Do you offer Cash on Delivery (COD)?",
            answer: "Yes, COD is available for most locations in India. Availability will be confirmed at checkout after entering your pin code."
        },
        {
            question: "Can I return or exchange a product?",
            answer: "Yes, we offer easy returns and exchanges within 7 days of delivery. The product must be unused, unwashed, and in original packaging with tags intact."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you will receive an SMS/email with a tracking link. You can also track your order from the “My Orders” section in your account."
        },
        {
            question: "What if I receive a damaged or wrong product?",
            answer: "If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery with product images. We will arrange a replacement or refund."
        },
        {
            question: "Are the colors of products exactly the same as shown?",
            answer: "We try our best to display accurate colors. However, slight variations may occur due to screen resolution and lighting during photography."
        },
        {
            question: "Do you offer customization or stitching services?",
            answer: "Yes, we provide stitching/customization services for selected products. You can check the product page for customization options before placing your order."
        },
        {
            question: "Is my payment information secure?",
            answer: "Absolutely. All transactions are processed through secure payment gateways with encrypted protection to ensure complete safety."
        }
    ];

    return (
        <section className="py-6 md:py-16 px-4 md:px-10 lg:px-20 relative overflow-hidden">
            {/* Illustration Image */}
            {/* <div className="relative mt-8 lg:mt-16 flex justify-center lg:justify-start"> */}
            <img
                src={faqbgimg}
                alt="FAQ Illustration"
                className="absolute bottom-0 left-0 z-[-1] w-full max-w-[450px] object-contain"
                loading="lazy"
            />
            {/* </div> */}

            <div className="mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
                {/* Left Side Content */}
                <div className="w-full lg:w-[40%] space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-['Oxygen'] font-bold font-700">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-[#666666] font-['Oxygen'] font-400 text-base max-w-md leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet.
                        </p>
                    </div>
                </div>

                {/* Right Side Accordion */}
                <div className="w-full lg:w-[60%]">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
