// src/pages/customer/ServiceWorkers.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import WorkerCard from "./component/WorkerCard";
import BookingModal from "./component/BookingModal";

const ServiceWorkers = () => {
  const { serviceId } = useParams();
  const { user } = useContext(AuthContext);
  const [service, setService] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await api.get(`/workers/service/${serviceId}`);
        setService(res.data.service);
        setWorkers(res.data.workers);
      } catch (err) {
        setError("Failed to load workers");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, [serviceId]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Page title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {service
            ? `Available Workers for ${service.name}`
            : "Available Workers"}
        </h2>
        {service && (
          <p className="text-gray-400 text-sm sm:text-base">
            {service.description}
          </p>
        )}
      </div>

      {/* Loading / Error / Empty States */}
      {loading ? (
        <div className="text-center text-gray-400 py-12 animate-pulse">
          Loading workers...
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-12">{error}</div>
      ) : workers.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          No workers found for this service.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <WorkerCard
              key={worker._id}
              worker={worker}
              onBook={() => {
                setSelectedWorker(worker);
                setShowModal(true);
              }}
              onNavigate={() => navigate(`/customer/worker/${worker._id}`)}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showModal && selectedWorker && (
        <BookingModal
          worker={selectedWorker}
          service={service}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ServiceWorkers;
