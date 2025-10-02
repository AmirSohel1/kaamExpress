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

export const me = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to fetch user profile.";
    throw new Error(message);
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await api.put("/auth/update-profile", data);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Profile update failed. Please try again.";
    throw new Error(message);
  }
};

export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const res = await api.put("/auth/update-password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Password update failed. Please try again.";
    throw new Error(message);
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const res = await api.post("/auth/forgot-password", { email });
    // console.log(res.data);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Request failed. Please try again.";
    throw new Error(message);
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await api.post("/auth/reset-password", data);
    // console.log(res.data);
    return res.data; // No console.log
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Request failed. Please try again.";
    throw new Error(message);
  }
};
