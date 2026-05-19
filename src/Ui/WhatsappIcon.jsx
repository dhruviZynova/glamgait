import React from "react";
import whatsapp from "../assets/whatsapp.png"; // Adjust path as needed

const WhatsAppIcon = () => {
  const phoneNumber = "1234567890"; // Replace with your number
  const message = "Hello! I would like to chat with you."; // Optional
  const encodedMessage = encodeURIComponent(message);

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-16 md:fixed md:bottom-6 right-6 z-50"
      aria-label="Chat on WhatsApp"
    >
      <img
        src={whatsapp}
        alt="WhatsApp Chat"
        className="w-10 h-10 hover:scale-110 transition-transform duration-300 rounded-full"
      />
    </a>
  );
};

export default WhatsAppIcon;
