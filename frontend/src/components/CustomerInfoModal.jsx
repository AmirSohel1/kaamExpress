import React from "react";
import Avatar from "react-avatar";
import { FaEnvelope, FaCalendarAlt } from "react-icons/fa";

const CustomerInfoModal = ({ customer, open, onClose }) => {
  if (!open || !customer) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-4">
          <Avatar
            name={customer.name}
            size="80"
            round
            color="#a21caf"
            fgColor="#fff"
          />
          <div className="text-xl font-bold text-[var(--accent)]">
            {customer.name}
          </div>
          <div className="text-sm text-gray-400 mb-2">ID: {customer.id}</div>
          <div className="flex items-center gap-2 mb-2">
            <FaEnvelope className="text-[var(--accent)]" />
            <span className="text-white">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
              {customer.bookings} bookings
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FaCalendarAlt className="text-[var(--accent)]" />
            <span className="text-xs text-gray-400">
              Joined: {customer.joinDate}
            </span>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-green-900 text-green-300">
            {customer.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoModal;
