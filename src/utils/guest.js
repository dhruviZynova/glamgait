// utils/guest.js
export const getGuestId = () => {
  let guestId = localStorage.getItem("guest_id");
  if (!guestId) {
    guestId = "guest_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    localStorage.setItem("guest_id", guestId);
  }
  return guestId;
};
