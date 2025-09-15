import React, { useState, useEffect } from "react";

export default function ProfileSettingsModal({ user, open, onClose, onSave }) {
  // Initialize form state with user prop
  const [form, setForm] = useState(user);

  // Use useEffect to sync internal state with external prop changes
  // This ensures the modal always opens with the most current user data
  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

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
          Edit Profile
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <input
              className="w-full px-3 py-2 rounded bg-[var(--secondary)] border border-[var(--accent)]/20 text-white"
              value={form.role}
              disabled
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
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
