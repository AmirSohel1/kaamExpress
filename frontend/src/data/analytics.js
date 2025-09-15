// Dummy analytics/statistics data
import { FaUser, FaUsers, FaBriefcase, FaDollarSign } from "react-icons/fa";

// Use string identifiers for icons. Map these to React elements in your components.
export const stats = [
  { icon: "users", label: "Total Workers", value: 4 },
  { icon: "user", label: "Total Customers", value: 4 },
  { icon: "briefcase", label: "Total Bookings", value: 3 },
  { icon: "dollar", label: "Total Revenue", value: "₹22,500" },
];

export const bookingsGrowth = [16, 22, 35, 32, 44, 54];
export const revenueGrowth = [1500, 2500, 2200, 3400, 4500, 5900];
export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export const serviceDist = [
  { label: "Plumbing", value: 12, color: "#00e6c3" },
  { label: "Carpentry", value: 15, color: "#00c3ff" },
  { label: "Electrical", value: 10, color: "#ffc300" },
  { label: "Cleaning", value: 20, color: "#ff4d4d" },
];
export const workerStatus = [
  { label: "Approved", value: 3, color: "#00e676" },
  { label: "Pending", value: 1, color: "#ffc300" },
];
// ...removed duplicate PlatformInsights export...
export const PlatformInsights = [
  {
    icon: "growth", // up arrow
    label: "25% Growth",
    desc: "Bookings this month",
  },
  {
    icon: "users", // users icon
    label: "85% Active",
    desc: "Worker engagement rate",
  },
  {
    icon: "dollar", // dollar icon
    label: "4.8/5",
    desc: "Average customer rating",
  },
];
