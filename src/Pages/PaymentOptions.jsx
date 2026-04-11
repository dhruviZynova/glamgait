import React from "react";

const PaymentOptions = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center text-justify">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-black">Payment Options</h1>
          <h2 className="text-3xl font-bold text-black mt-4">
            WE OFFER ALL PAYMENT OPTIONS
          </h2>
          <p className="text-2xl font-bold text-black mt-4">
            "WE BELIEVE PAYING ONLINE SHOULD BE QUICK AS PAYING ON OFFLINE STORE
            WITHIN SECONDS."
          </p>
          <p className="mt-5">
            Hence we are offering multiple payment option which are fast, easy
            and secure. We use most trusted payment gateway provider Razorpay,
            and CCAvenue which uses 128 Bit SSL encryption for safe payments.
          </p>
        </div>
        <div className="space-y-4 text-sm text-gray-700">
          <p>Following Payment methods are available at www.vootbuy.in</p>
          <ul className="list-disc list-inside space-y-2">
            <li>1- CASH ON DELIVERY- On 12000 pin codes all over India.</li>
            <li>
              2- MOBILE WALLETS - We accept all mobile wallets. e.g; Paytm,
              Phone pay + more...{" "}
            </li>
            <li>
              3- CREDIT CARDS, DEBIT CARDS AND ATM - We accept all types of
              national and international cards.
            </li>
            <li>
              4- INTERNET BANKING - We accept internet banking of all banks.
            </li>
            <li>
              5- UPI - We accept BHIM, Google Pay, Tez, Phonepe, WhatsApp UPI
              and all UPI methods.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
