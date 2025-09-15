import React, { useState, useEffect } from "react";
import ServiceActionBar from "./components/ServiceActionBar";
import ServiceFormModal from "./components/ServiceFormModal";
import ServiceStats from "./components/ServiceStats";
import ServiceCard from "./components/ServiceCard";
import ServiceTable from "./components/ServiceTable";
import ExportButton from "./components/ExportButton";
import ServiceInfoModal from "./components/ServiceInfoModal";
import {
  fetchServices,
  updateService,
  deleteService,
} from "../../api/services";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);

  // ✅ Fetch services on mount
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices();
      setServices(data);
    } catch (err) {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadServices();
  }, []);

  // ✅ Event handlers (defined outside useEffect)
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
    try {
      await deleteService(service._id);
      await loadServices();
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  // ✅ Loading + Error states
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64 text-lg text-gray-400">
        Loading services...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-64 text-lg text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">Service Management</h2>

      <ServiceStats services={services} />
      <ServiceActionBar onAdd={loadServices} />

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {services.map((s) => (
          <ServiceCard
            key={s._id}
            service={s}
            onClick={handleRowClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Desktop Table */}
      <ServiceTable
        services={services}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Export Data */}
      <div className="flex justify-end">
        <ExportButton services={services} />
      </div>

      {/* Modal */}
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
  );
};

export default Services;
