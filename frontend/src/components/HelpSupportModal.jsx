import React from "react";
import { FaEnvelope, FaPhoneAlt, FaQuestionCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function HelpSupportModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-lg p-6 bg-[var(--card)] rounded-2xl shadow-xl border border-[var(--accent)]/20 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-[var(--accent)]"
          onClick={onClose}
        >
          <IoClose size={28} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-[var(--accent)] flex items-center gap-2">
          <FaQuestionCircle /> Help & Support
        </h2>

        {/* Contact Info */}
        <div className="mb-6 text-gray-300 space-y-3">
          <p>
            If you have any questions or need assistance, our support team is
            here to help you.
          </p>
          <div className="flex items-center gap-3">
            <FaEnvelope className="text-[var(--accent)]" />
            <span>support@kaamexpress.com</span>
          </div>
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-[var(--accent)]" />
            <span>1800-123-456</span>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">
            Frequently Asked Questions
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>How can I reset my password?</li>
            <li>How do I track my order?</li>
            <li>How can I update my account information?</li>
            <li>What payment methods are accepted?</li>
          </ul>
        </div>

        {/* Quick Tips */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">
            Quick Tips
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              Keep your account information updated for smooth deliveries.
            </li>
            <li>
              Check our FAQs before reaching out to support for faster answers.
            </li>
            <li>
              Use the app notifications to stay updated with your order status.
            </li>
          </ul>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            className="px-5 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
