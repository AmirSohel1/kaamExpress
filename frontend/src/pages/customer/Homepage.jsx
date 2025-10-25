// src/pages/Homepage.jsx
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ServicesGrid from "../../components/service/ServicesGrid";
import api from "../../api/api";

const Homepage = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };
    fetchServices();
  }, []);

  // Optional: filter services based on search term
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] px-4 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="w-full max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
            Find Skilled Workers for Any Job
          </h1>
          <p className="text-gray-400 mb-8 text-sm sm:text-lg">
            Book trusted professionals for carpentry, plumbing, electrical work,
            and more now.
          </p>

          {/* Search Bar */}
          <div className="relative flex justify-center w-full px-4">
            <input
              type="text"
              placeholder="Search for a service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-xl px-6 py-3 rounded-xl text-white 
                border border-gray-700 text-sm sm:text-lg pr-12 
                focus:outline-none focus:ring-2 focus:ring-[var(--accent)] 
                transition shadow-sm hover:shadow-md"
            />
            <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-lg pointer-events-none" />
          </div>
        </div>

        {/* Services Grid */}
        <ServicesGrid services={filteredServices} />
      </div>
    </div>
  );
};

export default Homepage;
