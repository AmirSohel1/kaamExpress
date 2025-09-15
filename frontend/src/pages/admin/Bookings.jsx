import React, { useState, useEffect } from "react";
import {
  fetchBookings,
  updateBookingById,
  deleteBookingById,
} from "../../api/bookings";
import BookingStatCards from "./components/BookingStatCards";
import BookingFilters from "./components/BookingFilters";
import BookingMobileCard from "./components/BookingMobileCard";
import BookingTable from "./components/BookingTable";
import BookingRecentList from "./components/BookingRecentList";
import BookingServiceDistribution from "./components/BookingServiceDistribution";
import BookingDetailsModal from "./components/BookingDetailsModal";

const statusColors = {
  completed: "bg-green-900 text-green-300",
  "in-progress": "bg-blue-900 text-blue-300",
  dispute: "bg-red-900 text-red-300",
};
const statusLabels = {
  completed: "Completed",
  "in-progress": "In Progress",
  dispute: "Dispute",
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  const [modal, setModal] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBookings()
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load bookings");
        setLoading(false);
      });
  }, [refresh]);

  const filtered = bookings.filter((b) => {
    // Service can be object or string
    let serviceName =
      typeof b.service === "string" ? b.service : b.service?.name;
    return (
      (status === "all" || b.status === status) &&
      (service === "all" || serviceName === service) &&
      (b.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.worker?.name?.toLowerCase().includes(search.toLowerCase()) ||
        (serviceName &&
          serviceName.toLowerCase().includes(search.toLowerCase())))
    );
  });

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.amount || b.price || 0),
    0
  );
  const serviceCounts = bookings.reduce((acc, b) => {
    let serviceName =
      typeof b.service === "string" ? b.service : b.service?.name;
    if (serviceName) acc[serviceName] = (acc[serviceName] || 0) + 1;
    return acc;
  }, {});
  // Unique service objects by _id or name
  const serviceOptions = Array.from(
    bookings.reduce((set, b) => {
      let s = b.service;
      if (typeof s === "string") {
        set.add(s);
      } else if (s && s._id) {
        set.add(JSON.stringify({ _id: s._id, name: s.name }));
      }
      return set;
    }, new Set())
  )
    .map((s) => {
      if (s[0] === "{") {
        try {
          return JSON.parse(s);
        } catch {
          return s;
        }
      }
      return s;
    })
    .filter(Boolean);

  const handleContact = (booking) => {
    // Implement actual contact logic (email, chat, etc.)
    alert(
      `Contacting customer ${booking.customer.name} and worker ${booking.worker.name} regarding booking #${booking.id}`
    );
  };

  const handleMarkComplete = async (booking) => {
    try {
      await updateBookingById(booking.id, { status: "completed" });
      setRefresh((r) => !r);
    } catch (e) {
      alert("Failed to mark as complete");
    }
  };

  const handleCancel = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      await deleteBookingById(booking.id);
      setRefresh((r) => !r);
    } catch (e) {
      alert("Failed to cancel booking");
    }
  };

  const handleExport = () => {
    const csv = [
      ["ID", "Customer", "Worker", "Service", "Date", "Amount", "Status"],
      ...filtered.map((b) => [
        b.id,
        b.customer.name,
        b.worker.name,
        b.service,
        b.date,
        b.amount,
        b.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64 text-lg text-gray-400">
        Loading bookings...
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
      <h2 className="text-2xl font-bold mb-8">All Bookings</h2>
      <BookingStatCards bookings={bookings} totalRevenue={totalRevenue} />
      <BookingFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        service={service}
        setService={setService}
        serviceOptions={serviceOptions}
        onExport={handleExport}
      />
      {/* Mobile-optimized cards */}
      <div className="md:hidden flex flex-col gap-4 mb-8">
        {filtered.length > 0 ? (
          filtered.map((b) => (
            <BookingMobileCard
              key={b._id || b.id}
              booking={b}
              onView={setModal}
              onContact={handleContact}
              statusColors={statusColors}
              statusLabels={statusLabels}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            No bookings found matching your criteria.
          </div>
        )}
      </div>
      {/* Bookings Table */}
      <BookingTable
        filtered={filtered}
        onView={setModal}
        onContact={handleContact}
        onMarkComplete={handleMarkComplete}
        onCancel={handleCancel}
        statusColors={statusColors}
        statusLabels={statusLabels}
      />
      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BookingRecentList
          bookings={bookings}
          statusColors={statusColors}
          statusLabels={statusLabels}
        />
        <BookingServiceDistribution
          serviceCounts={serviceCounts}
          bookings={bookings}
        />
      </div>
      {/* Modal */}
      <BookingDetailsModal
        modal={modal}
        onClose={() => setModal(null)}
        statusColors={statusColors}
        statusLabels={statusLabels}
      />
    </div>
  );
};

export default Bookings;
