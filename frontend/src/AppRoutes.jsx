import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import About from "./pages/LandingHome/About";
import Contact from "./pages/LandingHome/Contact";
import Services from "./pages/LandingHome/Services";
import HowItWorks from "./pages/LandingHome/components/HowItWorksSection";
import WorkerRegistration from "./pages/WorkerRegistration";

// Worker pages
import WorkerDashboard from "./pages/worker/Dashboard";
import {
  Profile,
  Jobs,
  Earnings,
  Ratings,
  Notifications as WorkerNotifications,
} from "./pages/worker";

// Customer pages
import {
  Bookings,
  History,
  Homepage,
  Notifications,
  Payments,
} from "./pages/customer";

import ServiceWorkers from "./pages/customer/ServiceWorkers";
import WorkerProfile from "./pages/customer/WorkerProfile";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminWorkers from "./pages/admin/Workers";
import AdminCustomers from "./pages/admin/Customers";
import AdminBookings from "./pages/admin/Bookings";
import AdminDisputes from "./pages/admin/Disputes";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminServices from "./pages/admin/Services";

import LandingPage from "./pages/LandingHome/LandingPage";
import Signup from "./pages/Signup";
import Header from "./pages/LandingHome/components/Header";
import Footer from "./components/Footer";
import MakePayment from "./components/MakePayment";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Layout for public landing pages
const PublicLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

// Fallback page
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-6xl md:text-8xl font-bold text-red-500 mb-4 animate-pulse">
        404
      </h1>
      <p className="text-2xl md:text-3xl font-semibold mb-6 text-gray-300 text-center">
        Page Not Found
      </p>
      <p className="text-lg md:text-xl text-gray-400 text-center max-w-lg mb-8">
        The page you're looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
      >
        Go to Homepage
      </a>
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    {/* Public Landing + Auth */}
    <Route element={<PublicLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/howIsItWork" element={<HowItWorks />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/worker-profile-setup" element={<WorkerRegistration />} />
    </Route>

    {/* Protected Customer Routes */}
    <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
      <Route path="/worker/make-payment/:bookingId" element={<MakePayment />} />
      <Route element={<DashboardLayout />}>
        <Route path="customer">
          <Route index element={<Homepage />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="history" element={<History />} />
          <Route path="payments" element={<Payments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="service/:serviceId" element={<ServiceWorkers />} />
          <Route path="worker/:workerId" element={<WorkerProfile />} />
        </Route>
      </Route>
    </Route>

    {/* Protected Worker Routes */}
    <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="worker">
          <Route index element={<WorkerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="ratings" element={<Ratings />} />
          <Route path="notifications" element={<WorkerNotifications />} />
        </Route>
      </Route>
    </Route>

    {/* Protected Admin Routes */}
    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route element={<DashboardLayout />}>
        <Route path="admin">
          <Route index element={<AdminDashboard />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Route>
    </Route>

    {/* Catch-all 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
