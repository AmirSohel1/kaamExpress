import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : { token: null, user: null }; // no extra "role" here
  });

  const login = (data) => {
    // Save full backend shape { token, user: { name, email, role } }
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    const emptyAuth = { token: null, user: null };
    localStorage.setItem("auth", JSON.stringify(emptyAuth));
    setAuth(emptyAuth);
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
