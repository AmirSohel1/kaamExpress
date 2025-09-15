import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/auth";

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signup(formData);
      console.log("Signup success:", res);

      if (formData.role === "worker") {
        navigate("/worker-profile-setup", { state: res.data });
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 transition-all duration-500 ease-in-out animate-fadeIn">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-teal-400 tracking-wide">
            KaamExpress
          </h1>
          <p className="text-gray-300 mt-1 text-sm">
            Create your account to get started.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-400 bg-red-900/30 border border-red-500 text-sm px-3 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray-200 mb-1">
              Full Name
            </label>
            <input
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              type="text"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-200 mb-1">
              Email
            </label>
            <input
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm text-gray-200 mb-1">
              Phone
            </label>
            <input
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              type="tel"
              placeholder="+91 9876543210"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-200 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm text-gray-200 mb-1">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            >
              <option value="customer">Customer</option>
              <option value="worker">Worker</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-teal-500 text-gray-900 font-semibold hover:bg-teal-400 transition-colors duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Already have account */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-400 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
