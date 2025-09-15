import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "How It Works", path: "/howIsItWork" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-lg backdrop-blur-md bg-opacity-90">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
        {/* Logo / Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="text-3xl font-extrabold text-teal-400">
            KaamExpress
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base font-medium 
                ${
                  isActive
                    ? "bg-teal-500 text-gray-900"
                    : "hover:bg-teal-500 hover:text-gray-900"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden sm:flex gap-3">
          <button
            className="px-5 py-2 rounded-full bg-teal-500 text-gray-900 font-semibold hover:bg-teal-400 transition-colors duration-300 shadow-md text-sm sm:text-base"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="px-5 py-2 rounded-full border border-teal-500 text-teal-400 font-semibold hover:bg-teal-500 hover:text-gray-900 transition-colors duration-300 shadow-md text-sm sm:text-base"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="sm:hidden flex flex-col items-center gap-4 pb-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block w-full text-center px-4 py-2 rounded-lg transition-all duration-300 text-base font-medium 
                ${
                  isActive
                    ? "bg-teal-500 text-gray-900"
                    : "hover:bg-teal-500 hover:text-gray-900"
                }`
              }
              onClick={() => setIsOpen(false)} // close menu after click
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 w-full px-6 mt-2">
            <button
              className="px-5 py-2 rounded-full bg-teal-500 text-gray-900 font-semibold hover:bg-teal-400 transition-colors duration-300 shadow-md"
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>
            <button
              className="px-5 py-2 rounded-full border border-teal-500 text-teal-400 font-semibold hover:bg-teal-500 hover:text-gray-900 transition-colors duration-300 shadow-md"
              onClick={() => {
                setIsOpen(false);
                navigate("/signup");
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
