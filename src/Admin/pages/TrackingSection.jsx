// const TrackingSection = ({ trackingData }) => {
//   if (!trackingData || Object.keys(trackingData).length === 0) {
//     return (
//       <div className="p-6 bg-white rounded-xl shadow border text-center">
//         <p className="text-gray-500">No tracking data available</p>
//       </div>
//     );
//   }

import { FaTruck } from "react-icons/fa";

//   return (
//     <div className="bg-white p-6 rounded-xl shadow border">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-bold text-gray-800">Order Tracking</h2>
//           <p className="text-sm text-gray-500">{trackingData.status_name}</p>
//         </div>

//         {/* LOGO */}
//         <img
//           src="/tracking-logo.png"   // ← apna logo yaha daal
//           alt="Courier Logo"
//           className="w-20 object-contain"
//         />
//       </div>

//       {/* ORDER INFO */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
//         <p><strong>Order No:</strong> {trackingData.order_no}</p>
//         <p><strong>AWB Number:</strong> {trackingData.awb_number}</p>
//         <p><strong>Customer:</strong> {trackingData.name}</p>
//         <p><strong>Mobile:</strong> {trackingData.mobile_no}</p>
//         <p><strong>City:</strong> {trackingData.city}</p>
//         <p><strong>Pincode:</strong> {trackingData.pincode}</p>
//         <p><strong>Product Value:</strong> ₹{trackingData.product_value}</p>
//         <p><strong>COD Amount:</strong> ₹{trackingData.cod_amount}</p>
//       </div>

//       {/* ADDRESS */}
//       <div className="mb-6 p-4 bg-gray-50 border rounded-xl">
//         <h3 className="font-semibold mb-2">Shipping Address</h3>
//         <p>{trackingData.address_1}</p>
//         {trackingData.address_2 && <p>{trackingData.address_2}</p>}
//         <p>{trackingData.city}, {trackingData.state} - {trackingData.pincode}</p>
//         <p><strong>Landmark:</strong> {trackingData.landmark}</p>
//       </div>

//       {/* TRACKING TIMELINE */}
//       <div>
//         <h3 className="font-semibold mb-4 text-lg">Tracking Timeline</h3>

//         <div className="space-y-4">
//           {trackingData.tracking_detail?.map((t, index) => (
//             <div key={index} className="flex gap-4 items-start">
//               <div className="w-3 h-3 mt-1 bg-blue-500 rounded-full"></div>

//               <div className="flex-1">
//                 <p className="font-medium text-gray-800">{t.scan}</p>
//                 <p className="text-sm text-gray-600">{t.location}</p>
//                 <p className="text-xs text-gray-500">
//                   {t.scan_date_time}
//                 </p>
//                 {t.remark && (
//                   <p className="text-xs text-gray-600 italic mt-1">
//                     Remark: {t.remark}
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrackingSection;

const TrackingSection = ({ trackingData }) => {
  // Agar data hi nahi toh kuch mat dikha
  if (!trackingData || !trackingData.tracking_detail || trackingData.tracking_detail.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 text-center">
        <FaTruck className="mx-auto text-5xl text-gray-400 mb-4" />
        <p className="text-gray-600 font-medium">Tracking information will appear once the order is shipped</p>
      </div>
    );
  }

  // Latest scan (for current status highlight)
  const latestScan = trackingData.tracking_detail[0]; // assuming latest first (ExpressFly usually sends latest first)
  const isDelivered = latestScan?.scan?.toLowerCase().includes("delivered");

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Header with Status Badge */}
      <div className={`p-5 ${isDelivered ? "bg-green-600" : "bg-indigo-600"} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Order Tracking</h2>
            <p className="text-lg opacity-90">{latestScan.scan}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">AWB: {trackingData.awb_number}</p>
            <p className="text-sm opacity-80">Order: #{trackingData.order_no}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Customer Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
          <div>
            <p className="text-gray-500">Customer</p>
            <p className="font-semibold">{trackingData.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Mobile</p>
            <p className="font-semibold">{trackingData.mobile_no}</p>
          </div>
          <div>
            <p className="text-gray-500">City</p>
            <p className="font-semibold">{trackingData.city}</p>
          </div>
          <div>
            <p className="text-gray-500">COD</p>
            <p className="font-bold text-green-600">₹{trackingData.cod_amount || 0}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-50 p-5 rounded-xl mb-6 border">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            Shipping Address
          </h3>
          <p className="text-gray-700">
            {trackingData.address_1}
            {trackingData.address_2 && `, ${trackingData.address_2}`}
          </p>
          <p className="text-gray-700 font-medium">
            {trackingData.city}, {trackingData.state} - {trackingData.pincode}
          </p>
          {trackingData.landmark && (
            <p className="text-sm text-gray-600 mt-1">Landmark: {trackingData.landmark}</p>
          )}
        </div>

        {/* Tracking Timeline - Amazon Style */}
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-5">Journey So Far</h3>
          <div className="space-y-5">
            {trackingData.tracking_detail.map((t, index) => {
              const isLatest = index === 0;
              const isDeliveredScan = t.scan.toLowerCase().includes("delivered");

              return (
                <div
                  key={index}
                  className={`flex gap-4 pb-5 border-l-4 ${
                    isLatest
                      ? "border-green-500 bg-green-50 pl-4 rounded-l-lg"
                      : "border-gray-300 pl-4"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                        isDeliveredScan
                          ? "bg-green-600"
                          : isLatest
                          ? "bg-indigo-600"
                          : "bg-gray-400"
                      }`}
                    >
                      {isDeliveredScan ? "Check" : index + 1}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold ${isLatest ? "text-indigo-700" : "text-gray-800"}`}>
                        {t.scan}
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {new Date(t.scan_date_time).toLocaleDateString("en-IN")} •{" "}
                        {new Date(t.scan_date_time).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{t.location}</p>
                    {t.remark && (
                      <p className="text-sm italic text-orange-700 bg-orange-50 px-3 py-1 rounded mt-2 inline-block">
                        {t.remark}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingSection;