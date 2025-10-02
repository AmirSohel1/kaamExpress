import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../../../api/bookings";
import { createPayment } from "../../../api/payments";
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const BookingForm = ({ worker, service, onSuccess, onError }) => {
  const [form, setForm] = useState({
    location: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      coordinates: [0, 0],
    },
    date: "",
    time: "",
    duration: service?.duration || 0,
    notes: "",
    billing: "",
    price: service?.price || 0,
    method: "Cash",
  });

  const [loading, setLoading] = useState(false);
  const [geoloading, setGeoloading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const navigate = useNavigate();

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setGeoloading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setForm((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [longitude, latitude],
            },
          }));
          setGeoloading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(
            "Unable to get your location. Please enter it manually."
          );
          setGeoloading(false);
        }
      );
    }
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onSuccess(null);
    onError(null);

    // Extract coordinates properly regardless of format
    let coordinates = [0, 0];
    if (Array.isArray(form.location.coordinates)) {
      coordinates = form.location.coordinates;
    } else if (
      form.location.coordinates &&
      form.location.coordinates.coordinates
    ) {
      coordinates = form.location.coordinates.coordinates;
    }

    // Validate coordinates
    if (coordinates[0] === 0 && coordinates[1] === 0) {
      onError("Please allow location access or enter your address manually.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Step 1: Create Booking
      const bookingRes = await createBooking({
        worker: worker?.user?._id,
        service: service?.id,
        date: form.date,
        time: form.time,
        duration: Number(form.duration),
        location: {
          ...form.location,
          coordinates: coordinates, // Use the extracted coordinates
        },
        notes: form.notes,
        billing: form.billing,
        price: Number(form.price),
        discount: 0,
        tax: 0,
      });

      navigate("/customer/bookings");
      onSuccess("Booking created successfully!");

      // ... rest of the function remains the same
    } catch (err) {
      console.error(err);
      onError("Booking or payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.startsWith("location.")) {
      const key = field.split(".")[1];
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getCurrentLocation = () => {
    setGeoloading(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setGeoloading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // ✅ Keep coordinates as array for consistency
        setForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: [longitude, latitude], // Keep as array, not object
          },
        }));

        setLocationError("Location captured successfully!");
        setGeoloading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMsg = "Unable to get your location. Please enter it manually.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg =
              "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out.";
            break;
          default:
            errorMsg = "An unknown error occurred.";
            break;
        }

        setLocationError(errorMsg);
        setGeoloading(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form
        onSubmit={handleBookingSubmit}
        className="bg-[var(--primary)] rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Book {service?.name}</h2>
          <p className="text-indigo-100 mt-1">
            With {worker?.user?.name || "Professional Worker"}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Location Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-indigo-500" />
                Service Location
              </h3>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={geoloading}
                className="text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-md flex items-center transition disabled:opacity-50"
              >
                {geoloading ? "Detecting..." : "Use My Location"}
              </button>
            </div>

            {locationError && (
              <div
                className={`mb-4 text-sm p-2 rounded-md ${
                  locationError.includes("successfully")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {locationError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Address *
                </label>
                <input
                  id="street"
                  type="text"
                  placeholder="Enter street address"
                  value={form.location.street}
                  onChange={(e) =>
                    handleChange("location.street", e.target.value)
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={form.location.city}
                  onChange={(e) =>
                    handleChange("location.city", e.target.value)
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State/Province
                </label>
                <input
                  id="state"
                  type="text"
                  placeholder="State"
                  value={form.location.state}
                  onChange={(e) =>
                    handleChange("location.state", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ZIP/Postal Code
                </label>
                <input
                  id="zip"
                  type="text"
                  placeholder="ZIP code"
                  value={form.location.zip}
                  onChange={(e) => handleChange("location.zip", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  placeholder="Country"
                  value={form.location.country}
                  onChange={(e) =>
                    handleChange("location.country", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Coordinates:{" "}
              {form.location.coordinates &&
              ((Array.isArray(form.location.coordinates) &&
                form.location.coordinates[0] !== 0 &&
                form.location.coordinates[1] !== 0) ||
                (form.location.coordinates.coordinates &&
                  form.location.coordinates.coordinates[0] !== 0 &&
                  form.location.coordinates.coordinates[1] !== 0))
                ? (() => {
                    let lat, lng;
                    if (Array.isArray(form.location.coordinates)) {
                      [lng, lat] = form.location.coordinates;
                    } else if (form.location.coordinates.coordinates) {
                      [lng, lat] = form.location.coordinates.coordinates;
                    }
                    return `${lat?.toFixed(6) || "0"}, ${
                      lng?.toFixed(6) || "0"
                    }`;
                  })()
                : "Not set"}
            </div>
          </div>

          {/* Schedule Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
              Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date *
                </label>
                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Time *
                </label>
                <input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (minutes) *
                </label>
                <input
                  id="duration"
                  type="number"
                  placeholder="Duration"
                  value={form.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  min="15"
                  step="15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCardIcon className="h-5 w-5 mr-2 text-indigo-500" />
              Payment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price (₹) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="price"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="method"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Payment Method *
                </label>
                <select
                  id="method"
                  value={form.method}
                  onChange={(e) => handleChange("method", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  {["Cash", "Card", "UPI", "NetBanking", "Wallet", "Other"].map(
                    (method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="billing"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Billing Information (optional)
                </label>
                <input
                  id="billing"
                  type="text"
                  placeholder="Billing info"
                  value={form.billing}
                  onChange={(e) => handleChange("billing", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-500" />
              Additional Information
            </h3>

            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Special Instructions (optional)
            </label>
            <textarea
              id="notes"
              placeholder="Any special requirements or notes for the service professional..."
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                Processing...
              </>
            ) : form.method === "Cash" ? (
              "Confirm Booking"
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
