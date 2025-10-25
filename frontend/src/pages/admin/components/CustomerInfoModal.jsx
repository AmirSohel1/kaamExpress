import React from "react";
import Avatar from "react-avatar";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClipboardList,
  FaMoneyBillWave,
  FaPhone,
  FaVenusMars,
  FaStar,
  FaIdCard,
  FaUser,
  FaTimes,
  FaBirthdayCake,
  FaInfoCircle,
} from "react-icons/fa";

const CustomerInfoModal = ({ customer, open, onClose }) => {
  if (!open || !customer) return null;

  // Safe data extraction with fallbacks
  const name = customer?.name || customer?.user?.name || "Unnamed Customer";
  const email = customer?.email || customer?.user?.email || "No email provided";
  const id = customer?._id || "N/A";
  const phone = customer?.phone || "Not provided";
  const gender = customer?.gender;
  const bio = customer?.bio;
  const dateOfBirth = customer?.dateOfBirth;
  const address = customer?.address;
  const isActive = customer?.isActive ?? customer?.user?.isActive ?? false;
  const emailVerified = customer?.emailVerified || false;
  const phoneVerified = customer?.phoneVerified || false;
  const joinDate = customer?.createdAt || customer?.user?.createdAt;
  const profilePicture =
    customer?.profilePicture || customer?.user?.profilePicture;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAddress = (addr) => {
    if (!addr || typeof addr === "string") return addr || "No address provided";

    const parts = [];
    if (addr.street) parts.push(addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.zip) parts.push(addr.zip);

    return parts.length > 0 ? parts.join(", ") : "No address provided";
  };

  const getStatusColor = (status) => {
    return status
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  };

  const getVerificationColor = (verified) => {
    return verified
      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
      : "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-gradient-to-br from-[var(--card)] to-[var(--card)]/90 rounded-2xl shadow-2xl border border-[var(--accent)]/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--accent)]/20 rounded-xl">
              <FaUser className="text-[var(--accent)] text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Customer Details</h2>
              <p className="text-gray-400 text-sm">
                Complete customer information
              </p>
            </div>
          </div>
          <button
            className="p-2 hover:bg-red-500/20 rounded-xl text-gray-400 hover:text-red-400 transition-colors duration-200"
            onClick={onClose}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8">
            <div className="relative">
              <Avatar
                name={name}
                size="100"
                round
                src={profilePicture}
                color={isActive ? "#10b981" : "#ef4444"}
                fgColor="#fff"
                className="border-4 border-[var(--accent)]/20 shadow-lg"
              />
              {emailVerified && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[var(--card)]">
                  <FaStar className="text-white text-sm" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {name}
                </h1>
                {gender && (
                  <FaVenusMars
                    className={`text-lg ${
                      gender === "male" ? "text-blue-400" : "text-pink-400"
                    }`}
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(
                    isActive
                  )}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  {isActive ? "Active" : "Inactive"}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getVerificationColor(
                    emailVerified
                  )}`}
                >
                  <FaStar className="text-xs" />
                  Email {emailVerified ? "Verified" : "Unverified"}
                </span>

                {phoneVerified && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getVerificationColor(
                      phoneVerified
                    )}`}
                  >
                    <FaPhone className="text-xs" />
                    Phone Verified
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-400 flex items-center justify-center lg:justify-start gap-2">
                <FaIdCard className="text-[var(--accent)]" />
                ID: {id}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {bio && (
            <div className="mb-6 p-4 bg-[var(--secondary)]/50 rounded-xl border border-gray-700/30">
              <div className="flex items-center gap-2 mb-2">
                <FaInfoCircle className="text-[var(--accent)]" />
                <span className="text-white font-semibold">About</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{bio}</p>
            </div>
          )}

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Email */}
            <div className="bg-[var(--secondary)]/30 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FaEnvelope className="text-blue-400 text-sm" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Email</div>
                  <div className="text-white text-sm font-medium truncate">
                    {email}
                  </div>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-[var(--secondary)]/30 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FaPhone className="text-green-400 text-sm" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Phone</div>
                  <div className="text-white text-sm font-medium">{phone}</div>
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            {dateOfBirth && (
              <div className="bg-[var(--secondary)]/30 rounded-xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <FaBirthdayCake className="text-purple-400 text-sm" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs">Date of Birth</div>
                    <div className="text-white text-sm font-medium">
                      {formatDate(dateOfBirth)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Join Date */}
            <div className="bg-[var(--secondary)]/30 rounded-xl p-4 border border-gray-700/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <FaCalendarAlt className="text-amber-400 text-sm" />
                </div>
                <div>
                  <div className="text-gray-400 text-xs">Member Since</div>
                  <div className="text-white text-sm font-medium">
                    {formatDate(joinDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="text-[var(--accent)]" />
              <span className="text-white font-semibold">Address</span>
            </div>
            <div className="bg-[var(--secondary)]/30 rounded-xl p-4 border border-gray-700/30">
              <p className="text-gray-300 text-sm leading-relaxed">
                {formatAddress(address)}
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-4 text-center border border-blue-500/20">
              <FaClipboardList className="text-blue-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {customer.bookings?.length || 0}
              </div>
              <div className="text-gray-400 text-xs">Total Bookings</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-4 text-center border border-green-500/20">
              <FaMoneyBillWave className="text-green-400 text-xl mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {customer.payments?.length || 0}
              </div>
              <div className="text-gray-400 text-xs">Payments</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-4 text-center border border-purple-500/20">
              <div className="text-2xl font-bold text-white">
                {joinDate
                  ? Math.floor(
                      (new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24)
                    )
                  : 0}
              </div>
              <div className="text-gray-400 text-xs">Days as Member</div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-xl p-4 text-center border border-amber-500/20">
              <div className="text-2xl font-bold text-white">
                {emailVerified ? "Yes" : "No"}
              </div>
              <div className="text-gray-400 text-xs">Email Verified</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-700/50 bg-[var(--secondary)]/20 rounded-b-2xl">
          <button
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-xl border border-gray-600 hover:from-gray-500 hover:to-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-black font-semibold rounded-xl hover:from-[var(--accent)]/90 hover:to-[var(--accent)]/70 transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => {
              console.log(`Sending message to ${email}`);
              // Implement message sending logic
            }}
          >
            <FaEnvelope />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoModal;
