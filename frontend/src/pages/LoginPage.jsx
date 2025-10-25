import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { login as apiLogin } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiLogin(email, password);
      login(data);

      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "customer") {
        navigate("/customer");
      } else if (data.user.role === "worker") {
        navigate("/worker");
      }
    } catch (err) {
      setError("Invalid credentials");
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
            Welcome back! Please login to continue.
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
          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-200 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-500 text-gray-900 font-semibold hover:bg-teal-400 transition-colors duration-300 shadow-md"
          >
            Login
          </button>
        </form>

        {/* Sign up link */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-400 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
        {/* Forgot password link */}
        <div className="mt-4 text-center text-sm text-gray-400">
          <Link
            to="/forgot-password"
            className="text-teal-400 font-medium hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
