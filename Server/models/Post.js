import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  content: { type: String, default: "" },
  codeSnippet: { type: String, default: "" },
  language: { type: String, default: "" },
  userId: { type: String, required: true },
  email: { type: String },
  name: { type: String },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  liked: { type: Boolean, default: false },
  saved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", PostSchema);
