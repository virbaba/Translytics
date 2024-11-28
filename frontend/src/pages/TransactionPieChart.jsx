import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import axios from "axios";

// Register required Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const TransactionPieChart = () => {
  const [month, setMonth] = useState(3); // Default to March
  const [chartData, setChartData] = useState(null);

  // Fetch and process chart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/transactions/pie-chart", {
          params: { month },
        });
        const data = response.data;

        // Format data for the chart
        const labels = data.map((category) => category._id);
        const counts = data.map((category) => category.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Transactions by Category",
              data: counts,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md  h-screen flex flex-col ">
      <h2 className="text-2xl font-bold mb-4">Transaction Pie Chart <span className="font-bold text-sm">(Hover on pie chart)</span></h2>
     
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

      {/* Pie Chart */}
      {chartData ? (
        <div className="bg-white p-4 rounded-md shadow h-3/4 flex justify-center">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                tooltip: {
                  enabled: true,
                  callbacks: {
                    label: (context) => `${context.raw} transactions`, // Display count in the tooltip
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

export default TransactionPieChart;
