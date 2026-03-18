import express from "express";
import postCantroller from "../controllers/post.controller.js";
import logger from "../middlewars/logger.js";
import authMiddleware from "../middlewars/auth.middleware.js";
import authorMiddleware from "../middlewars/author.meddleware.js";

const router = express.Router();

router.get("/get", authMiddleware, postCantroller.getAll);          

router.post("/create", authMiddleware , logger, postCantroller.posts)

router.delete("/delete/:id", authMiddleware, authorMiddleware, postCantroller.delete);

router.put("/edit/:id", authMiddleware, authorMiddleware, postCantroller.edit)

router.get("/get-id/:id", authMiddleware, postCantroller.getOne)



export default router;