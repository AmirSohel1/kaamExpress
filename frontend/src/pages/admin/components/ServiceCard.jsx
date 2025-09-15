// src/components/ServiceCard.jsx
import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const ServiceCard = ({ service, onClick, onEdit, onDelete }) => (
  <div
    className="bg-[var(--secondary)] rounded-2xl shadow p-4 cursor-pointer hover:bg-[var(--card)] transition-colors duration-200"
    onClick={() => onClick(service)}
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <div className="font-bold text-white text-lg flex items-center gap-2">
        {service.name}
        <FaEye className="text-green-400 text-sm" title="Visible" />
      </div>
      <div className="text-gray-400 text-xs">ID: {service._id}</div>
    </div>

    {/* Description */}
    <div className="text-gray-400 text-sm mb-2">{service.description}</div>

    {/* Categories and Status */}
    <div className="flex justify-between items-center mb-4">
      <div className="text-gray-400 text-sm">
        Categories: {service.categories?.join(", ")}
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          service.isActive
            ? "bg-green-900 text-green-300"
            : "bg-yellow-900 text-yellow-300"
        }`}
      >
        {service.isActive ? "Active" : "Inactive"}
      </span>
    </div>

    {/* Price */}
    <div className="text-gray-300 text-sm mb-2">
      Price: {service.priceRange}
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
      <button
        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-600 transition text-sm"
        onClick={() => onEdit(service)}
      >
        <FaEdit /> Edit
      </button>
      <button
        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-500 transition text-sm"
        onClick={() => onDelete(service)}
      >
        <FaTrash /> Delete
      </button>
    </div>
  </div>
);

export default ServiceCard;
