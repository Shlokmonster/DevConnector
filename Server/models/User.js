import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,  // make sure no duplicate emails
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add any extra fields you want to store about users here:
  bio: String,
  age: Number,
  // etc...
});

const User = mongoose.model("User", userSchema);

export default User;
