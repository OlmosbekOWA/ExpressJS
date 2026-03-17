import 'dotenv/config';   

//kutubxonalar
import express from "express";
import mongoose from 'mongoose';
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser';
import cors from 'cors';

//fayllar
import postRoute from "./routers/post.route.js";
import usersRouter from "./routers/users.route.js";
import authRouter from "./routers/auth.route.js"
import requestTime from './middlewars/request-time.js';
import errorHandler from './middlewars/errors.middlewers.js';


const app = express();

const PORT = process.env.PORT || 5000;
//meddlewars
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}))
app.use(express.static("static"))
app.use(requestTime)
app.use(cookieParser({}))

//routs
app.use("/api/post", postRoute);
app.use("/api/user", usersRouter);
app.use("/api/auth", authRouter)

//error handler
app.use(errorHandler)

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