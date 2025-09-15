import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg border border-[var(--accent)]/20 shadow-lg rounded-2xl p-8 sm:p-10 animate-fadeIn">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[var(--accent)] mb-4">
          Contact <span className="text-white">Us</span>
        </h1>
        <p className="text-gray-200 text-center mb-10 max-w-2xl mx-auto">
          Have questions or need help? We’re here for you. Fill out the form
          below and our team will get back to you as soon as possible.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <form className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-200"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 mt-2 rounded-xl bg-[var(--secondary)] border border-[var(--accent)]/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 mt-2 rounded-xl bg-[var(--secondary)] border border-[var(--accent)]/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-200"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                placeholder="Your message..."
                className="w-full px-4 py-3 mt-2 rounded-xl bg-[var(--secondary)] border border-[var(--accent)]/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition-all duration-300 shadow-md"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-6 text-gray-200">
            <div className="flex items-center gap-4 bg-[var(--secondary)]/60 backdrop-blur-md p-4 rounded-xl border border-[var(--accent)]/10 hover:scale-105 transition">
              <FaEnvelope className="text-[var(--accent)] text-xl flex-shrink-0" />
              <span>support@kaamexpress.com</span>
            </div>

            <div className="flex items-center gap-4 bg-[var(--secondary)]/60 backdrop-blur-md p-4 rounded-xl border border-[var(--accent)]/10 hover:scale-105 transition">
              <FaPhoneAlt className="text-[var(--accent)] text-xl flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-4 bg-[var(--secondary)]/60 backdrop-blur-md p-4 rounded-xl border border-[var(--accent)]/10 hover:scale-105 transition">
              <FaMapMarkerAlt className="text-[var(--accent)] text-xl flex-shrink-0" />
              <span>KaamExpress HQ, New Delhi, India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
