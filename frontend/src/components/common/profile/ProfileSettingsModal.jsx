import React, { useState } from "react";
import { updateProfile } from "../../../api/auth.js";
import {
  FaMapMarkerAlt,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaBirthdayCake,
  FaInfoCircle,
  FaGlobe,
} from "react-icons/fa";
import { IoClose, IoCheckmark } from "react-icons/io5";

// ============================
// 📌 Profile Component
// ============================
export default function ProfileSettings({ user, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddressChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(form);
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            location: { type: "Point", coordinates: [longitude, latitude] },
          },
        }));
        setLoadingLocation(false);
      },
      (err) => {
        console.error(err);
        alert("Unable to fetch location.");
        setLoadingLocation(false);
      }
    );
  };

  // ===== Helper for Avatar =====
  const getInitials = (name = "") => name.slice(0, 2).toUpperCase();
  const getColorFromName = (name = "") => {
    const colors = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-amber-500 to-orange-500",
      "from-violet-500 to-fuchsia-500",
      "from-rose-500 to-red-500",
      "from-indigo-500 to-blue-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="relative w-full max-w-4xl p-6 mt-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        {/* Close button top-right */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
        >
          <IoClose size={24} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div
              className={`w-28 h-28 rounded-full bg-gradient-to-r ${getColorFromName(
                user.name
              )} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
            >
              {getInitials(user.name)}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-[var(--accent)] rounded-full text-black hover:bg-[var(--accent)]/90 transition-colors shadow-md">
                <FaCamera size={14} />
              </button>
            )}
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--accent)] to-cyan-400 bg-clip-text text-transparent">
            Profile Settings
          </h2>
          <p className="text-gray-400 mt-2">Manage your account information</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "personal"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Info
          </button>
          <button
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "address"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("address")}
          >
            Location
          </button>
          <button
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "security"
                ? "text-[var(--accent)] border-b-2 border-[var(--accent)]"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--accent)] to-cyan-500 text-black font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Edit Profile</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </button>
          </div>
        )}

        {/* ================== VIEW MODE ================== */}
        {!isEditing ? (
          <div className="space-y-6">
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  label="Name"
                  value={user.name}
                  icon={<FaUser className="text-[var(--accent)]" />}
                />
                <ProfileField
                  label="Email"
                  value={user.email}
                  icon={<FaEnvelope className="text-[var(--accent)]" />}
                />
                <ProfileField label="Role" value={user.role} />

                <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="font-medium">
                      {user.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                <ProfileField
                  label="Phone"
                  value={user.phone || "—"}
                  icon={<FaPhone className="text-[var(--accent)]" />}
                />
                <VerificationField
                  verified={user.phoneVerified}
                  label="Phone Verified"
                />
                <VerificationField
                  verified={user.emailVerified}
                  label="Email Verified"
                />
                <ProfileField
                  label="Gender"
                  value={user.gender}
                  icon={<FaVenusMars className="text-[var(--accent)]" />}
                />
                <ProfileField
                  label="Date of Birth"
                  value={
                    user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "—"
                  }
                  icon={<FaBirthdayCake className="text-[var(--accent)]" />}
                />
                <div className="md:col-span-2">
                  <ProfileField
                    label="Bio"
                    value={user.bio || "—"}
                    icon={<FaInfoCircle className="text-[var(--accent)]" />}
                  />
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[var(--accent)]" /> Location
                    Details
                  </h3>
                </div>
                <ProfileField
                  label="Street"
                  value={user.address?.street || "—"}
                />
                <ProfileField label="City" value={user.address?.city || "—"} />
                <ProfileField
                  label="State"
                  value={user.address?.state || "—"}
                />
                <ProfileField
                  label="Zip Code"
                  value={user.address?.zip || "—"}
                />
                <ProfileField
                  label="Country"
                  value={user.address?.country || "—"}
                  icon={<FaGlobe className="text-[var(--accent)]" />}
                />
                <ProfileField
                  label="Coordinates"
                  value={
                    user.address?.location?.coordinates
                      ? user.address.location.coordinates.join(", ")
                      : "—"
                  }
                />
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6 bg-gray-800/30 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Security Settings
                </h3>
                <p className="text-gray-400 mb-6">
                  Manage your account security preferences and authentication
                  methods.
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                      Enable
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Login Activity</p>
                      <p className="text-sm text-gray-400">
                        View recent account activity
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                      View Logs
                    </button>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Connected Devices</p>
                      <p className="text-sm text-gray-400">
                        Manage devices that have access to your account
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // ================== EDIT MODE ==================
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableField
                  label="Name"
                  value={form.name}
                  onChange={(v) => handleChange("name", v)}
                  icon={<FaUser className="text-[var(--accent)]" />}
                />
                <ReadOnlyField
                  label="Email"
                  value={form.email}
                  icon={<FaEnvelope className="text-[var(--accent)]" />}
                />
                <ReadOnlyField label="Role" value={form.role} />

                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-gray-300 flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        form.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    value={form.isActive}
                    onChange={(e) =>
                      handleChange("isActive", e.target.value === "true")
                    }
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>

                <EditableField
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => handleChange("phone", v)}
                  icon={<FaPhone className="text-[var(--accent)]" />}
                />

                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-gray-300 flex items-center gap-2">
                    <FaVenusMars className="text-[var(--accent)]" />
                    Gender
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    value={form.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <EditableField
                  label="Date of Birth"
                  type="date"
                  value={form.dateOfBirth ? form.dateOfBirth.slice(0, 10) : ""}
                  onChange={(v) => handleChange("dateOfBirth", v)}
                  icon={<FaBirthdayCake className="text-[var(--accent)]" />}
                />

                <div className="md:col-span-2">
                  <EditableField
                    label="Bio"
                    textarea
                    value={form.bio}
                    onChange={(v) => handleChange("bio", v)}
                    icon={<FaInfoCircle className="text-[var(--accent)]" />}
                  />
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[var(--accent)]" /> Location
                    Details
                  </h3>
                </div>

                <EditableField
                  label="Street"
                  value={form.address?.street || ""}
                  onChange={(v) => handleAddressChange("street", v)}
                />
                <EditableField
                  label="City"
                  value={form.address?.city || ""}
                  onChange={(v) => handleAddressChange("city", v)}
                />
                <EditableField
                  label="State"
                  value={form.address?.state || ""}
                  onChange={(v) => handleAddressChange("state", v)}
                />
                <EditableField
                  label="Zip Code"
                  value={form.address?.zip || ""}
                  onChange={(v) => handleAddressChange("zip", v)}
                />
                <EditableField
                  label="Country"
                  value={form.address?.country || ""}
                  onChange={(v) => handleAddressChange("country", v)}
                  icon={<FaGlobe className="text-[var(--accent)]" />}
                />

                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm mb-2 text-gray-300">
                    Coordinates
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-300"
                      value={
                        form.address?.location?.coordinates?.join(", ") || ""
                      }
                      disabled
                    />
                    <button
                      type="button"
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--accent)] to-cyan-500 text-black font-semibold hover:shadow-lg transition-all whitespace-nowrap"
                      onClick={fetchLocation}
                      disabled={loadingLocation}
                    >
                      {loadingLocation ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Fetching...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt /> Use My Location
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-6 bg-gray-800/30 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Security Settings
                </h3>
                <p className="text-gray-400 mb-6">
                  Manage your account security preferences and authentication
                  methods.
                </p>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-gray-400">
                        Update your password regularly to keep your account
                        secure
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-700">
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors flex items-center gap-2"
                onClick={() => {
                  setIsEditing(false);
                  setForm(user);
                }}
              >
                <IoClose size={18} /> Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--accent)] to-cyan-500 text-black font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <IoCheckmark size={18} /> Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ============================
// Subcomponents
// ============================
function ProfileField({ label, value, icon }) {
  return (
    <div className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-colors">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
        {icon} {label}
      </div>
      <p className="text-lg font-medium text-white">{value}</p>
    </div>
  );
}

function VerificationField({ verified, label }) {
  return (
    <div className="p-4 bg-gray-800/50 rounded-xl">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
        {verified ? (
          <FaCheckCircle className="text-green-500" />
        ) : (
          <FaTimesCircle className="text-red-500" />
        )}
        {label}
      </div>
      <p
        className={`text-lg font-medium ${
          verified ? "text-green-400" : "text-red-400"
        }`}
      >
        {verified ? "Verified" : "Not Verified"}
      </p>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  icon,
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-2 text-gray-300 flex items-center gap-2">
        {icon} {label}
      </label>
      {textarea ? (
        <textarea
          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      ) : (
        <input
          type={type}
          className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function ReadOnlyField({ label, value, icon }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-2 text-gray-300 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-400"
        value={value}
        disabled
      />
    </div>
  );
}
