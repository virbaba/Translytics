import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TransactionBarChart = () => {
  const [month, setMonth] = useState(3); // Default to January
  const [chartData, setChartData] = useState(null);

  // Fetch and process chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/transactions/bar-chart", {
          params: { month },
        });
        const data = response.data;

        // Format data for the chart
        const labels = data.map((range, index) => {
          const start = range._id;
          const end = data[index + 1]?._id || "Infinity";
          return `${start}-${end === "Infinity" ? "+" : end - 1}`;
        });

        const counts = data.map((range) => Math.round(range.count)); // Round counts to whole numbers

        setChartData({
          labels,
          datasets: [
            {
              label: "Number of Items",
              data: counts,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Transaction Bar Chart</h2>

      {/* Month Selector */}
      <div className="mb-6">
        <label htmlFor="month" className="block text-lg font-medium mb-2">
          Select Month:
        </label>
        <select
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Bar Chart */}
      {chartData ? (
        <div className="bg-white p-4 rounded-md shadow flex justify-center">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: (context) => `${context.raw} items`, // Ensure tooltips display whole numbers
                  },
                },
              },
              scales: {
                x: { title: { display: true, text: "Price Range (₹)" } },
                y: {
                  title: { display: true, text: "Number of Items" },
                  ticks: {
                    precision: 0, // Force Y-axis ticks to be integers
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default TransactionBarChart;
