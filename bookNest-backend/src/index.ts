import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/books";
// import userRoutes from "./routes/users"; // Comment this out for now if you want

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);
// app.use("/api/users", userRoutes); // Comment this out for now if you want

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/booknest";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
