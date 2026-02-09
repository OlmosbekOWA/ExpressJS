import 'dotenv/config';   

import express from "express";
import mongoose from 'mongoose';
import fileUpload from "express-fileupload";
import postRoute from "./routers/post.route.js";

const app = express();


const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(fileUpload({}))
app.use(express.static("static"))


app.use("/api/post", postRoute);

const bootstrap = async () => {
  try {

    if (!process.env.DB_URL) {
      throw new Error("DB_URL .env faylida topilmadi yoki o'qilmadi!");
    }

    await mongoose.connect(process.env.DB_URL);

    app.listen(PORT, () => {
      console.log(`Server http://localhost:${PORT} da ishlamoqda`);
    });
  } catch (err) {
    console.error("Ulanish xatosi:", err.message);
    console.error(err);   
  }
};

bootstrap();