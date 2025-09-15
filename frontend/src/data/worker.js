export const worker = {
  id: 11,
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "+91 9876543210",
  experience: 5,
  address: "123 Main Street, Mumbai, India",
  skills: ["Carpentry", "Furniture Repair"],
  about:
    "Experienced carpenter specializing in furniture repair and custom work. Passionate about quality craftsmanship.",
  availability: true,
  jobs: [
    { id: 301, service: "Carpenter", customer: "Amir Khan", status: "pending" },
    {
      id: 302,
      service: "Carpenter",
      customer: "Sonia Patel",
      status: "completed",
    },
  ],
  earnings: [
    { jobId: 301, amount: 500, status: "Pending" },
    { jobId: 302, amount: 800, status: "Paid" },
  ],
  ratings: [
    { customer: "Amir Khan", stars: 5, comment: "Excellent work" },
    { customer: "Sonia Patel", stars: 4, comment: "Good but late" },
  ],
};
