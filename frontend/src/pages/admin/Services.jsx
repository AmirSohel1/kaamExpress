import React, { useState, useEffect, useCallback } from "react";
import ServiceActionBar from "./components/ServiceActionBar";
import ServiceFormModal from "./components/ServiceFormModal";
import ServiceStats from "./components/ServiceStats";
import ServiceDisplay from "../../components/service/ServiceDisplay";
import ExportButton from "./components/ExportButton";
import ServiceInfoModal from "./components/ServiceInfoModal";
import ServiceFilters from "./components/ServiceFilters";
import {
  fetchServices,
  updateService,
  deleteService,
} from "../../api/services";

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // ✅ Fetch services on mount
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchServices();
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      setError("Failed to load services. Please try refreshing the page.");
      console.error("Error loading services:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // ✅ Filter and sort services
  useEffect(() => {
    let filtered = services;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.categories.some((cat) =>
            cat.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((service) =>
        statusFilter === "active" ? service.isActive : !service.isActive
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((service) =>
        service.categories.includes(categoryFilter)
      );
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.priceRange.localeCompare(b.priceRange);
        case "status":
          return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
        case "date":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  }, [services, searchTerm, statusFilter, categoryFilter, sortBy]);

  // ✅ Event handlers
  const handleRowClick = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  const handleEdit = (service) => {
    setEditService(service);
    setEditModalOpen(true);
  };

  const handleDelete = async (service) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${service.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteService(service._id);
        await loadServices();
      } catch (err) {
        console.error("Error deleting service:", err);
        setError("Failed to delete service. Please try again.");
      }
    }
  };

  const handleRefresh = () => {
    loadServices();
  };

  const getUniqueCategories = () => {
    const allCategories = services.flatMap((service) => service.categories);
    return [...new Set(allCategories)];
  };

  // ✅ Loading state with skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-700 rounded-xl mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error && services.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Service Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage your services, track performance, and organize offerings
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <span>🔄</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <ServiceStats services={services} />

        {/* Filters and Search */}
        <ServiceFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={getUniqueCategories()}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalServices={services.length}
          filteredCount={filteredServices.length}
        />

        {/* Action Bar */}
        <ServiceActionBar onAdd={loadServices} />

        {/* Results Info */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-400 text-sm">
            Showing {filteredServices.length} of {services.length} services
          </p>
          {filteredServices.length === 0 && services.length > 0 && (
            <p className="text-yellow-400 text-sm">
              No services match your filters
            </p>
          )}
        </div>

        {/* Service Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-2xl text-red-200">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-400 hover:text-red-200"
            >
              ×
            </button>
          </div>
        )}

        <ServiceDisplay
          services={filteredServices}
          view="card"
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <ServiceDisplay
          services={filteredServices}
          view="table"
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Empty State */}
        {services.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Services Yet
            </h3>
            <p className="text-gray-400 mb-6">
              Get started by adding your first service
            </p>
          </div>
        )}

        {/* Export Data */}
        {services.length > 0 && (
          <div className="flex justify-end mt-8">
            <ExportButton services={services} />
          </div>
        )}

        {/* Modals */}
        <ServiceInfoModal
          service={selectedService}
          open={modalOpen}
          onClose={handleCloseModal}
        />
        <ServiceFormModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={loadServices}
          editService={editService}
        />
      </div>
    </div>
  );
};

export default Services;
