import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String, required: true },
    status: {
      type: String,
      enum: ["unread", "reading", "read", "wishlist", "purchased"],
      default: "unread",
    },
    notes: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    images: [
      {
        url: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    bookmarks: [
      {
        page: String,
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastOpened: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [{
      text: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      createdAt: { type: Date, default: Date.now }
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Book", bookSchema);
