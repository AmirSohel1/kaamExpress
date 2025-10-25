import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaSave,
  FaPlus,
  FaCheck,
  FaExclamationTriangle,
  FaTag,
  FaRupeeSign,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { addService, updateService } from "../../../api/services";

const initialForm = {
  name: "",
  description: "",
  categories: "",
  priceRange: "",
  isActive: true,
  imageUrl: "",
  duration: "",
  features: "",
};

const ServiceFormModal = ({ open, onClose, onSuccess, editService }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (editService) {
      const formattedService = {
        ...editService,
        categories: Array.isArray(editService.categories)
          ? editService.categories.join(", ")
          : editService.categories || "",
        features: Array.isArray(editService.features)
          ? editService.features.join(", ")
          : editService.features || "",
      };
      setForm(formattedService);
      setImagePreview(editService.imageUrl || "");
    } else {
      setForm(initialForm);
      setImagePreview("");
    }
    setError(null);
    setSuccess(false);
  }, [editService, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
        features: form.features
          ? form.features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        duration: form.duration ? parseInt(form.duration) : 60,
      };

      if (editService) {
        await updateService(editService._id, payload);
      } else {
        await addService(payload);
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSuccess(false);
      }, 1000);
    } catch (err) {
      console.error("Service save error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save service. Please check your input and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategorySuggestions = () => {
    const commonCategories = [
      "Home",
      "Maintenance",
      "Repair",
      "Cleaning",
      "Installation",
      "Consultation",
    ];
    return commonCategories.filter(
      (cat) => !form.categories.toLowerCase().includes(cat.toLowerCase())
    );
  };

  const addCategorySuggestion = (category) => {
    const currentCategories = form.categories
      ? form.categories.split(",").map((c) => c.trim())
      : [];
    if (!currentCategories.includes(category)) {
      const newCategories = [...currentCategories, category].join(", ");
      setForm((prev) => ({ ...prev, categories: newCategories }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-800/30">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {editService ? "Edit Service" : "Create New Service"}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {editService
                ? "Update your service details"
                : "Add a new service to your catalog"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-gray-700/50 border border-gray-600/50 text-gray-400 hover:text-red-400 hover:border-red-400/50 transition-all duration-300 transform hover:scale-110"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50 bg-gray-800/20">
          <button
            onClick={() => setActiveTab("basic")}
            className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 ${
              activeTab === "basic"
                ? "text-blue-400 border-b-2 border-blue-400 bg-blue-400/10"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 ${
              activeTab === "details"
                ? "text-purple-400 border-b-2 border-purple-400 bg-purple-400/10"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Additional Details
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-fade-in">
                {/* Service Name */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Service Name *
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Professional Plumbing Service"
                    required
                  />
                </div>

                {/* Description */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Description *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe what your service offers..."
                    required
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    {form.description.length}/500 characters
                  </div>
                </div>

                {/* Categories */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <FaTag className="text-purple-400" />
                    Categories *
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    name="categories"
                    value={form.categories}
                    onChange={handleChange}
                    placeholder="e.g., Home, Repair, Maintenance (comma separated)"
                    required
                  />

                  {/* Category Suggestions */}
                  {form.categories.length === 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-2">
                        Quick add categories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {getCategorySuggestions().map((category, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addCategorySuggestion(category)}
                            className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs hover:bg-purple-600 hover:text-white transition-all duration-200 transform hover:scale-105"
                          >
                            + {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <FaRupeeSign className="text-yellow-400" />
                    Price Range *
                  </label>
                  <input
                    className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                    name="priceRange"
                    value={form.priceRange}
                    onChange={handleChange}
                    placeholder="e.g., ₹500-800 or ₹1000"
                    required
                  />
                </div>
              </div>
            )}

            {/* Additional Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6 animate-fade-in">
                {/* Image Upload */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                    Service Image
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-300"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Recommended: Square image, max 5MB
                      </p>
                    </div>
                    {imagePreview && (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-600/50">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    Estimated Duration (minutes)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g., 60"
                    min="1"
                  />
                </div>

                {/* Features */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Key Features
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 resize-none"
                    name="features"
                    value={form.features}
                    onChange={handleChange}
                    rows={3}
                    placeholder="List key features separated by commas..."
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-1">
                      Service Status
                    </label>
                    <p className="text-xs text-gray-500">
                      {form.isActive
                        ? "Service is visible to customers"
                        : "Service is hidden from customers"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                    }
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${
                      form.isActive ? "bg-green-500" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                        form.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Error and Success Messages */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-300 animate-shake">
                <FaExclamationTriangle className="flex-shrink-0" />
                <div className="text-sm">{error}</div>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-300 animate-fade-in">
                <FaCheck className="flex-shrink-0" />
                <div className="text-sm">
                  {editService
                    ? "Service updated successfully!"
                    : "Service created successfully!"}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-700/50 bg-gray-800/30">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-gray-700/50 border border-gray-600/50 text-gray-300 font-semibold hover:bg-gray-600/50 hover:text-white transition-all duration-300 flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              activeTab === "basic"
                ? setActiveTab("details")
                : setActiveTab("basic")
            }
            className="px-6 py-3 rounded-2xl bg-blue-600/20 border border-blue-500/50 text-blue-400 font-semibold hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-300 flex-1"
            disabled={loading}
          >
            {activeTab === "basic" ? "Next: Details" : "Back: Basic Info"}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || success}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-1"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {editService ? "Saving..." : "Creating..."}
              </>
            ) : success ? (
              <>
                <FaCheck />
                Success!
              </>
            ) : (
              <>
                <FaSave />
                {editService ? "Update Service" : "Create Service"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormModal;
