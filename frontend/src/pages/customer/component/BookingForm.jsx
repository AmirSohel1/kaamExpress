import React, { useState } from "react";
import { createBooking } from "../../../api/bookings";

const BookingForm = ({ worker, service, onSuccess, onError }) => {
  const [form, setForm] = useState({
    location: "",
    date: "",
    notes: "",
    billing: "",
    price: 0,
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    onSuccess(null);
    onError(null);

    try {
      await createBooking({
        worker: worker.user._id,
        service: service?.id,
        date: form.date,
        location: form.location,
        notes: form.notes,
        billing: form.billing,
        price: Number(form.price) || 0,
      });

      onSuccess("Booking confirmed!");
    } catch (err) {
      onError("Booking failed. Please try again.");
    }
  };

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Work location"
        value={form.location}
        onChange={(e) => handleChange("location", e.target.value)}
        required
        className="px-4 py-2 rounded-lg bg-[var(--card)] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => handleChange("date", e.target.value)}
        required
        className="px-4 py-2 rounded-lg bg-[var(--card)] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <input
        type="number"
        placeholder="Price (optional)"
        value={form.price}
        onChange={(e) => handleChange("price", e.target.value)}
        className="px-4 py-2 rounded-lg bg-[var(--card)] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <input
        type="text"
        placeholder="Billing info (optional)"
        value={form.billing}
        onChange={(e) => handleChange("billing", e.target.value)}
        className="px-4 py-2 rounded-lg bg-[var(--card)] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <textarea
        placeholder="Additional notes (optional)"
        value={form.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        className="px-4 py-2 rounded-lg bg-[var(--card)] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        rows={3}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition"
      >
        Confirm Booking
      </button>
    </form>
  );
};

export default BookingForm;
