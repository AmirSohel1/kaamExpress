import React, { useState } from "react";
import { updatePassword } from "../api/auth";

export default function updatePasswordModal({ onClose, userEmail }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await updatePassword(form.currentPassword, form.newPassword);
      alert("Password updated successfully!");
      localStorage.removeItem("auth");
      window.location.href = "/"; // Redirect to login
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md bg-[var(--card)] rounded-2xl shadow-xl border border-[var(--accent)]/20 p-6">
        {/* Close */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-[var(--accent)]"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-[var(--accent)]">
          Update Password
        </h2>

        {error && <div className="text-red-400 mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              value={form.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              value={form.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
