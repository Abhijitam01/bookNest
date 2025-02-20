import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  author: { type: String },
  notes: { type: String },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Book", BookSchema);
