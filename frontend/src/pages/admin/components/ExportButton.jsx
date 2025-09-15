import React from "react";

const ExportButton = ({ services }) => {
  const handleExport = () => {
    if (!services || services.length === 0) return;

    // Prepare CSV header and rows
    const csvContent = [
      ["ID", "Name", "Description", "Categories", "Price Range", "Status"],
      ...services.map((s) => [
        s._id || "",
        s.name || "",
        s.description || "",
        s.categories?.join("; ") || "",
        s.priceRange || "",
        s.isActive ? "Active" : "Inactive",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(",")) // wrap in quotes for safety
      .join("\n");

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "services.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="px-6 py-2 rounded bg-[var(--accent)] text-black font-semibold hover:bg-[var(--accent)]/80 transition"
      onClick={handleExport}
    >
      Export Data
    </button>
  );
};

export default ExportButton;
