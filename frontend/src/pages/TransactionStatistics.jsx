import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionStatistics = () => {
  const [month, setMonth] = useState(3); // Default month is March
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    soldItems: 0,
    notSoldItems: 0,
  });

  // Fetch statistics whenever the month changes
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data } = await axios.get("/api/transactions/statistics", {
          params: { month },
        });
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error.message);
      }
    };

    fetchStatistics();
  }, [month]);

  // Handle month change
  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Transaction Statistics
      </h2>

      {/* Month Selector */}
      <div className="flex justify-center items-center mb-8">
        <label htmlFor="month" className="font-medium mr-2">
          Select Month:
        </label>
        <select
          id="month"
          value={month}
          onChange={handleMonthChange}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
            (m, index) => (
              <option key={index} value={index + 1}>
                {m}
              </option>
            )
          )}
        </select>
      </div>

      {/* Statistics Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Sales */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-700">Total Sales</h3>
          <p className="text-2xl text-blue-600 font-semibold mt-2">
            ₹{statistics.totalSales.toLocaleString()}
          </p>
        </div>

        {/* Total Sold Items */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-700">Total Sold Items</h3>
          <p className="text-2xl text-green-600 font-semibold mt-2">
            {statistics.soldItems}
          </p>
        </div>

        {/* Total Not Sold Items */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-gray-700">Total Not Sold Items</h3>
          <p className="text-2xl text-red-600 font-semibold mt-2">
            {statistics.notSoldItems}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatistics;
