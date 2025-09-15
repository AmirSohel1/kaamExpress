const mongoose = require("mongoose");
const Service = require("./models/Service");

const customerServices = [
  {
    name: "Carpentry",
    description: "Wood work, furniture repair, and custom carpentry",
    categories: ["Home", "Woodwork"],
    priceRange: "₹500-800",
  },
  {
    name: "Plumbing",
    description: "Pipe repair, bathroom fittings, and water leakage fixes",
    categories: ["Home", "Maintenance"],
    priceRange: "₹300-600",
  },
  {
    name: "Electrical",
    description: "Wiring, electrical repairs, and appliance installation",
    categories: ["Home", "Appliances"],
    priceRange: "₹400-700",
  },
  {
    name: "Cleaning",
    description: "Home cleaning, deep cleaning, and office maintenance",
    categories: ["Home", "Office"],
    priceRange: "₹200-500",
  },
  {
    name: "Painting",
    description: "Wall painting, interior and exterior decoration",
    categories: ["Home", "Decoration"],
    priceRange: "₹600-1000",
  },
  {
    name: "AC Repair",
    description: "Air conditioner repair, gas refilling, and maintenance",
    categories: ["Cooling", "Appliances"],
    priceRange: "₹500-900",
  },
  {
    name: "Pest Control",
    description:
      "Cockroach, termite, rodent, and mosquito pest control services",
    categories: ["Home", "Safety"],
    priceRange: "₹700-1500",
  },
  {
    name: "Salon at Home",
    description:
      "Haircut, waxing, facial, manicure & pedicure at your doorstep",
    categories: ["Personal Care", "Beauty"],
    priceRange: "₹300-1200",
  },
  {
    name: "Appliance Repair",
    description: "Washing machine, refrigerator, and microwave repair services",
    categories: ["Home", "Appliances"],
    priceRange: "₹400-900",
  },
  {
    name: "Packers & Movers",
    description: "Home shifting, office relocation, and transportation",
    categories: ["Logistics", "Shifting"],
    priceRange: "₹2000-8000",
  },
  {
    name: "CCTV Installation",
    description: "Home and office CCTV setup and maintenance",
    categories: ["Security", "Electronics"],
    priceRange: "₹1500-3000",
  },
  {
    name: "Gardening",
    description: "Garden setup, lawn maintenance, and plant care services",
    categories: ["Outdoor", "Home"],
    priceRange: "₹500-1500",
  },
  {
    name: "Driving Instructor",
    description: "Car and two-wheeler driving training with professionals",
    categories: ["Transport", "Learning"],
    priceRange: "₹2000-4000",
  },
  {
    name: "Home Tutoring",
    description: "Private tutors for school subjects and competitive exams",
    categories: ["Education", "Learning"],
    priceRange: "₹500-2000",
  },
  {
    name: "Event Catering",
    description: "Food catering for parties, weddings, and corporate events",
    categories: ["Food", "Events"],
    priceRange: "₹5000-20000",
  },
];

const start = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/kaamexpress");
    console.log("MongoDB connected");

    await Service.deleteMany({});
    await Service.insertMany(customerServices);

    console.log("Services seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
