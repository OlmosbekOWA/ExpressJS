import express from "express";

import usersController from "../controllers/users.controller.js";
import authMiddleware from "../middlewars/auth.middleware.js";
const router = express.Router();

// Yangi user qo'shish (POST)
router.post("/posts", authMiddleware, usersController.posts);

// Barcha userlarni olish (GET) — test uchun
router.get("/users", authMiddleware, usersController.getAll);

// Bitta userni ID bo'yicha olish (ixtiyoriy)
router.get("/users/:id", authMiddleware, usersController.getOne);

// User malumotlarini o'chirish
router.delete("/delete/:id", authMiddleware, usersController.deleteUser)

export default router;