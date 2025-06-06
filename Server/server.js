import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "../src/supabaseclient.js"; // Adjust path as needed
import Post from "./models/Post.js";
import Profile from "./models/Profile.js";
import { parser } from "./middlewares/upload.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173","http://localhost:5174"],
  
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
const Connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// Verify Supabase JWT middleware
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
app.post("/api/posts", verifySupabaseJWT, parser.single("image"), async (req, res) => {
  try {
    const { content, codeSnippet, language } = req.body;
    
    // Check if any content is provided
    if (!content && !codeSnippet && !req.file) {
      return res.status(400).json({ error: "Post must contain content, code, or image" });
    }

    // Get the image URL from Cloudinary
    let imageUrl = "";
    if (req.file) {
      // The file is already uploaded to Cloudinary by multer-storage-cloudinary
      // The file object will have a 'path' property with the Cloudinary URL
      imageUrl = req.file.path;
    }

    const post = new Post({
      content: content || "",
      codeSnippet: codeSnippet || "",
      language: language || "",
      imageUrl,
      userId: req.user.id,
      email: req.user.email,
      name: req.user.user_metadata?.name || req.user.email,
      createdAt: new Date(),
      liked: false,
      likes: 0,
      saved: false,
    });

    await post.save();
    res.status(201).json({ 
      message: "Post created successfully", 
      post: {
        ...post._doc,
        // Ensure the image URL is properly returned
        imageUrl: imageUrl || post.imageUrl
      } 
    });
  } catch (err) {
    console.error("❌ Post creation failed:", err);
    // More specific error messages
    if (err.message.includes('File too large')) {
      return res.status(413).json({ error: "File size too large. Maximum size is 5MB." });
    } else if (err.message.includes('Only image files are allowed')) {
      return res.status(400).json({ error: "Only image files are allowed." });
    }
    res.status(500).json({ error: "Failed to create post. Please try again." });
  }
});

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("❌ Failed to fetch posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Like a post
app.put("/api/posts/:id/like", async (req, res) => {
  try {
    const { liked, likes } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { liked, likes },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.error("❌ Failed to like post:", err);
    res.status(500).json({ error: "Failed to like post" });
  }
});

// Save a post
app.put("/api/posts/:id/save", async (req, res) => {
  try {
    const { saved } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { saved },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    console.error("❌ Failed to save the post:", err);
    res.status(500).json({ error: "Failed to save the post" });
  }
});

//  delete the post 

app.delete("/api/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete the post:", err);
    res.status(500).json({ error: "Failed to delete the post" });
  }
});

// Get profile
app.get("/api/profile", verifySupabaseJWT, async (req, res) => {
  try {
    const profile = await Profile.findOne({ supabase_id: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error("❌ Failed to fetch the profile:", err);
    res.status(500).json({ error: "Failed to fetch the profile" });
  }
});

// Update or create profile
app.put("/api/profile", verifySupabaseJWT, async (req, res) => {
  try {
    const updates = req.body;
    const profile = await Profile.findOneAndUpdate(
      { supabase_id: req.user.id },
      updates,
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    console.error("❌ Failed to update profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  fetching all the users
app.get("/api/profiles", async(req,res)=>{
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json(profiles);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch profiles" });
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
