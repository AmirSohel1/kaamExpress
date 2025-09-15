// src/data/workerDashboard.js
// Dummy data for worker dashboard page

export const workerStatBox = [
  {
    label: "Total Earnings",
    value: "₹12,500",
    icon: "dollar",
  },
  {
    label: "Total Jobs",
    value: "28",
    icon: "briefcase",
  },
  {
    label: "Completed Jobs",
    value: "24",
    icon: "check",
  },
  {
    label: "Rating",
    value: "4.7/5",
    icon: "star",
  },
];

export const workerJobs = [
  {
    service: "Carpentry",
    customer: "Amir Khan",
    city: "Delhi",
    date: "10/09/2025",
    amount: 1200,
    status: "Completed",
  },
  {
    service: "Furniture Repair",
    customer: "Sonia Patel",
    city: "Mumbai",
    date: "05/09/2025",
    amount: 800,
    status: "Pending",
  },
  {
    service: "Wood Polishing",
    customer: "Raj Kumar",
    city: "Bangalore",
    date: "01/09/2025",
    amount: 1500,
    status: "Ongoing",
  },
];

export const workerReviews = [
  {
    customer: "Amir Khan",
    date: "08/09/2025",
    stars: 5,
    comment: "Excellent work, very professional!",
  },
  {
    customer: "Sonia Patel",
    date: "02/09/2025",
    stars: 4,
    comment: "Good service, but arrived a bit late.",
  },
  {
    customer: "Raj Kumar",
    date: "25/08/2025",
    stars: 5,
    comment: "Perfect job, highly recommended!",
  },
];
