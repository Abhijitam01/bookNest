import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || ""; // Ensure it's not undefined

    if (!mongoURI) {
      throw new Error("❌ MONGODB_URI is missing from .env file");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;
