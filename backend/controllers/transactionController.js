import axios from "axios";
import Transaction from "../models/Transaction.js";

export const initializeDatabase = async (req, res) => {
  try {
    // Check if data already exists in the database
    const existingData = await Transaction.countDocuments();
    if (existingData == 0) {
      // Fetch data from the third-party API
      const { data } = await axios.get(
        "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
      );

      // Insert the data into the database
      await Transaction.insertMany(data);

      res.status(201).json({ message: "Database initialized successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error initializing database", error: error.message });
  }
};

// List transactions with search and pagination
export const getTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search, month } = req.query;

  try {
    // Initialize the filter object
    let filter = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, Number(month)], // Match the selected month
      },
    };

    // Convert search to a number, checking for decimal prices
    let priceSearch = search ? parseFloat(search) : NaN;
    // If the search is a valid number (including decimals) and not NaN
    if (!isNaN(priceSearch) && priceSearch !== 0) {
      filter.price = priceSearch;
    } else {
      // Otherwise, search by title and description
      const regex = new RegExp(search, "i"); // Case-insensitive regex for text search
      filter.$or = [{ title: regex }, { description: regex }];
    }
    // Get total count of transactions that match the filter (for pagination)
    const totalTransactions = await Transaction.countDocuments(filter);
    // Fetch the transactions with pagination
    const transactions = await Transaction.find(filter)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    // Calculate total pages based on the total number of transactions
    const totalPages = Math.ceil(totalTransactions / perPage);

    // Send response with the fetched transactions and total page count
    res.json({
      transactions,
      totalPages,
    });
  } catch (error) {
    console.error("Error in fetching transactions:", error);
    res.status(500).json({
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};


// Get statistics for the selected month
export const getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const monthNumber = Number(month);

    // Aggregate total sales and sold items for the selected month
    const totalSales = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }, // Match selected month
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" }, // Sum up the prices of sold items
          count: { $sum: 1 }, // Count the number of sold items
        },
      },
    ]);

    // Count not sold items for the selected month
    const notSoldCount = await Transaction.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }, // Match selected month
      sold: false,
    });

    // Return statistics
    res.json({
      totalSales: totalSales[0]?.total || 0, // Total sales amount
      soldItems: totalSales[0]?.count || 0, // Total sold items
      notSoldItems: notSoldCount, // Total not sold items
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching statistics", error: error.message });
  }
};

export const getBarChart = async (req, res) => {
  const { month } = req.query;

  try {
    const monthNumber = Number(month);

    // Aggregate data for the selected month
    const ranges = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }, // Match the selected month
        },
      },
      {
        $bucket: {
          groupBy: "$price", // Group transactions by price
          boundaries: [
            0,
            101,
            201,
            301,
            401,
            501,
            601,
            701,
            801,
            901,
            Infinity,
          ], // Define price ranges
          default: "901+", // Bucket for prices above 901
          output: { count: { $sum: 1 } }, // Count items in each range
        },
      },
    ]);

    res.json(ranges); // Send the aggregated data as a response
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bar chart data", error: error.message });
  }
};

export const getPieChart = async (req, res) => {
  const { month } = req.query;

  try {
    const monthNumber = Number(month);

    // Aggregate unique categories and their item counts for the selected month
    const categories = await Transaction.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }, // Match the selected month
        },
      },
      {
        $group: {
          _id: "$category", // Group by category
          count: { $sum: 1 }, // Count the number of items in each category
        },
      },
    ]);

    res.json(categories); // Send the aggregated data as a response
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pie chart data", error: error.message });
  }
};

// Fetch and combine data from all three APIs
export const getCombinedData = async (req, res) => {
  const { month } = req.query; // Expect the month parameter from the request
  try {
    // URLs for internal APIs
    const statisticsUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/transactions/statistics?month=${month}`;
    const barChartUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/transactions/bar-chart?month=${month}`;
    const pieChartUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/transactions/pie-chart?month=${month}`;

    // Fetch data concurrently from all three APIs
    const [statisticsResponse, barChartResponse, pieChartResponse] =
      await Promise.all([
        axios.get(statisticsUrl),
        axios.get(barChartUrl),
        axios.get(pieChartUrl),
      ]);

    // Combine the results into a single JSON response
    const combinedData = {
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };

    res.status(200).json(combinedData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching combined data", error: error.message });
  }
};
