import React from "react";
import { FaTools } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-[#232b36] text-gray-300 pt-12 pb-6 px-4 mt-16">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FaTools className="text-accent text-2xl" />
          <span className="font-bold text-lg text-white">KaamExpress</span>
        </div>
        <p className="text-sm text-gray-400">
          Connecting customers with skilled workers for all their home and
          office needs. Safe, reliable, and professional service guaranteed.
        </p>
      </div>
      <div>
        <div className="font-semibold text-white mb-2">Services</div>
        <ul className="text-sm space-y-1">
          <li>Carpentry</li>
          <li>Plumbing</li>
          <li>Electrical</li>
          <li>Cleaning</li>
        </ul>
      </div>
      <div>
        <div className="font-semibold text-white mb-2">Company</div>
        <ul className="text-sm space-y-1">
          <li>About Us</li>
          <li>Contact</li>
          <li>Privacy</li>
          <li>Terms</li>
        </ul>
      </div>
    </div>
    <div className="text-center text-xs text-gray-500 pt-6">
      © 2024 KaamExpress. All rights reserved.
    </div>
  </footer>
);

export default Footer;
