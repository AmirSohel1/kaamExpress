// src/utils/getServiceIcon.js
import React from "react";
import {
  FaHammer,
  FaWrench,
  FaBolt,
  FaBroom,
  FaPaintBrush,
  FaSnowflake,
  FaBug,
  FaCut,
  FaTools,
  FaTruckMoving,
  FaVideo,
  FaLeaf,
  FaCar,
  FaBook,
  FaUtensils,
} from "react-icons/fa";

export const getServiceIcon = (name) => {
  switch (name.toLowerCase()) {
    case "carpentry":
      return <FaHammer />;
    case "plumbing":
      return <FaWrench />;
    case "electrical":
      return <FaBolt />;
    case "cleaning":
      return <FaBroom />;
    case "painting":
      return <FaPaintBrush />;
    case "ac repair":
      return <FaSnowflake />;
    case "pest control":
      return <FaBug />;
    case "salon at home":
      return <FaCut />;
    case "appliance repair":
      return <FaTools />;
    case "packers & movers":
      return <FaTruckMoving />;
    case "cctv installation":
      return <FaVideo />;
    case "gardening":
      return <FaLeaf />;
    case "driving instructor":
      return <FaCar />;
    case "home tutoring":
      return <FaBook />;
    case "event catering":
      return <FaUtensils />;
    default:
      return <FaTools />; // fallback
  }
};
