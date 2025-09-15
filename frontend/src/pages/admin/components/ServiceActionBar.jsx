// src/components/ServiceActionBar.jsx
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import ServiceFormModal from "./ServiceFormModal";

const ServiceActionBar = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-[var(--secondary)] rounded-2xl shadow mb-4">
        <div className="flex-1 min-w-0 mb-4 sm:mb-0">
          <span className="text-lg font-semibold block text-white">
            Service Categories
          </span>
          <span className="text-gray-400 text-sm block">
            Manage service categories available on the platform
          </span>
        </div>

        <button
          className="px-4 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition flex items-center justify-center gap-2 text-sm sm:text-base"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Service
        </button>
      </div>

      <ServiceFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={(newService) => {
          onAdd(newService);
          setShowModal(false); // Close modal on success
        }}
      />
    </>
  );
};

export default ServiceActionBar;
