import React from "react";
import { Link } from "react-router-dom"; // Import Link to handle routing

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          Translytics
        </div>
        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-white hover:text-blue-300 transition duration-300"
          >
            Dashboard
          </Link>
          <Link
            to="/transaction-statistics"
            className="text-white hover:text-blue-300 transition duration-300"
          >
            Statistics
          </Link>
          <Link
            to="/transaction-bar-chart"
            className="text-white hover:text-blue-300 transition duration-300"
          >
            Bar Chart
          </Link>
          <Link
            to="/transaction-pie-chart"
            className="text-white hover:text-blue-300 transition duration-300"
          >
            Pie Chart
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
