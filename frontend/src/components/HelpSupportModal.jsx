import React from "react";

export default function HelpSupportModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[var(--card)] rounded-2xl shadow-xl p-8 w-full max-w-md border border-[var(--accent)]/20 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-[var(--accent)]"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[var(--accent)]">
          Help & Support
        </h2>
        <div className="text-gray-300 mb-4">
          For any queries or issues, contact us at{" "}
          <span className="text-[var(--accent)]">support@kaamexpress.com</span>{" "}
          or call <span className="text-[var(--accent)]">1800-123-456</span>.
        </div>
        <button
          className="px-4 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
