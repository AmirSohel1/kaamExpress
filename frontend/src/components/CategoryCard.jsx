import React from "react";

const CategoryCard = ({ icon, name, onClick }) => (
  <div
    className="flex flex-col items-center justify-center bg-card rounded-xl p-6 shadow-md hover:shadow-lg cursor-pointer transition border border-gray-700 hover:border-accent"
    onClick={onClick}
  >
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-lg font-semibold">{name}</div>
  </div>
);

export default CategoryCard;
