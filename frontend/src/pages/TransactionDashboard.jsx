import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(3); // default March
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.get("/api/transactions", {
          params: {
            page: currentPage,
            perPage: PER_PAGE,
            search,
            month,
          },
        });

      
        setTransactions(data.transactions); // Set transactions from response
        setTotalPages(data.totalPages); // Set totalPages from response
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };

    fetchTransactions();
  }, [search, month, currentPage]);

  const handleMonthChange = (e) => {
    setMonth(Number(e.target.value)); // Set month as number (1-12)
    setCurrentPage(1); // Reset to first page when month changes
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Transaction Dashboard</h2>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {/* Month Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="month" className="font-medium">
            Select Month:
          </label>
          <select
            id="month"
            value={month}
            onChange={handleMonthChange}
            className="border border-gray-300 rounded-md px-3 py-1"
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

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md px-3 py-1 w-64"
        />
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow rounded-lg overflow-hidden">
          <thead>

            <tr className="bg-gray-200 text-left text-gray-600">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Sold</th>
              <th className="px-4 py-2">Image</th>
            </tr>

          </thead>

          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={`${index % 2 === 0 ? "bg-blue-100 font-medium" : "bg-white font-medium"}`}
              >
                <td className="px-4 py-2">{transaction.id}</td>
                <td className="px-4 py-2">{transaction.title}</td>
                <td className="px-4 py-2">{transaction.description}</td>
                <td className="px-4 py-2">{transaction.price}</td>
                <td className="px-4 py-2">{transaction.category}</td>
                <td className="px-4 py-2">
                  {transaction.sold ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-bold">No</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    className="h-10"
                  />
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous Page
        </button>
        
        <span className="font-medium">
          Page {totalPages !== 0?currentPage:0} of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default TransactionDashboard;
