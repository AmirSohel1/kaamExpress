import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const ServiceTable = ({ services, onRowClick, onEdit, onDelete }) => (
  <div className="hidden md:block bg-[var(--secondary)] rounded-2xl shadow overflow-x-auto w-full mb-8">
    <table className="min-w-full table-auto">
      <thead>
        <tr className="text-left bg-[var(--primary)] text-gray-300">
          <th className="py-3 px-4 min-w-[150px]">NAME</th>
          <th className="py-3 px-4 min-w-[200px]">DESCRIPTION</th>
          <th className="py-3 px-4 min-w-[150px]">CATEGORIES</th>
          <th className="py-3 px-4 min-w-[100px]">PRICE RANGE</th>
          <th className="py-3 px-4 min-w-[100px]">STATUS</th>
          <th className="py-3 px-4 min-w-[150px]">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {services.map((s) => (
          <tr
            key={s._id}
            className="border-b border-gray-700 hover:bg-[var(--card)] transition cursor-pointer"
            onClick={() => onRowClick(s)}
          >
            <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
              {s.name}
              <FaEye className="text-green-400 text-sm" title="Visible" />
            </td>
            <td className="py-3 px-4 text-gray-400 text-sm">{s.description}</td>
            <td className="py-3 px-4 text-gray-400 text-sm">
              {s.categories?.join(", ")}
            </td>
            <td className="py-3 px-4 text-gray-300">{s.priceRange}</td>
            <td className="py-3 px-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  s.isActive
                    ? "bg-green-900 text-green-300"
                    : "bg-yellow-900 text-yellow-300"
                }`}
              >
                {s.isActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td
              className="py-3 px-4 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="flex items-center gap-1 px-4 py-1 rounded bg-[var(--card)] border border-gray-700 text-white font-semibold hover:bg-[var(--card)]/80 transition text-sm"
                onClick={() => onEdit(s)}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="flex items-center gap-1 px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-500 transition text-sm"
                onClick={() => onDelete(s)}
              >
                <FaTrash /> Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ServiceTable;
