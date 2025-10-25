import React from "react";
import Avatar from "react-avatar";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClipboardList,
  FaMoneyBillWave,
} from "react-icons/fa";

const CustomerInfoModal = ({ customer, open, onClose }) => {
  if (!open || !customer) return null;

  const name = customer.user?.name || customer.name || "Unnamed Customer";
  const email = customer.user?.email || customer.email || "No Email";
  const id = customer._id || customer.id || "N/A";
  const address = customer.address || "No Address Provided";
  const bookings = customer.bookings?.length || customer.bookings || 0;
  const payments = customer.payments?.length || customer.payments || 0;
  const active = customer.user?.isActive ? "Active" : "Inactive";
  const joinDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString()
    : customer.joinDate || "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 w-full max-w-md relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl"
          onClick={onClose}
        >
          ×
        </button>

        {/* Customer Info */}
        <div className="flex flex-col items-center gap-4">
          <Avatar name={name} size="80" round color="#06b6d4" fgColor="#fff" />

          <div className="text-xl font-bold text-[var(--accent)]">{name}</div>
          <div className="text-sm text-gray-400">ID: {id}</div>

          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <FaEnvelope /> {email}
          </div>

          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <FaMapMarkerAlt /> {address}
          </div>

          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <FaClipboardList /> Total Bookings:{" "}
            <span className="text-white font-semibold">{bookings}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <FaMoneyBillWave /> Payments Made:{" "}
            <span className="text-white font-semibold">{payments}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FaCalendarAlt /> Joined: {joinDate}
          </div>

          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              active === "Active"
                ? "bg-green-900 text-green-300"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {active}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoModal;
