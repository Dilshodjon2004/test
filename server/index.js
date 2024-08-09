const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const Post = require("./models/Post.Schema");
const app = express();

const cors = require("cors");

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://dilshodjongulomov53:7ikAPijME04Brt0X@cluster0.6g2nc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "*", // Use env variable for allowed origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // If you need to allow cookies across origins
  }),
);
const storage = multer.memoryStorage();
const upload = multer({storage});

// Middleware
app.use(express.json());

// Route to create a new post
app.post("/posts", upload.single("image"), async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    const savedPost = await newPost.save();
    res.status(201).json({postId: savedPost._id});
  } catch (error) {
    res.status(500).send("Error creating post");
  }
});

// Route to fetch a post by ID
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    res.json({
      title: post.title,
      body: post.body,
      image: `data:${post.image.contentType};base64,${post.image.data.toString(
        "base64",
      )}`,
    });
  } catch (error) {
    res.status(500).send("Error fetching post");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
