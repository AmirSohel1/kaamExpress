// src/pages/customer/Payments.jsx
import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { fetchPayments } from "../../api/payments";

const statusStyles = {
  Paid: "bg-green-900 text-green-300",
  Unpaid: "bg-yellow-900 text-yellow-300",
};

const Payments = () => {
  const [customerPayments, setCustomerPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPayments();
        const mapped = data.map((p) => ({
          id: p._id,
          service: p.booking?.serviceName || "N/A",
          amount: p.amount,
          date: new Date(p.date).toLocaleDateString(),
          status: p.status,
          method: p.method,
          transactionId: p.transactionId,
          customer: p.customer?.name || "N/A",
          worker: p.worker?.name || "N/A",
        }));
        setCustomerPayments(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-400">Loading payments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-bold">Payments</h1>
      <p className="text-gray-400 text-sm sm:text-base">
        View and manage your payments
      </p>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[var(--card)] rounded-2xl p-4 shadow-lg">
        <span className="text-lg font-semibold text-[var(--accent)] mb-2 sm:mb-0">
          Payment History
        </span>
        <button
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition text-sm shadow"
          onClick={() => {
            const csv = [
              ["Invoice ID", "Service", "Amount", "Date", "Status"],
              ...customerPayments.map((p) => [
                `"${p.transactionId}"`,
                `"${p.service}"`,
                p.amount,
                `"${p.date}"`,
                `"${p.status}"`,
              ]),
            ]
              .map((row) => row.join(","))
              .join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "customer_payments.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export Payments
        </button>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {customerPayments.length > 0 ? (
          customerPayments.map((p) => (
            <div
              key={p.id}
              className="bg-[var(--card)] rounded-2xl shadow-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white">{p.service}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${
                    statusStyles[p.status] || "bg-gray-800 text-gray-300"
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-200 text-sm mb-2">
                <span>Invoice #{p.transactionId}</span>
                <span className="text-cyan-300 font-bold">₹{p.amount}</span>
              </div>
              <div className="text-gray-400 text-xs mb-4">Date: {p.date}</div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  className={`px-4 py-2 rounded-lg bg-[var(--accent)] text-black text-sm font-semibold transition shadow flex-1 ${
                    p.status === "Paid"
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-[var(--accent)]/80"
                  }`}
                  disabled={p.status === "Paid"}
                >
                  Pay Now
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm font-semibold hover:bg-[var(--secondary)] transition flex items-center justify-center gap-2 flex-1">
                  <FaDownload /> Download
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">
            No payments to show.
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full bg-[var(--card)] rounded-2xl shadow-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left bg-[var(--primary)] text-gray-400 text-sm">
              <th className="py-4 px-6 min-w-[120px]">INVOICE ID</th>
              <th className="py-4 px-6 min-w-[150px]">SERVICE</th>
              <th className="py-4 px-6 min-w-[120px]">AMOUNT</th>
              <th className="py-4 px-6 min-w-[120px]">DATE</th>
              <th className="py-4 px-6 min-w-[120px]">STATUS</th>
              <th className="py-4 px-6 min-w-[200px]">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {customerPayments.length > 0 ? (
              customerPayments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-700 hover:bg-[var(--secondary)] transition"
                >
                  <td className="py-4 px-6 font-semibold text-white text-sm">
                    #{p.transactionId}
                  </td>
                  <td className="py-4 px-6 text-gray-200 text-sm">
                    {p.service}
                  </td>
                  <td className="py-4 px-6 text-cyan-300 font-bold text-sm">
                    ₹{p.amount}
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm">{p.date}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                        statusStyles[p.status] || "bg-gray-800 text-gray-300"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex gap-3">
                    <button
                      className={`px-4 py-1 rounded-lg bg-[var(--accent)] text-black text-sm font-semibold transition shadow ${
                        p.status === "Paid"
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-[var(--accent)]/80"
                      }`}
                      disabled={p.status === "Paid"}
                    >
                      Pay Now
                    </button>
                    <button className="px-4 py-1 rounded-lg border border-gray-600 text-gray-300 text-sm font-semibold hover:bg-[var(--secondary)] transition flex items-center gap-2">
                      <FaDownload /> Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-400">
                  No payments to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
