import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Unique identifier for the transaction
  title: { type: String, required: true },            // Title of the product
  price: { type: Number, required: true },            // Price of the product
  description: { type: String, required: true },      // Description of the product
  category: { type: String, required: true },         // Category of the product
  image: { type: String, required: true },            // Image URL for the product
  sold: { type: Boolean, required: true },            // Sold status
  dateOfSale: { type: Date, required: true }          // Date of sale
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
