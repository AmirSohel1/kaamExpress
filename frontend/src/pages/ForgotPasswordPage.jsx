import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetForm, setResetForm] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // ========================
  // Send reset email
  // ========================
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await forgotPassword({ email });
      setSuccess("A password reset token has been sent to your email!");
      setIsResetModalOpen(true); // open modal to enter token & new password
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to send reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // Handle reset password
  // ========================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!resetForm.token) {
      setResetError("Reset token is required!");
      return;
    }

    if (!resetForm.newPassword || !resetForm.confirmPassword) {
      setResetError("Both password fields are required!");
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setResetError("Passwords do not match!");
      return;
    }

    setResetLoading(true);
    try {
      const data = {
        token: resetForm.token,
        newPassword: resetForm.newPassword,
      };
      await resetPassword(data);
      setResetSuccess("Your password has been reset successfully!");
      setResetForm({ token: "", newPassword: "", confirmPassword: "" });
      setIsResetModalOpen(false);
      navigate("/login");
    } catch (err) {
      // Handle 400 status from backend (invalid/expired token)
      setResetError(
        err.response?.data?.error || err.message || "Failed to reset password"
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetChange = (field, value) => {
    setResetForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 animate-fadeIn">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-teal-400 tracking-wide">
            Forgot Password
          </h1>
          <p className="text-gray-300 mt-2 text-sm">
            Enter your email address to receive a password reset link.
          </p>
        </div>

        {success && (
          <div className="text-green-400 bg-green-900/30 border border-green-500 text-sm px-3 py-2 rounded mb-4 text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="text-red-400 bg-red-900/30 border border-red-500 text-sm px-3 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSendResetLink} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-200 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-500 text-gray-900 font-semibold hover:bg-teal-400 transition-colors duration-300 shadow-md"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-teal-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Reset Password Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md bg-[var(--card)] rounded-2xl shadow-xl border border-[var(--accent)]/20 p-6">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-[var(--accent)]"
              onClick={() => setIsResetModalOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4 text-[var(--accent)]">
              Reset Password
            </h2>

            {resetSuccess && (
              <div className="text-green-400 bg-green-900/30 border border-green-500 text-sm px-3 py-2 rounded mb-4 text-center">
                {resetSuccess}
              </div>
            )}
            {resetError && (
              <div className="text-red-400 bg-red-900/30 border border-red-500 text-sm px-3 py-2 rounded mb-4 text-center">
                {resetError}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="text-sm mb-1 text-gray-300">Token</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
                  value={resetForm.token}
                  onChange={(e) => handleResetChange("token", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm mb-1 text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
                  value={resetForm.newPassword}
                  onChange={(e) =>
                    handleResetChange("newPassword", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm mb-1 text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
                  value={resetForm.confirmPassword}
                  onChange={(e) =>
                    handleResetChange("confirmPassword", e.target.value)
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                  onClick={() => setIsResetModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80"
                  disabled={resetLoading}
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
