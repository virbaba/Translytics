import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://virendersinghdev1:W1H57zVG8VBxPVFM@cluster0.4b7sp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("😊 MongoDB connected successfully!");
  } catch (err) {
    console.error("🔥 MongoDB connection error:", err);
    process.exit(1); // Exit the process with failure
  }
}; 

export default connectDB;