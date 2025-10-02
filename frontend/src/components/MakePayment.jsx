import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../api/payments";
import {
  ArrowLeftIcon,
  CreditCardIcon,
  CheckBadgeIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  WalletIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const MakePayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { price, method, worker, bookingId } = state || {};
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Redirect if missing required data
  if (!price || !method || !worker || !bookingId) {
    navigate("/worker/bookings");
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate gateway response (you can integrate Razorpay/Stripe here)
      const transactionId = "TXN" + Date.now();
      const data = {
        amount: Number(price),
        method,
        transactionId,
      };
      await createPayment(bookingId, data);

      setPaymentSuccess(true);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/customer/bookings");
      }, 2500);
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = () => {
    switch (method) {
      case "Card":
        return <CreditCardIcon className="h-8 w-8 text-blue-500" />;
      case "UPI":
        return <DevicePhoneMobileIcon className="h-8 w-8 text-purple-500" />;
      case "NetBanking":
        return <GlobeAltIcon className="h-8 w-8 text-indigo-500" />;
      case "Wallet":
        return <WalletIcon className="h-8 w-8 text-amber-500" />;
      case "Cash":
        return <BanknotesIcon className="h-8 w-8 text-green-500" />;
      default:
        return <QuestionMarkCircleIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getPaymentMethodText = () => {
    switch (method) {
      case "Card":
        return "Credit/Debit Card";
      case "UPI":
        return "UPI Payment";
      case "NetBanking":
        return "Net Banking";
      case "Wallet":
        return "Digital Wallet";
      case "Cash":
        return "Cash Payment";
      default:
        return method;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 p-2 rounded-full hover:bg-indigo-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center justify-center pt-4">
            {getPaymentIcon()}
            <h1 className="text-2xl font-bold mt-4">Complete Payment</h1>
            <p className="text-indigo-100 mt-1">Secure payment processed</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckBadgeIcon className="h-10 w-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your payment of ₹{price} has been processed successfully.
              </p>
              <div className="animate-pulse text-green-500 font-medium">
                Redirecting to bookings...
              </div>
            </div>
          ) : (
            <>
              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">Amount to pay:</span>
                  <span className="text-2xl font-bold text-indigo-700">
                    ₹{price}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <span className="text-gray-600">Payment method:</span>
                  <span className="font-medium text-gray-800">
                    {getPaymentMethodText()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium text-gray-800">
                    {bookingId.slice(-8)}
                  </span>
                </div>
              </div>

              {/* Payment Security Info */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-blue-700">
                    Your payment is secured with industry-standard encryption.
                    We do not store your payment details.
                  </p>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${price}`
                )}
              </button>

              {/* Support Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Need help?{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">
                    Contact support
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
