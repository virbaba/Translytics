import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import transactionRoutes from './routes/transactionRoutes.js';
import path from "path";


const PORT = 1001;
// Initialize app
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect to MongoDB
connectDB();

// Routes
app.use('/api/transactions', transactionRoutes);

 // Static Files Middleware (for production)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));


// Catch-All Route (for React Router in frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
