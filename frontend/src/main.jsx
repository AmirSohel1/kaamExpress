import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./contexts/AuthContext.jsx";

// Set dark mode class on body
const DarkModeInit = ({ children }) => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  return children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeInit>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </DarkModeInit>
  </StrictMode>
);
