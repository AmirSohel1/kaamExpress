import React from "react";
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-blue-950 to-indigo-950 text-gray-300 pt-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-extrabold text-teal-400 mb-4">
            KaamExpress
          </h3>
          <p className="text-sm leading-relaxed">
            Connecting you with reliable daily wage workers for every need.
            Seamless service, trusted professionals, all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about" },
              { name: "Services", path: "/services" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <li key={link.path}>
                <a
                  href={link.path}
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
          <div className="flex justify-start md:justify-center gap-5 text-2xl">
            {[
              { icon: <FaTwitter />, url: "https://twitter.com" },
              { icon: <FaFacebook />, url: "https://facebook.com" },
              { icon: <FaLinkedin />, url: "https://linkedin.com" },
              { icon: <FaInstagram />, url: "https://instagram.com" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors duration-200"
                aria-label="Social Link"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-12 border-t border-gray-800 py-6 text-center text-sm text-gray-400">
        © {currentYear} <span className="text-teal-400">KaamExpress</span>. All
        rights reserved.
      </div>
    </footer>
  );
}
