import express from "express"
import mongoose from 'mongoose';
import Post from "./models/post.model.js";


const app = express()

const DB_URL = "mongodb+srv://uzbmojor2810_db_user:ElMatodor2810@cluster0.naelb3h.mongodb.net/?appName=Cluster0"

const PORT = 3000



app.use(express.json())

app.get("/", async (req, res)=>{ 
  try {

    const allPost = await Post.find();  
    
    res.status(201).json(allPost);
  } catch (error) {

    
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }

  
})

app.post("/", async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title va body majburiy!" });
    }

    const newPost = await Post.create({ title, body });  
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Post yaratishda xato:", error.message);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
});





const bootstrap = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected DB ✅");

    app.listen(PORT, () => {
      console.log(`Listening on - http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Ulanish xatosi:", err);
  }
};


bootstrap()
