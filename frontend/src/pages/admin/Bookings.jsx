import React, { useState, useEffect, useMemo } from "react";
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
import { FaSync, FaExclamationTriangle, FaFilter } from "react-icons/fa";

const statusColors = {
  completed: "bg-green-900 text-green-300",
  "in-progress": "bg-blue-900 text-blue-300",
  dispute: "bg-red-900 text-red-300",
  pending: "bg-yellow-900 text-yellow-300",
  cancelled: "bg-gray-700 text-gray-300",
};
const statusLabels = {
  completed: "Completed",
  "in-progress": "In Progress",
  dispute: "Dispute",
  pending: "Pending",
  cancelled: "Cancelled",
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
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all, recent, analytics

  useEffect(() => {
    setLoading(true);
    fetchBookings()
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        setError("Failed to load bookings");
        setLoading(false);
        setRefreshing(false);
      });
  }, [refresh]);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefresh((r) => !r);
  };

  // Memoized filtered bookings for better performance
  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const serviceName =
        typeof b.service === "string" ? b.service : b.service?.name;
      const customerName = b.customer?.name || "";
      const workerName = b.worker?.name || "";

      return (
        (status === "all" || b.status === status) &&
        (service === "all" || serviceName === service) &&
        (customerName.toLowerCase().includes(search.toLowerCase()) ||
          workerName.toLowerCase().includes(search.toLowerCase()) ||
          (serviceName &&
            serviceName.toLowerCase().includes(search.toLowerCase())) ||
          (b._id && b._id.toLowerCase().includes(search.toLowerCase())))
      );
    });
  }, [bookings, search, status, service]);

  // Memoized analytics data
  const analyticsData = useMemo(() => {
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.finalAmount || b.price || 0),
      0
    );
    const paidRevenue = bookings
      .filter((b) => b.isPaid)
      .reduce((sum, b) => sum + (b.finalAmount || b.price || 0), 0);

    const serviceCounts = bookings.reduce((acc, b) => {
      const serviceName =
        typeof b.service === "string" ? b.service : b.service?.name;
      if (serviceName) acc[serviceName] = (acc[serviceName] || 0) + 1;
      return acc;
    }, {});

    const statusCounts = bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRevenue,
      paidRevenue,
      serviceCounts,
      statusCounts,
      totalBookings: bookings.length,
      unpaidBookings: bookings.filter(
        (b) => !b.isPaid && b.paymentStatus === "Unpaid"
      ).length,
    };
  }, [bookings]);

  const serviceOptions = useMemo(
    () =>
      Array.from(
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
          if (typeof s === "string" && s[0] === "{") {
            try {
              return JSON.parse(s);
            } catch {
              return s;
            }
          }
          return s;
        })
        .filter(Boolean),
    [bookings]
  );

  const handleContact = (booking) => {
    const customerPhone = booking.customer?.phone;
    const workerPhone = booking.worker?.phone;

    if (customerPhone && workerPhone) {
      alert(`Contact:\nCustomer: ${customerPhone}\nWorker: ${workerPhone}`);
    } else {
      alert("Contact information not available");
    }
  };

  const handleStatusUpdate = async (booking, newStatus) => {
    try {
      await updateBookingById(booking._id, { status: newStatus });
      setRefresh((r) => !r);
    } catch (e) {
      alert(`Failed to update status to ${newStatus}`);
    }
  };

  const handleCancel = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      await updateBookingById(booking._id, { status: "cancelled" });
      setRefresh((r) => !r);
    } catch (e) {
      alert("Failed to cancel booking");
    }
  };

  const handleExport = () => {
    const csv = [
      [
        "ID",
        "Customer",
        "Worker",
        "Service",
        "Date",
        "Time",
        "Amount",
        "Status",
        "Payment Status",
      ],
      ...filtered.map((b) => [
        b._id,
        b.customer?.name,
        b.worker?.name,
        typeof b.service === "object" ? b.service?.name : b.service,
        b.date ? new Date(b.date).toLocaleDateString() : "N/A",
        b.time || "N/A",
        b.finalAmount || b.price || 0,
        b.status,
        b.paymentStatus,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
          <div className="text-lg text-gray-400">Loading bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-center text-red-400">
          <FaExclamationTriangle className="text-4xl mx-auto mb-4" />
          <div className="text-lg">{error}</div>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-[var(--accent)] text-black rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full px-4 py-6 lg:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white">
            Bookings Management
          </h2>
          <p className="text-gray-400 mt-1">
            Manage and monitor all service bookings ({bookings.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--secondary)] text-white rounded-xl hover:bg-[var(--card)] transition disabled:opacity-50"
          >
            <FaSync className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        {["all", "recent", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium capitalize transition ${
              activeTab === tab
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Statistics */}
      <BookingStatCards
        bookings={bookings}
        totalRevenue={analyticsData.totalRevenue}
        paidRevenue={analyticsData.paidRevenue}
        unpaidBookings={analyticsData.unpaidBookings}
      />

      {activeTab === "analytics" ? (
        <BookingAnalytics data={analyticsData} />
      ) : (
        <>
          {/* Filters */}
          <BookingFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            service={service}
            setService={setService}
            serviceOptions={serviceOptions}
            onExport={handleExport}
            resultCount={filtered.length}
            totalCount={bookings.length}
          />

          {/* Mobile Cards */}
          <div className="lg:hidden flex flex-col gap-4 mb-8">
            {filtered.length > 0 ? (
              filtered.map((b) => (
                <BookingMobileCard
                  key={b._id}
                  booking={b}
                  onView={setModal}
                  onContact={handleContact}
                  onStatusUpdate={handleStatusUpdate}
                  onCancel={handleCancel}
                  statusColors={statusColors}
                  statusLabels={statusLabels}
                />
              ))
            ) : (
              <div className="text-center text-gray-400 py-12 bg-[var(--secondary)] rounded-2xl">
                <FaFilter className="text-3xl mx-auto mb-3 opacity-50" />
                <div>No bookings found matching your criteria.</div>
                <button
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                    setService("all");
                  }}
                  className="mt-3 text-[var(--accent)] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <BookingTable
            filtered={filtered}
            onView={setModal}
            onContact={handleContact}
            onStatusUpdate={handleStatusUpdate}
            onCancel={handleCancel}
            statusColors={statusColors}
            statusLabels={statusLabels}
          />

          {/* Bottom Section */}
          {activeTab === "all" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
              <BookingRecentList
                bookings={bookings.slice(0, 5)} // Show only 5 recent
                statusColors={statusColors}
                statusLabels={statusLabels}
              />
              <BookingServiceDistribution
                serviceCounts={analyticsData.serviceCounts}
                bookings={bookings}
              />
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <BookingDetailsModal
        modal={modal}
        onClose={() => setModal(null)}
        statusColors={statusColors}
        statusLabels={statusLabels}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default Bookings;
