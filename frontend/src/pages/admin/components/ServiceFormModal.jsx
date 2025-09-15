// src/components/ServiceFormModal.jsx
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { addService, updateService } from "../../../api/services";

const initialForm = {
  name: "",
  description: "",
  categories: "",
  priceRange: "",
  isActive: true,
};

const ServiceFormModal = ({ open, onClose, onSuccess, editService }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editService) {
      setForm({
        ...editService,
        categories: Array.isArray(editService.categories)
          ? editService.categories.join(", ")
          : editService.categories || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [editService, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        categories: form.categories
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };
      if (editService) {
        await updateService(editService._id, payload);
      } else {
        await addService(payload);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[var(--card)] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[var(--accent)]/20 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-[var(--accent)]"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-[var(--accent)]">
          {editService ? "Edit Service" : "Add Service"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Categories (comma separated)
            </label>
            <input
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              name="categories"
              value={form.categories}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Price Range</label>
            <input
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              name="priceRange"
              value={form.priceRange}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              id="isActive"
            />
            <label htmlFor="isActive" className="text-sm">
              Active
            </label>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full px-4 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition mt-2"
            disabled={loading}
          >
            {loading
              ? editService
                ? "Saving..."
                : "Adding..."
              : editService
              ? "Save Changes"
              : "Add Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;
