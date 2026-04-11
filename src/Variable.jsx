/* eslint-disable react-refresh/only-export-components */
import toast from "react-hot-toast";

export const ApiURL = import.meta.env.VITE_APP_URL;
export const COURIER_URL = import.meta.env.VITE_COURIER_URL;


export const razorpayKEY = import.meta.env.VITE_RAZORPAY_KEY;
export const SecretKey = import.meta.env.VITE_APP_SECRET_KEY;

export const userInfo = () => {
  try {
    const userData = localStorage.getItem("GlamGait");
    if (userData) {
      const parsedData = JSON.parse(userData);
      
      // Return the structured user data with the specific fields
      return {
        name: parsedData.first_name && parsedData.last_name
          ? `${parsedData.first_name} ${parsedData.last_name}`
          : parsedData.name || parsedData.u_name || '',
        email: parsedData.email || '',
        auth_token: parsedData.token || parsedData.auth_token || '',
        token: parsedData.token || parsedData.auth_token || '',
        role: parsedData.role || '',
        u_id: parsedData.u_id || '',
        phone: parsedData.phone || '',
        // Include any other fields for backward compatibility
        ...parsedData
      };
    }
    return null;
  } catch (error) {
    console.log(error, "Error parsing UserData from Localstorage");
    return null;
  }
};

export const orderInfo = () => {
  try {
    const orderData = localStorage.getItem("OrderData");
    if (orderData) {
      return JSON.parse(orderData);
    }
    return null;
  } catch (error) {
    console.log(error, "Error parsing UserData from Localstorage");
    return null;
  }
};

export const showToaster = (status, description) => {
  if (status === 1) {
    toast.success(description, { autoClose: 3000 });
  } else {
    console.log(description, { autoClose: 3000 });
  }
};

export const validationFunction = {
  includes: (item) =>
    item == null || item === "" || item === undefined || item === "undefined",
};

export const getFullImageUrl = (imagePath, defaultFolder = "Category") => {
  if (!imagePath || typeof imagePath !== "string") return "";

  // If it's already a full URL or a local blob URL
  if (imagePath.startsWith("http") || imagePath.startsWith("blob:")) {
    return imagePath;
  }

  // If the path already contains /assets/
  if (imagePath.includes("/assets/")) {
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${ApiURL}${cleanPath}`;
  }

  // Otherwise, fallback to prepending the default folder
  return `${ApiURL}/assets/${defaultFolder}/${imagePath}`;
};

