import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  supabase_id: { type: String, required: true, unique: true },
  username: { type: String },
  bio: { type: String },
  avatar: { type: String },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 }
}, { timestamps: true });

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;
