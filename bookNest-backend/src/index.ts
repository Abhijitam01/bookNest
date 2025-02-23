import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import connectDB from "./config/db";
import bookRoutes from "./routes/books";
import userRoutes from "./routes/users"; 

dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);
// app.use("/api/users", userRoutes); // Comment this out for now if you want

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI ;
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
