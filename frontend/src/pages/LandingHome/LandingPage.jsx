import React from "react";

import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
// import WorkerShowcase from "./components/WorkerShowcase";
import CallToActionSection from "./components/CallToActionSection";
import WorkerShowcase from "./components/WorkerShowcase";

export default function LandingPage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      {/* The WorkerShowcase component is assumed to exist and imported. */}
      {/* You might want to pass props to it, e.g., <WorkerShowcase title="Top Categories" /> */}
      <WorkerShowcase />
      <CallToActionSection />
    </main>
  );
}
