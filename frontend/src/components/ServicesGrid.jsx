// src/components/ServicesGrid.jsx
import React from "react";
import ServiceCard from "./ServiceCard";

const ServicesGrid = ({ services }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl mx-auto animate-fade-in-up">
      {services.map((service, index) => (
        <ServiceCard
          key={service._id}
          service={service}
          style={{ animationDelay: `${index * 100}ms` }} // staggered effect
        />
      ))}
    </div>
  );
};

export default ServicesGrid;
