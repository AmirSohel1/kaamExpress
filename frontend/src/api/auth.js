import api from "./api";

// Login
export const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;

    return { token, user };
  } catch (err) {
    const message =
      err.response?.data?.message || "Login failed. Please try again.";
    throw new Error(message);
  }
};

// Signup
export const signup = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    const { token, user } = res.data;
    return { token, user };
  } catch (err) {
    const message =
      err.response?.data?.message || "Signup failed. Please try again.";
    throw new Error(message);
  }
};

// Logout
export const logout = () => {
  setAuthToken(null);
};
