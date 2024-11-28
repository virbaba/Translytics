import React, { useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TransactionBarChart from "./pages/TransactionBarChart";
import TransactionDashboard from "./pages/TransactionDashboard";
import TransactionStatistics from "./pages/TransactionStatistics";
import TransactionPieChart from "./pages/TransactionPieChart";

const App = () => {
  // Function to initialize the database when the component mounts
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const response = await axios.get("/api/transactions/initialize");
        const data = await response.json();
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initializeDatabase(); // Call the function to initialize the database when the component loads
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<TransactionDashboard />} />
        <Route
          path="/transaction-statistics"
          element={<TransactionStatistics />}
        />
        <Route
          path="/transaction-bar-chart"
          element={<TransactionBarChart />}
        />
        <Route
          path="/transaction-pie-chart"
          element={<TransactionPieChart />}
        />
      </Routes>
    </div>
  );
};

export default App;
