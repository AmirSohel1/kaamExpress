import React from "react";

const SearchBar = ({ value, onChange, placeholder }) => (
  <div className="w-full max-w-xl mx-auto mb-8">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-lg bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-accent transition"
    />
  </div>
);

export default SearchBar;
