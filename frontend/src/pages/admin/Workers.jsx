import React, { useState, useEffect } from "react";
import WorkerStatCards from "./components/WorkerStatCards";
import WorkerFilters from "./components/WorkerFilters";
import WorkerMobileCard from "./components/WorkerMobileCard";
import WorkerTable from "./components/WorkerTable";
import WorkerInfoModal from "./components/WorkerInfoModal";
import WorkerAddModal from "./components/WorkerAddModal";
import { fetchWorkers } from "../../api";

const statusColors = {
  Approved: "bg-green-900 text-green-300",
  Pending: "bg-yellow-900 text-yellow-300",
  Rejected: "bg-red-900 text-red-300",
};

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Fetch workers on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchWorkers();
        // Safely ensure workers is an array
        setWorkers(Array.isArray(res.workers) ? res.workers : []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Unauthorized. Please log in as admin.");
        } else {
          setError("Failed to load workers");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter workers
  const filtered = Array.isArray(workers)
    ? workers.filter(
        (w) =>
          (statusFilter === "all" || w.status === statusFilter) &&
          (w.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            w.skills?.some((s) =>
              s.toLowerCase().includes(search.toLowerCase())
            ))
      )
    : [];

  const handleRowClick = (worker) => {
    setSelectedWorker(worker);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedWorker(null);
  };

  const handleAddWorker = (worker) => {
    setWorkers((prev) => [worker, ...prev]);
  };

  const handleStatus = (workerId, newStatus) => {
    setWorkers((prev) =>
      prev.map((worker) =>
        worker._id === workerId ? { ...worker, status: newStatus } : worker
      )
    );
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64 text-lg text-gray-400">
        Loading workers...
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
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col animate-fade-in-up">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
        Worker Management
      </h2>

      {/* Worker Stat Cards */}
      {workers.length > 0 && <WorkerStatCards workers={workers} />}

      <WorkerFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddWorker={() => setAddModalOpen(true)}
      />

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-4">
        {filtered.length > 0 ? (
          filtered.map((w) => (
            <WorkerMobileCard
              key={w._id}
              worker={w}
              onRowClick={handleRowClick}
              onStatus={handleStatus}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            No workers found.
          </div>
        )}
      </div>

      {/* Table for larger screens */}
      <WorkerTable
        workers={filtered}
        onRowClick={handleRowClick}
        onStatus={handleStatus}
      />

      <WorkerInfoModal
        worker={selectedWorker}
        open={modalOpen}
        onClose={handleCloseModal}
      />

      <WorkerAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddWorker}
      />
    </div>
  );
};

export default Workers;
