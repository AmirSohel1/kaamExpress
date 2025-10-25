import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchServices } from "../api/services";
import { registerWorker } from "../api/workers";

export default function WorkerRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledData = location.state || {};

  // ✅ Extract user ID from stored auth or prefilled state
  const auth = localStorage.getItem("auth");
  let userId = prefilledData?.id || prefilledData?.user?.id || null;

  if (auth) {
    try {
      const parsed = JSON.parse(auth);
      userId = userId || parsed?.user?._id || parsed?.user?.id || null;
    } catch (err) {
      console.error("Invalid auth object in localStorage:", err);
    }
  }

  const [services, setServices] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [form, setForm] = useState({
    selectedServices: [],
    customSkills: "",
    experience: "",
    address: "",
    availability: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch services once safely
  useEffect(() => {
    const controller = new AbortController();

    const loadServices = async () => {
      try {
        const data = await fetchServices({ signal: controller.signal });
        setServices(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch services:", err);
        setError("Could not load available services. Try again later.");
      }
    };

    loadServices();
    return () => controller.abort();
  }, []);

  const toggleService = (id) => {
    setForm((prev) => {
      const selected = prev.selectedServices.includes(id);
      return {
        ...prev,
        selectedServices: selected
          ? prev.selectedServices.filter((s) => s !== id)
          : [...prev.selectedServices, id],
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("User ID missing. Please log in or sign up again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        userID: userId,
        services: form.selectedServices,
        customSkills: form.customSkills
          ? form.customSkills.split(",").map((s) => s.trim())
          : [],
        experience: Number(form.experience),
        address: form.address,
        availability: form.availability,
      };

      console.log("📦 Sending worker registration payload:", payload);
      await registerWorker(payload);

      // ✅ After success → redirect to worker dashboard
      navigate("/login");
    } catch (err) {
      console.error(
        "❌ Registration failed:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to complete registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 px-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-teal-400">KaamExpress</h1>
          <p className="text-gray-300 mt-1 text-sm">
            Complete your profile to start working.
          </p>
        </div>

        {error && (
          <div className="text-red-400 bg-red-900/30 border border-red-500 text-sm px-3 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Services */}
          {services.length > 0 ? (
            <div className="relative">
              <label className="block text-sm text-gray-200 mb-1">
                Select Services
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-left"
              >
                {form.selectedServices.length > 0
                  ? `${form.selectedServices.length} service(s) selected`
                  : "Choose services"}
              </button>

              {dropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  {services.map((srv) => (
                    <label
                      key={srv._id}
                      className="flex items-center text-gray-300 px-3 py-2 cursor-pointer hover:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={form.selectedServices.includes(srv._id)}
                        onChange={() => toggleService(srv._id)}
                        className="mr-2"
                      />
                      {srv.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              Services unavailable at the moment.
            </p>
          )}

          {/* Custom Skills */}
          <div>
            <label
              htmlFor="customSkills"
              className="block text-sm text-gray-200 mb-1"
            >
              Other Skills (comma separated)
            </label>
            <input
              id="customSkills"
              name="customSkills"
              value={form.customSkills}
              onChange={handleChange}
              placeholder="e.g. furniture repair, driving"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Experience */}
          <div>
            <label
              htmlFor="experience"
              className="block text-sm text-gray-200 mb-1"
            >
              Experience (years)
            </label>
            <input
              id="experience"
              name="experience"
              type="number"
              min="0"
              value={form.experience}
              onChange={handleChange}
              placeholder="Enter years of experience"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm text-gray-200 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows="2"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
              required
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <input
              id="availability"
              name="availability"
              type="checkbox"
              checked={form.availability}
              onChange={handleChange}
              className="h-4 w-4 text-teal-400 border-gray-300 rounded focus:ring-teal-400"
            />
            <label htmlFor="availability" className="text-sm text-gray-300">
              Available for work
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-teal-500 text-gray-900 font-semibold hover:bg-teal-400 transition-colors duration-300 shadow-md disabled:opacity-50"
          >
            {loading ? "Registering..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
