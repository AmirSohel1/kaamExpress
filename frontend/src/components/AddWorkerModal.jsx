import React, { useState } from "react";

const AddWorkerModal = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    skills: "",
    rating: "",
    joinDate: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.skills || !form.rating || !form.joinDate) return;
    onAdd({
      ...form,
      id: Date.now(),
      skills: form.skills.split(",").map((s) => s.trim()),
      rating: parseFloat(form.rating),
    });
    setForm({
      name: "",
      skills: "",
      rating: "",
      joinDate: "",
      status: "Pending",
    });
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <form
        className="bg-[var(--card)] rounded-xl shadow-lg p-8 w-full max-w-md relative flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 text-xl"
          type="button"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-[var(--accent)] mb-2">
          Add New Worker
        </h2>
        <input
          className="bg-[var(--secondary)] rounded px-3 py-2 text-white outline-none"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="bg-[var(--secondary)] rounded px-3 py-2 text-white outline-none"
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
          required
        />
        <input
          className="bg-[var(--secondary)] rounded px-3 py-2 text-white outline-none"
          name="rating"
          placeholder="Rating (e.g. 4.5)"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={form.rating}
          onChange={handleChange}
          required
        />
        <input
          className="bg-[var(--secondary)] rounded px-3 py-2 text-white outline-none"
          name="joinDate"
          placeholder="Join Date (MM/DD/YYYY)"
          value={form.joinDate}
          onChange={handleChange}
          required
        />
        <button
          className="mt-2 px-4 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition"
          type="submit"
        >
          Add Worker
        </button>
      </form>
    </div>
  );
};

export default AddWorkerModal;
