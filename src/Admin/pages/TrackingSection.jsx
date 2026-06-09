import { FaTruck } from "react-icons/fa";

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
                  className={`flex gap-4 pb-5 border-l-4 ${isLatest
                      ? "border-green-500 bg-green-50 pl-4 rounded-l-lg"
                      : "border-gray-300 pl-4"
                    }`}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${isDeliveredScan
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