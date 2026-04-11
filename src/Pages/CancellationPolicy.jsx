import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center text-justify">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-black">Cancellation Policy</h1>
        </div>
        <div className="space-y-8 text-sm text-gray-700">
          <section>
            <h2 className="text-3xl font-semibold text-black">CANCELLATIONS POLICY</h2>
            <p className="mt-2">If unfortunately you have to cancel an order, please do so within 24 hours of placing the order by contacting us at help@glamgait.in</p>
            <ol className="list-decimal list-inside mt-2 space-y-2">
              <li>if you cancel your order within 24 hours, we will refund the full amount to the card used for making the payment.</li>
              <li>No request for cancellation will be entertained after 24 hours of placing the order.</li>
            </ol>
            <p className="mt-2">The customer agrees not to dispute the decision made by Glamgait and accept The Glamgait decision regarding the cancellation.</p>
            <p className="mt-2">In case prepaid package is accepted by customer and returned to Glamgait by courier company, it can only be refunded after deduction of Rs.200 as shipping charges.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;