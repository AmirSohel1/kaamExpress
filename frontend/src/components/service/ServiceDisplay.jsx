import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaStar, FaRegStar } from "react-icons/fa";

const ServiceCard = ({ service, onRowClick, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
      onClick={() => onRowClick(service)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {service.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              {service.name}
              {service.isActive && (
                <FaEye className="text-green-400 text-sm" title="Active" />
              )}
            </h3>
            <p className="text-gray-400 text-sm">ID: {service._id.slice(-8)}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            service.isActive
              ? "bg-green-900/50 text-green-300 border border-green-700"
              : "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
          }`}
        >
          {service.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <p className="text-gray-300 mb-4 line-clamp-2">{service.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-1">
          {service.categories?.slice(0, 3).map((category, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded-lg text-xs"
            >
              {category}
            </span>
          ))}
          {service.categories?.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-lg text-xs">
              +{service.categories.length - 3}
            </span>
          )}
        </div>
        <div className="text-white font-semibold">{service.priceRange}</div>
      </div>

      <div
        className={`flex gap-2 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200"
          onClick={() => onEdit(service)}
        >
          <FaEdit /> Edit
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200"
          onClick={() => onDelete(service)}
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

const ServiceDisplay = ({
  services = [],
  view = "card",
  onRowClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  if (view === "table") {
    return (
      <div className="hidden lg:block bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50 text-gray-300">
                <th className="py-4 px-6 text-left font-semibold">SERVICE</th>
                <th className="py-4 px-6 text-left font-semibold">
                  DESCRIPTION
                </th>
                <th className="py-4 px-6 text-left font-semibold">
                  CATEGORIES
                </th>
                <th className="py-4 px-6 text-left font-semibold">PRICE</th>
                <th className="py-4 px-6 text-left font-semibold">STATUS</th>
                <th className="py-4 px-6 text-left font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr
                  key={service._id}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-all duration-200 cursor-pointer ${
                    index % 2 === 0 ? "bg-gray-800/20" : "bg-gray-800/10"
                  }`}
                  onClick={() => onRowClick(service)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {service.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          {service.name}
                          {service.isActive && (
                            <FaEye
                              className="text-green-400 text-xs"
                              title="Active"
                            />
                          )}
                        </div>
                        <div className="text-gray-400 text-xs">
                          ID: {service._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-300 max-w-xs truncate">
                      {service.description}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {service.categories?.map((category, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-white">
                    {service.priceRange}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        service.isActive
                          ? "bg-green-900/50 text-green-300 border border-green-700"
                          : "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 text-sm"
                        onClick={() => onEdit(service)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-200 text-sm"
                        onClick={() => onDelete(service)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Card view (mobile)
  return (
    <div className="lg:hidden grid grid-cols-1 gap-4">
      {services.map((service) => (
        <ServiceCard
          key={service._id}
          service={service}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ServiceDisplay;
