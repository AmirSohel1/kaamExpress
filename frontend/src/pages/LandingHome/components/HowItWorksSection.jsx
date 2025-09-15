import React from "react";

const steps = [
  {
    step: 1,
    title: "Sign Up",
    desc: "Create your account as a customer or worker to get started on KaamExpress.",
  },
  {
    step: 2,
    title: "Browse & Book",
    desc: "Customers can browse services and book workers. Workers can view and accept jobs.",
  },
  {
    step: 3,
    title: "Work & Payment",
    desc: "Workers complete the job, and customers pay securely through the platform.",
  },
  {
    step: 4,
    title: "Rate & Review",
    desc: "Both customers and workers can rate and review each other for better trust and quality.",
  },
];

const HowItWorksSection = () => (
  <section className="w-full min-h-[calc(100vh-4rem)] h-full overflow-y-auto py-12 px-4 sm:px-6 md:px-8 bg-[var(--primary)] text-white">
    <div className="max-w-4xl mx-auto">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-[var(--accent)] animate-fade-in-up">
        How It Works
      </h2>
      <p className="text-gray-400 text-center text-sm sm:text-lg mb-12 animate-fade-in-up delay-200">
        Get started in just a few easy steps and make the most of KaamExpress.
      </p>

      {/* Steps */}
      <ol className="space-y-6">
        {steps.map((item, index) => (
          <li
            key={item.step}
            className="bg-[var(--card)] rounded-2xl p-6 shadow-lg border border-[var(--accent)]/20 hover:border-[var(--accent)] transition-all duration-300 flex flex-col sm:flex-row items-center gap-4 hover:shadow-2xl hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 100 + 100}ms` }}
          >
            {/* Step Number */}
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--secondary)] text-[var(--accent)] font-bold text-lg shadow-md group-hover:bg-[var(--accent)] group-hover:text-[var(--primary)] transition-all duration-300">
              {item.step}
            </span>

            {/* Step Details */}
            <div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-[var(--accent)] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {item.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorksSection;
