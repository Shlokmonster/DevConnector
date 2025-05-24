import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "../src/supabaseclient.js"; // Adjust if needed
import Post from "./models/Post.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
const Connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// Verify Supabase JWT
const verifySupabaseJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) return res.status(401).json({ error: "Invalid token" });

  req.user = data.user;
  next();
};

// Create post
app.post("/api/posts", verifySupabaseJWT, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const post = new Post({
      content,
      userId: req.user.id,
      email: req.user.email,
      name: req.user.user_metadata?.name || req.user.email,
    });

    await post.save();
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error("❌ Post creation failed:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Get posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("❌ Failed to fetch posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// to count the likes in the database

app.put("/api/posts/:id/like", async(req,res)=>{
    try{
        const {liked ,likes} = req.body;
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {liked ,likes},
            {new:true}
        );
        res.json(post)
        }catch(err){
            console.error("❌ Failed to like post:", err);
        }
})

//  saving the post to the database
app.put("/api/posts/:id/save", async(req,res)=>{
    try{
        const {saved} = req.body;
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {saved},
            {new:true}
        );
        res.json(post)
        }catch(err){
            console.error("❌ Failed to save the post:", err);
        }
})




// Ping route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start server
const startServer = async () => {
  await Connectdb();
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
};

startServer();
